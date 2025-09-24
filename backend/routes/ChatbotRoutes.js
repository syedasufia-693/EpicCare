import express from 'express';
import { Chatbot } from '../controllers/Chatbot.js';
const chatRoutes = express.Router();
chatRoutes.post('/medical-chatbot', Chatbot);
export default chatRoutes;