var buildTitle = require('../lib/globalData').buildTitle;

exports['build valid titles'] = function(test){
    test.expect(3);

    test.equals(buildTitle([], '0.0.1'), 'Globe 0.0.1');
    test.equals(buildTitle(['foo'], '0.0.1'), 'foo | Globe 0.0.1');
    test.equals(buildTitle(['foo', 'bar'], '0.0.1'), 'foo | bar | Globe 0.0.1');

    test.done();
};