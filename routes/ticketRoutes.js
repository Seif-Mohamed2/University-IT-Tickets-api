const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketsController');
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT)

router.route('/')
    .get(ticketController.getAllTickets)
    .post(ticketController.createNewTicket)
    .patch(ticketController.updateTicket)
    .delete(ticketController.deleteTicket)

module.exports = router;

