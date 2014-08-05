/* global describe, it */

var expect = require('expect.js');

/**
 * compare 2 values by adding its stringified charcode
 * @param {*} arr1 Value 1
 * @param {*} arr2 Value 2
 * @return {boolean} if both of them are equal
 */
function stringifiedCompare(arr1, arr2) {
    var jA1 = JSON.stringify(arr1),
        jA2 = JSON.stringify(arr2),
        nA1 = 0,
        nA2 = 0;

    for(var j = 0; j < jA2.length; j++) {
        nA2 += jA2.charCodeAt(j);
    }
    for(var i = 0; i < jA1.length; i++) {
        nA1 += jA1.charCodeAt(i);
    }

    return nA1 === nA2;
}

describe('count-array-uniques.test', function () {
    var countUniques = require('../../../src/lib/util/count-array-uniques');

    it('tests for duplicates', function () {
        expect(stringifiedCompare(countUniques(['de', 'uk', 'us', 'de', null, 'at', null]), [
            ['de', 2],
            ['uk', 1],
            ['us', 1],
            ['at', 1],
            [null, 2]
        ])).to.be.ok();

        expect(stringifiedCompare(countUniques(['de', 'uk', 'us', 'de', 'at']), [
            ['de', 2],
            ['uk', 1],
            ['us', 1],
            ['at', 1]
        ])).to.be.ok();
    });
});
