var countries = require('./static').countries;
var countriesArray = [];

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

var icons = {
    // map to convert given string to a character
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
};

// fill countries array
Object.keys(countries).forEach(function(country){
    countriesArray.push({
        key: country,
        value: countries[country]
    });
});

// fill flags array
Object.keys(flags).forEach(function(flag){
    flagsArray.push({
        key: flag,
        value: flag
    });
});

module.exports = {
    version: '',
    title: [],
    buildTitle: function(title, version) {
        // join title segments
        return (title.length ? title.join(' | ') + ' | Globe' : 'Globe') + ' ' + version;
    },
    query: '',
    path: 'index',
    search: {
        'type': ['relay', 'bridge'],
        'running': ['true', 'false']
    },
    countries: countries,
    countriesArray: countriesArray,
    flags: flags,
    flagsArray: flagsArray,
    icons: icons,
    filter: {
        type: '',
        running: '',
        country: '',
        as: '',
        flag: ''
    }
};