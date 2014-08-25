/* global describe, it */

var expect = require('expect.js');

describe('compare version', function () {
    var compareVersions = require('../../../src/lib/util/compare-version');

    it('comparison with non string arguments', function () {
        expect([null, '2.0.0.0'].sort(compareVersions)).to.eql([null, '2.0.0.0']);
        expect([undefined, '1.1.0.0'].sort(compareVersions)).to.eql(['1.1.0.0', undefined]);
        expect(compareVersions(undefined, '1.1.0.0')).to.eql(-1);
        expect(compareVersions('1.1.0.0', undefined)).to.eql(-1);
    });

    it('major comparisons', function () {
        expect(['2.0.0.0', '2.0.0.0'].sort(compareVersions)).to.eql(['2.0.0.0', '2.0.0.0']);
        expect(['2.0.0.0', '1.1.0.0'].sort(compareVersions)).to.eql(['1.1.0.0', '2.0.0.0']);
        expect(['1.1.0.0', '2.0.0.0'].sort(compareVersions)).to.eql(['1.1.0.0', '2.0.0.0']);
    });
    it('minor comparisons', function () {
        expect(['0.1.0.0', '0.1.0.0'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.0.0']);
        expect(['2.0.0.0', '2.1.0.0'].sort(compareVersions)).to.eql(['2.0.0.0', '2.1.0.0']);
        expect(['2.1.0.0', '2.0.0.0'].sort(compareVersions)).to.eql(['2.0.0.0', '2.1.0.0']);
    });
    it('build comparisons', function () {
        expect(['0.1.0.0', '0.1.0.0'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.0.0']);
        expect(['0.1.0.0', '0.1.1.0'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.1.0']);
        expect(['0.1.1.0', '0.1.0.0'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.1.0']);
    });
    it('revision comparisons', function () {
        expect(['0.1.0.1', '0.1.0.1'].sort(compareVersions)).to.eql(['0.1.0.1', '0.1.0.1']);
        expect(['0.1.0.0', '0.1.0.1'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.0.1']);
        expect(['0.1.0.1', '0.1.0.0'].sort(compareVersions)).to.eql(['0.1.0.0', '0.1.0.1']);
    });
});
