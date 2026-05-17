export default class RagController {
  constructor({ ingestService, ragService }) {
    this.ingestService = ingestService;
    this.ragService = ragService;

    this.ingest = this.ingest.bind(this);
    this.ask = this.ask.bind(this);
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
      const result = await this.ragService.ask(question, { source, topK, similarityThreshold });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
