import express from 'express';
import { contactsroute, chatroute } from '../../routes/v1';

/**
 * @type function
 * @description define apis route files.
 */
export default () => {
  const api = express.Router();
  const contactsapi = contactsroute(api);
  const chatapi = chatroute(api);

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({
      version: '1.0'
    });
  });
  return api;
};
