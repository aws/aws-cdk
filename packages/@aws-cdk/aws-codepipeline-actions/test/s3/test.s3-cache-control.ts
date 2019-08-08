import { Duration } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

const testDuration = Duration.hours(1);
const serialize = cpactions.serializeCacheControlOptions;

export = {
  'individual options'(test: Test) {
    test.equal(serialize({maxAge: testDuration}), 'max-age=3600');
    test.equal(serialize({noCache: true}), 'no-cache');
    test.equal(serialize({noStore: true}), 'no-store');
    test.equal(serialize({noTransform: true}), 'no-transform');
    test.equal(serialize({of: ['arbitrary!Value']}), 'arbitrary!Value');
    test.equal(serialize({mustRevalidate: true}), 'must-revalidate');
    test.equal(serialize({public: true}), 'public');
    test.equal(serialize({private: true}), 'private');
    test.equal(serialize({proxyRevalidate: true}), 'proxy-revalidate');
    test.equal(serialize({sMaxAge: testDuration}), 's-maxage=3600');
    test.done();
  },
  'falsy value'(test: Test) {
    test.equal(serialize({}), '');
    test.equal(serialize({maxAge: Duration.seconds(0)}), 'max-age=0');
    test.done();
  },
  'multiple options'(test: Test) {
    test.equal(serialize({noCache: true, noStore: true}), 'no-cache, no-store');
    test.equal(serialize({noCache: true, maxAge: testDuration}), 'no-cache, max-age=3600');
    test.equal(serialize({noCache: true, of: ['foo, bar', 'value=test']}), 'no-cache, foo, bar, value=foo');

    test.done();
  },
};
