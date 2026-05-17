function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

function withTimeout(promise, timeoutMs, message) {
  let timeout;

  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
}

async function closeResource(resource, logger) {
  const startedAt = Date.now();
  await resource.close();

  logger.info('resource_closed', {
    resource: resource.name,
    durationMs: Date.now() - startedAt,
  });
}

export function registerGracefulShutdown({
  server,
  logger,
  resources = [],
  shutdownTimeoutMs,
  forceShutdownTimeoutMs,
}) {
  let shuttingDown = false;
  const sockets = new Set();

  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  async function shutdown(reason, error = null) {
    if (shuttingDown) return;
    shuttingDown = true;

    const exitCode = error ? 1 : 0;

    logger.info('shutdown_started', {
      reason,
      exitCode,
      openConnections: sockets.size,
      error: error?.message,
    });

    const forceShutdownTimer = setTimeout(() => {
      logger.error('shutdown_forced', {
        reason,
        openConnections: sockets.size,
        timeoutMs: forceShutdownTimeoutMs,
      });

      for (const socket of sockets) {
        socket.destroy();
      }

      process.exit(1);
    }, forceShutdownTimeoutMs);

    forceShutdownTimer.unref();

    try {
      if (typeof server.closeIdleConnections === 'function') {
        server.closeIdleConnections();
      }

      await withTimeout(
        closeServer(server),
        shutdownTimeoutMs,
        'HTTP server shutdown timeout',
      );

      await Promise.all(resources.map((resource) => closeResource(resource, logger)));

      clearTimeout(forceShutdownTimer);

      logger.info('shutdown_completed', {
        reason,
        exitCode,
      });

      process.exit(exitCode);
    } catch (shutdownError) {
      clearTimeout(forceShutdownTimer);

      logger.error('shutdown_failed', {
        reason,
        error: shutdownError.message,
        stack: shutdownError.stack,
      });

      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }

      process.exit(1);
    }
  }

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('uncaughtException', (error) => {
    logger.error('uncaught_exception', {
      error: error.message,
      stack: error.stack,
    });

    void shutdown('uncaughtException', error);
  });

  process.once('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));

    logger.error('unhandled_rejection', {
      error: error.message,
      stack: error.stack,
    });

    void shutdown('unhandledRejection', error);
  });

  return { shutdown };
}
