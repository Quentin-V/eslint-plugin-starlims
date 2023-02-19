const noSynchronousRequests = require('./rules/no-synchronous-requests');
const checkServerFunctions = require('./rules/check-server-functions');

module.exports = {
    'no-synchronous-requests': noSynchronousRequests,
    'check-server-functions': checkServerFunctions,
};