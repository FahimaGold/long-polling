const clientService = require('../services/clientService');
const messageService = require('../services/messageService');

// Adding client that long-polls
exports.poll = (req, res) => {
    const clientId = req.params.clientId;
    clientService.addClient(clientId, res);
}

// Sending message to the client that is long-polling
exports.sendMessage = (req, res) => {
    const { to, message } = req.body;
    messageService.deliverMessage(to, message);
    res.sendStatus(200);
  };