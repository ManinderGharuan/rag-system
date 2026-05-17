import { GoogleGenAI } from '@google/genai';

export default class GeminiStrategy {
  constructor({ apiKey, embeddingModel, chatModel, dimensions }) {
    this.embeddingModel = embeddingModel;
    this.chatModel = chatModel;
    this.dimensions = dimensions;
    this.client = new GoogleGenAI({ apiKey });
  }

  async embed(text) {
    const response = await this.client.models.embedContent({
      model: this.embeddingModel,
      contents: text,
      config: {
        outputDimensionality: this.dimensions,
      },
    });

    return response.embeddings[0].values;
  }

  async generate(prompt) {
    const response = await this.client.models.generateContent({
      model: this.chatModel,
      contents: prompt,
      generationConfig: { temperature: 0.2 },
    });

    return response.text;
  }
}
