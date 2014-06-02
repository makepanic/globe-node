/* global describe, it */
/* eslint camelcase: 0 */

var expect = require('expect.js');

describe('create-sort-fn', function () {
    var createSortFn = require('../../../src/lib/util/create-sort-fn');
    var numeric = createSortFn.numeric,
        string = createSortFn.string,
        firstObjectKeyString = createSortFn.firstObjectKeyString,
        objectKeysLength = createSortFn.objectKeysLength,
        arrayLength = createSortFn.arrayLength;

    describe('numeric', function () {
        it('test ascending sort function', function () {
            var sortObjs = [
                    {
                        middle_probability: 0
                    },
                    {
                        middle_probability: 0.012074938
                    }
                ],
                sortFn = numeric('middle_probability', true);

            expect(sortObjs.sort(sortFn)).to.eql([
                {
                    middle_probability: 0
                },
                {
                    middle_probability: 0.012074938
                }
            ]);
        });
        it('test descending sort function', function () {
            var sortObjs = [
                    {middle_probability: 0.029267732},
                    {middle_probability: 0.0076508727},
                    {middle_probability: 0.008124595},
                    {middle_probability: 0},
                    {middle_probability: 0.013642281},
                    {middle_probability: 0.010691774},
                    {middle_probability: 0.012074938},
                    {middle_probability: 0.01073874},
                    {middle_probability: 0.008908265},
                    {middle_probability: 0.007468869}
                ],
                sortFn = numeric('middle_probability', false);

            expect(sortObjs.sort(sortFn)).to.eql([
                {middle_probability: 0.029267732},
                {middle_probability: 0.013642281},
                {middle_probability: 0.012074938},
                {middle_probability: 0.01073874},
                {middle_probability: 0.010691774},
                {middle_probability: 0.008908265},
                {middle_probability: 0.008124595},
                {middle_probability: 0.0076508727},
                {middle_probability: 0.007468869},
                {middle_probability: 0}
            ]);
        });
    });

    describe('string', function () {
        it('test ascending sort function', function () {
            var sortObjs = [
                    {
                        name: 'a'
                    },
                    {
                        name: 'b'
                    }
                ],
                sortFn = string('name', true);

            expect(sortObjs.sort(sortFn)).to.eql([
                {
                    name: 'a'
                },
                {
                    name: 'b'
                }
            ]);
        });
        it('test descending sort function', function () {
            var sortObjs = [
                    {
                        name: 'a'
                    },
                    {
                        name: 'b'
                    }
                ],
                sortFn = string('name', false);

            expect(sortObjs.sort(sortFn)).to.eql([
                {
                    name: 'b'
                },
                {
                    name: 'a'
                }
            ]);
        });
    });

    describe('firstObjectKeyString', function () {
        it('test ascending sort function', function () {
            var sortObjs = [{
                    country: {
                        de: 1
                    }
                },{
                    country: {
                        en: 22
                    }
                }],
                sortFn = firstObjectKeyString('country', true);

            expect(sortObjs.sort(sortFn)).to.eql([
                {
                    country: {
                        de: 1
                    }
                },{
                    country: {
                        en: 22
                    }
                }
            ]);
        });
        it('test descending sort function', function () {
            var sortObjs = [{
                    country: {
                        de: 1
                    }
                },{
                    country: {
                        en: 22
                    }
                }],
                sortFn = firstObjectKeyString('country', false);

            expect(sortObjs.sort(sortFn)).to.eql([
                {
                    country: {
                        en: 22
                    }
                },{
                    country: {
                        de: 1
                    }
                }
            ]);
        });
    });

    describe('objectKeysLength', function () {
        it('test ascending sort function', function () {
            var sortObjs = [{
                    country: {
                        de: 21,
                        uk: 2
                    }
                },{
                    country: {
                        uk: 22,
                        it: 1,
                        fr: 2
                    }
                }],
                sortFn = objectKeysLength('country', true);

            expect(sortObjs.sort(sortFn)).to.eql([{
                country: {
                    de: 21,
                    uk: 2
                }
            },{
                country: {
                    uk: 22,
                    it: 1,
                    fr: 2
                }
            }]);
        });
        it('test descending sort function', function () {
            var sortObjs = [{
                    country: {
                        de: 21,
                        uk: 2
                    }
                },{
                    country: {
                        uk: 22,
                        it: 1,
                        fr: 2
                    }
                }],
                sortFn = objectKeysLength('country', false);

            expect(sortObjs.sort(sortFn)).to.eql([{
                country: {
                    uk: 22,
                    it: 1,
                    fr: 2
                }
            },{
                country: {
                    de: 21,
                    uk: 2
                }
            }]);
        });
    });
    describe('arrayLength', function () {
        it('test ascending sort function', function () {
            var sortObjs = [{
                    fingerprints: [1,2,3]
                },{
                    fingerprints: [1]
                }],
                sortFn = arrayLength('fingerprints', true);

            expect(sortObjs.sort(sortFn)).to.eql([{
                fingerprints: [1]
            },{
                fingerprints: [1,2,3]
            }]);
        });
        it('test descending sort function', function () {
            var sortObjs = [{
                    fingerprints: [1,2,3]
                },{
                    fingerprints: [1]
                }],
                sortFn = arrayLength('fingerprints', false);

            expect(sortObjs.sort(sortFn)).to.eql([{
                fingerprints: [1,2,3]
            },{
                fingerprints: [1]
            }]);
        });
    });
});