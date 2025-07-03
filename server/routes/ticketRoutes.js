import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getMyTickets, createTicket, getTicketsByUserId, assignTicket, getAssignedTickets, getTicketDashboard } from '../controllers/ticketController.js';
import { getTicketById } from '../controllers/ticketController.js';
import { updateTicket } from '../controllers/ticketController.js';
import { getAllTickets } from '../controllers/ticketController.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { Reply } from '../models/Reply.js';

const router = express.Router();

router.get('/my-tickets', verifyToken, getMyTickets);
router.post('/create', verifyToken, roleMiddleware(['user']), createTicket);

// For agent
router.get('/assigned', verifyToken, roleMiddleware(['agent']), getAssignedTickets);
router.get('/dashboard', verifyToken, roleMiddleware(['agent']), getTicketDashboard);

//only admin to access this route
router.get('/all', verifyToken, roleMiddleware(['admin']), getAllTickets);  
router.get('/user/:userId', verifyToken, roleMiddleware(['admin']), getTicketsByUserId);
router.patch('/assign/:ticketId', verifyToken, roleMiddleware(['admin']), assignTicket);




router.get('/:ticketId', verifyToken, getTicketById);


// router.put('/:ticketId', verifyToken, updateTicket);
// router.delete('/:ticketId', verifyToken, deleteTicket);

export default router;
