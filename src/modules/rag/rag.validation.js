import Joi from 'joi';

export const ingestSchema = Joi.object({
  source: Joi.string().trim().min(1).max(255).required(),
  text: Joi.string().trim().min(1).required(),
  chunkSize: Joi.number().integer().min(100).max(5000).optional(),
  overlap: Joi.number().integer().min(0).max(1000).optional(),
});

export const askSchema = Joi.object({
  question: Joi.string().trim().min(1).required(),
  source: Joi.string().trim().min(1).max(255).optional(),
  topK: Joi.number().integer().min(1).max(20).default(4),
  similarityThreshold: Joi.number().min(0).max(1).default(0.5),
});
