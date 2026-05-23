import Joi from 'joi';

export const createTreeSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
});

export const updateTreeSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
}).min(1);

export const createNodeSchema = Joi.object({
  type: Joi.string().valid('question', 'leaf', 'rag').required(),
  content: Joi.string().trim().min(1).required(),
  isRoot: Joi.boolean().optional(),
});

export const updateNodeSchema = Joi.object({
  type: Joi.string().valid('question', 'leaf', 'rag').optional(),
  content: Joi.string().trim().min(1).optional(),
  isRoot: Joi.boolean().optional(),
}).min(1);

export const createOptionSchema = Joi.object({
  label: Joi.string().trim().min(1).max(255).required(),
  nextNodeId: Joi.string().uuid().allow(null).optional(),
  order: Joi.number().integer().min(0).default(0),
});

export const updateOptionSchema = Joi.object({
  label: Joi.string().trim().min(1).max(255).optional(),
  nextNodeId: Joi.string().uuid().allow(null).optional(),
  order: Joi.number().integer().min(0).optional(),
}).min(1);

export const startSessionSchema = Joi.object({
  sessionId: Joi.string().uuid().optional(),
});

export const traverseSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  optionId: Joi.string().uuid().required(),
});

export const ragAskSchema = Joi.object({
  question: Joi.string().trim().min(1).required(),
  source: Joi.string().trim().min(1).max(255).optional(),
  sessionId: Joi.string().uuid().optional(),
  topK: Joi.number().integer().min(1).max(20).default(4),
  similarityThreshold: Joi.number().min(0).max(1).default(0.5),
});
