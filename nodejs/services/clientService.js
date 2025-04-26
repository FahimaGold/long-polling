const clients = {}; // { clientID: { res, timeoutID } }
// In order to manage several clients by the server
exports.addClient = (clientID, res) => {
    clients[clientID] = res;
    console.log(`Client ${clientID} connected`);
    // Polling timeout after 30 Seconds
    const timeoutID = setTimeout(() => {
        if (clients[clientID]) {
            res.status(204).end();
            delete clients[clientID];
            console.log(`Client ${clientID} timeout and disconnected`);
        }
       
    }, 30000);
    /* Store both res and timeout ID
     Storing timeout ID to be able to clear it if the message is sent before timeout, it means the connection will be closed, and to prevent trying to close it during timeout, as it will be already closed, and HTTP only allows one response per request*/

    clients[clientID] = { res, timeoutID };
}

// get client response, which will be used to perform action on the client's request.
exports.getClientResponse = (clientId) => {
    return clients[clientId]?.res;
};

// deleting client after receiving the message, following the long polling logic, closing the connection when delivering the message or reaching the timeout of the polling.
exports.removeClient = (clientId) => {
    const client = clients[clientId];
    if (client) {
        clearTimeout(client.timeoutID); // clear timeout when manually closing
        delete clients[clientId];
        console.log(`Client ${clientId} manually removed`);
    }
};