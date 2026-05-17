import { v4 as uuidv4 } from 'uuid';

export default class RagController {
  constructor({ ingestService, ragService, conversationService }) {
    this.ingestService = ingestService;
    this.ragService = ragService;
    this.conversationService = conversationService;

    this.ingest = this.ingest.bind(this);
    this.ask = this.ask.bind(this);
    this.getConversation = this.getConversation.bind(this);
    this.deleteConversation = this.deleteConversation.bind(this);
    this.listSessions = this.listSessions.bind(this);
  }

  async ingest(req, res, next) {
    try {
      const { text, source, chunkSize, overlap } = req.body;
      const result = await this.ingestService.ingestDocument(text, source, { chunkSize, overlap });

      res.status(201).json({
        success: true,
        message: `Ingested: ${source}`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async ask(req, res, next) {
    try {
      const { question, source, topK, similarityThreshold } = req.body;

      const sessionId = req.body.sessionId || uuidv4();

      const result = await this.ragService.ask(question, { source, topK, similarityThreshold, sessionId });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getConversation(req, res, next) {
    try {
      const { sessionId } = req.params;
      const history = await this.conversationService.getFormattedHistory(sessionId);
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }

  async deleteConversation(req, res, next) {
    try {
      const { sessionId } = req.params;
      await this.conversationService.clearHistory(sessionId);
      res.json({ success: true, message: `Cleared session ${sessionId}` });
    } catch (err) {
      next(err);
    }
  }

  async listSessions(req, res, next) {
    try {
      const sessions = await this.conversationService.listSessions();
      res.json({ success: true, data: sessions });
    } catch (err) {
      next(err);
    }
  }
}
