var Chance = require('chance'),
    moment = require('moment'),
    data = require('../global-data');

var chance = new Chance();

module.exports = function (details) {
    /* eslint camelcase: 0, curly: 0 */
    details.relays.forEach(function (relay) {
        if (relay.nickname) relay.nickname = chance.string({length: 5});
        relay.fingerprint = chance.hash();
        relay.or_addresses = relay.or_addresses.map(function () {
            return chance.ip();
        });
        if (relay.exit_addresses)
            relay.exit_addresses = relay.exit_addresses.map(function () {
                return chance.ip();
            });
        if (relay.dir_address) relay.dir_address = chance.ip();
        relay.last_seen = moment(chance.date()).format('YYYY-MM-DD HH:mm:ss');
        relay.last_changed_address_or_port = moment(chance.date()).format('YYYY-MM-DD HH:mm:ss');
        relay.first_seen = moment(chance.date()).format('YYYY-MM-DD HH:mm:ss');
        relay.running = chance.bool();
        if (relay.hibernating)
            relay.hibernating = chance.bool();
        if (relay.flags)
            relay.flags = chance.pick(['Fast', 'Running', 'BadExit', 'Authority', 'Guard', 'HSDir', 'Named', 'Stable', 'V2Dir', 'Valid', 'Unnamed', 'Exit'], chance.integer({min: 1, max: 12}));
        if (relay.latitude)
            relay.latitude = chance.latitude();
        if (relay.longitude)
            relay.longitude = chance.longitude();
        if (relay.country) {
            var country = chance.pick(data.countriesArray);
            relay.country = country.key;
            relay.country_name = country.value;
        }
        if (relay.region_name)
            relay.region_name = chance.province({full: true});
        if (relay.city_name)
            relay.city_name = chance.city();

        if (relay.as_number)
            relay.as_number = 'AS' + chance.integer({min: 0, max: 99999});
        if (relay.as_name)
            relay.as_name = chance.string();
        relay.consensus_weight = chance.integer({min: 0, max: 180000});
        if (relay.host_name)
            relay.host_name = chance.domain();

        if (relay.last_restarted)
            relay.last_restarted = moment(chance.date()).format('YYYY-MM-DD HH:mm:ss');
        if(relay.bandwidth_rate)
            relay.bandwidth_rate = chance.integer({min: 0, max: 1070000000});
        if(relay.bandwidth_burts)
            relay.bandwidth_burst = chance.integer({min: 0, max: 1070000000});
        if (relay.observed_bandwidth)
            relay.observed_bandwidth = chance.integer({min: 0, max: 3000000});
        if (relay.advertised_bandwidth)
            relay.advertised_bandwidth = chance.integer({min: 0, max: 3000000});
        if (relay.contact)
            relay.contact = chance.string();
        relay.recommended_version = chance.bool();
    });
};
