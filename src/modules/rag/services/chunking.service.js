function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize || 500;
  const overlap = options.overlap || 100;

  if (chunkSize <= 0) throw new Error('chunkSize must be greater than 0');
  if (overlap < 0) throw new Error('overlap cannot be negative');
  if (overlap >= chunkSize) throw new Error('overlap must be smaller than chunkSize');

  const chunks = [];
  const cleaned = text.replace(/\s+/g, ' ').trim();
  let start = 0;

  while (start < cleaned.length) {
    const end = start + chunkSize;
    let chunk = cleaned.slice(start, end);

    if (end < cleaned.length) {
      const lastPeriod = chunk.lastIndexOf('. ');
      if (lastPeriod > chunkSize * 0.5) {
        chunk = chunk.slice(0, lastPeriod + 1);
      }
    }

    const trimmedChunk = chunk.trim();
    if (!trimmedChunk.length) break;

    chunks.push({
      content: trimmedChunk,
      index: chunks.length,
      start,
      end: start + trimmedChunk.length,
    });

    const nextStart = start + chunk.length - overlap;
    if (nextStart <= start) break;

    start = nextStart;
  }

  return chunks;
}

export default class ChunkingService {
  chunkText(text, options = {}) {
    return chunkText(text, options);
  }
}
