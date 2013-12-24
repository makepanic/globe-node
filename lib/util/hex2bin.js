module.exports = function(hex) {
    var bin = '',
        bytes = [],
        str,
        i;

    for(i = 0; i< hex.length-1; i += 2){
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    str = String.fromCharCode.apply(String, bytes);

    if(str.length){
        bin = str;
    }
    return bin;
};