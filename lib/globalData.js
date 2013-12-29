var countries = require('./static').countries,
    countriesArray = [];

var flags = {
    'Fast': 'fa-bolt',
    'Running': 'fa-code-fork',
    'BadExit': 'fa-warning',
    'Authority': 'fa-user-md',
    'Guard': 'fa-shield',
    'HSDir': 'fa-book',
    'Named': 'fa-info',
    'Stable': 'fa-anchor',
    'V2Dir': 'fa-folder',
    'Valid': 'fa-check',
    'Unnamed': 'fa-question',
    'Exit': 'fa-sign-out'
    },
    flagsArray = [];


// fill countries array
for(var country in countries){
    if(countries.hasOwnProperty(country)){
        countriesArray.push({
            key: country,
            value: countries[country]
        });
    }
}

exports.countriesArray = [];

module.exports = {
    search: {
        'type': ['relay', 'bridge'],
        'running': ['true', 'false']
    },
    countries: countries,
    countriesArray: countriesArray,
    flags: flags,
    flagsArray: flagsArray
};