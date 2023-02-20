const noSynchronousRequests = require('./rules/no-synchronous-requests');
const checkServerFunctions = require('./rules/check-server-functions');
const checkUnconvertedFunctions = require('./rules/check-unconverted-functions');

module.exports = {
    'no-synchronous-requests': noSynchronousRequests,
    'check-server-functions': checkServerFunctions,
    'check-unconverted-functions': checkUnconvertedFunctions
};