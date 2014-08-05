module.exports = function (array) {
    if (!array.length || array[array.length - 1] !== undefined) {
        return array;
    }

    var undefinedArray = array.splice(array.indexOf(undefined));
    return undefinedArray.concat(array);
};
