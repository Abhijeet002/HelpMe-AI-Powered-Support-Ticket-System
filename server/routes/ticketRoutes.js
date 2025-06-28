import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getMyTickets, createTicket } from '../controllers/ticketController.js';
import { getTicketById } from '../controllers/ticketController.js';
import { updateTicket } from '../controllers/ticketController.js';
import { getAllTickets } from '../controllers/ticketController.js';

const router = express.Router();


router.get('/my-tickets', verifyToken, getMyTickets);
router.post('/create', verifyToken, createTicket);
router.get('/:ticketId', verifyToken, getTicketById);
router.get('/all', verifyToken, getAllTickets);

// router.put('/:ticketId', verifyToken, updateTicket);
// router.delete('/:ticketId', verifyToken, deleteTicket);

export default router;
