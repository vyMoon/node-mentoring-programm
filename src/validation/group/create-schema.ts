import * as Joi from 'joi';

export const createGroupSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  permissions: Joi.array().required().max(5).items(Joi.string().valid(
    'READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILE'
  ))
}) 