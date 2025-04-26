const {getClientResponse, removeClient} = require('./clientService');

// Delivering the message to the client that is long-polling
exports.deliverMessage =  (to, message) => {
    const clientResponse = getClientResponse(to);
    if (clientResponse) {
        clientResponse.json([message]);
        console.log(`Message Delivered: ${message}`);
        removeClient(to);
      } else {
        console.log(`Client ${to} not connected`);
      }
}                                 