var _ = require('lodash-node'),
    OnionooErrors = require('./onionoo/errors');

module.exports = _.merge({
    RelayNotFound: 'Couldn\'t find requested relay.',
    BridgeNotFound: 'Couldn\'t find requested bridge.'
}, OnionooErrors);
