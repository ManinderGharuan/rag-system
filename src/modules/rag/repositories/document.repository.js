function toVector(embedding) {
  return JSON.stringify(embedding);
}

export default class DocumentRepository {
  constructor(db) {
    this.db = db;
  }

  async replaceSourceChunks(source, chunks, embeddings) {
    await this.db.transaction(async (trx) => {
      await trx('documents').where({ source }).del();

      if (!chunks.length) return;

      const rows = chunks.map((chunk, index) => ({
        source,
        chunk_index: chunk.index,
        content: chunk.content,
        embedding: trx.raw('?::vector', [toVector(embeddings[index])]),
      }));

      await trx('documents').insert(rows);
    });
  }

  async findSimilarChunks({ embedding, source = null, limit = 4 }) {
    const vector = toVector(embedding);
    const query = this.db('documents')
      .select('content', 'source', 'chunk_index')
      .select(this.db.raw('1 - (embedding <=> ?::vector) AS similarity', [vector]))
      .orderByRaw('embedding <=> ?::vector', [vector])
      .limit(limit);

    if (source) {
      query.where('source', source);
    }

    return query;
  }
}
