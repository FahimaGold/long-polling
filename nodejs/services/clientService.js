const clients = {}; // { clientID: { res, timeoutID } }
// In order to manage several clients by the server
exports.addClient = (clientID, res) => {
    console.log(`Client ${clientID} connected`);

    const timeoutID = setTimeout(() => {
        if (clients[clientID]) {
            console.log(`Client ${clientID} timeout and disconnected`);
            res.status(204).end();
        }
    }, 30000);

    clients[clientID] = { res, timeoutID };

    // Listen to when the response actually finishes
    res.on('finish', () => {
        console.log(`Response finished for ${clientID}, cleaning up.`);
        clearTimeout(timeoutID);
        delete clients[clientID];
    });
};


// get client response, which will be used to perform action on the client's request.
exports.getClientResponse = (clientId) => clients[clientId]?.res;

// deleting client after receiving the message, following the long polling logic, closing the connection when delivering the message or reaching the timeout of the polling.
exports.removeClient = (clientID) => {
    const client = clients[clientID];
    if (client) {
        client.res.end();
    }
};
