/*globals describe, it */

var verifier = require('./util/verifier'),
    docs = require('./generated-cases').testDocuments,
    guards = require('./util/guards'),
    assert = require('chai').assert,
    clone = require('clone');

docs.forEach(function (doc) {
    var guard = doc.guard,
        skip = false,
        skipText = '';

    if (guard && guards[guard]) {
        if (!guards[guard]()) {
            skip = true;
            skipText = '[SKIP] ';
        }
    }

    describe(skipText + doc.file + '/' + (doc.name || 'suite'), function () {
        if (doc.err) {
            it('has errors', function () {
               assert.ok(false, doc.err);
            });
        }
        else {
            (doc.tests || []).forEach(function (t) {
                var fn =  function () {
                    var v = verifier.create(doc.code, doc.opts || {}),
                        test = clone(t),
                        args = test.args,
                        out = test.out;
                    delete test.args;
                    delete test.out;
                    if (args !== '__notest__') {
                        v.verify(args, out, test);
                    }
                };
                if (skip) {
                    it.skip(t.name || 'test', fn);
                } else {
                    it(t.name || 'test', fn);
                }
            });
        }
    });
});

