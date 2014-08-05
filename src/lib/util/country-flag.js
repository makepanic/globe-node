var constants = require('../static');

module.exports = function(value){
    var fullCountry = '';

    if(constants.countries.hasOwnProperty(value)){
        fullCountry = constants.countries[value];
    }else{
        fullCountry = constants.messages.dataEmpty;
        value = 'empty';
    }

    return '<span title="' + fullCountry + '" data-tooltip class="country-flag ' + value + '_png"></span>';
};
