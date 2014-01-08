module.exports = function(value){
    var hex40CharRegex = /^[a-f0-9]{40}/i,
        result;

    result = value.match(hex40CharRegex);

    return result !== null;
};