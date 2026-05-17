import OpenAI from 'openai';

export default class OpenAIStrategy {
  constructor({ apiKey, embeddingModel, chatModel }) {
    this.embeddingModel = embeddingModel;
    this.chatModel = chatModel;
    this.client = new OpenAI({ apiKey });
  }

  async embed(text) {
    const response = await this.client.embeddings.create({
      model: this.embeddingModel,
      input: text,
    });

    return response.data[0].embedding;
  }

  async generate(prompt) {
    const response = await this.client.chat.completions.create({
      model: this.chatModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  }
}
