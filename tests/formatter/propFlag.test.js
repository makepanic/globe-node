var formatter = require('../../lib/util/formatter');

exports['checks propFlag'] = function (test) {
    var testFn = formatter.propFlag;

    test.expect(14);

    test.deepEqual(testFn('Fast'), '<span class="fa fa-bolt" title="Fast"></span>');
    test.deepEqual(testFn('Running'), '<span class="fa fa-code-fork" title="Running"></span>');
    test.deepEqual(testFn('BadExit'), '<span class="fa fa-warning" title="BadExit"></span>');
    test.deepEqual(testFn('Authority'), '<span class="fa fa-user-md" title="Authority"></span>');
    test.deepEqual(testFn('Guard'), '<span class="fa fa-shield" title="Guard"></span>');
    test.deepEqual(testFn('HSDir'), '<span class="fa fa-book" title="HSDir"></span>');
    test.deepEqual(testFn('Named'), '<span class="fa fa-info" title="Named"></span>');
    test.deepEqual(testFn('Stable'), '<span class="fa fa-anchor" title="Stable"></span>');
    test.deepEqual(testFn('V2Dir'), '<span class="fa fa-folder" title="V2Dir"></span>');
    test.deepEqual(testFn('Valid'), '<span class="fa fa-check" title="Valid"></span>');
    test.deepEqual(testFn('Unnamed'), '<span class="fa fa-question" title="Unnamed"></span>');
    test.deepEqual(testFn('Exit'), '<span class="fa fa-sign-out" title="Exit"></span>');

    test.deepEqual(testFn('Foo'), '');
    test.deepEqual(testFn(null), '');

    test.done();
};