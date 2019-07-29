import { Duration } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

const testDuration = Duration.hours(1);

export = {
  'shared directives': {
    'max-age'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).maxAge(testDuration).toString(), 'max-age=3600');
      test.equal((new cpactions.CacheControlResponse()).maxAge(testDuration).toString(), 'max-age=3600');

      test.done();
    },
    'no-cache'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).noCache().toString(), 'no-cache');
      test.equal((new cpactions.CacheControlResponse()).noCache().toString(), 'no-cache');

      test.done();
    },
    'no-store'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).noStore().toString(), 'no-store');
      test.equal((new cpactions.CacheControlResponse()).noStore().toString(), 'no-store');

      test.done();
    },
    'no-transform'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).noTransform().toString(), 'no-transform');
      test.equal((new cpactions.CacheControlResponse()).noTransform().toString(), 'no-transform');

      test.done();
    },
    'of'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).of('arbitrary!Value').toString(), 'arbitrary!Value');

      test.done();
    },
  },
  'request': {
    'max-stale'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).maxStale().toString(), 'max-stale');
      test.equal((new cpactions.CacheControlRequest()).maxStale(testDuration).toString(), 'max-stale=3600');

      test.done();
    },
    'max-fresh'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).maxFresh(testDuration).toString(), 'max-fresh=3600');

      test.done();
    },
    'only-if-cached'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).onlyIfCached().toString(), 'only-if-cached');

      test.done();
    },
  },
  'response': {
    'must-revalidate'(test: Test) {
      test.equal((new cpactions.CacheControlResponse()).mustRevalidate().toString(), 'must-revalidate');

      test.done();
    },
    'public'(test: Test) {
      test.equal((new cpactions.CacheControlResponse()).public().toString(), 'public');

      test.done();
    },
    'private'(test: Test) {
      test.equal((new cpactions.CacheControlResponse()).private().toString(), 'private');

      test.done();
    },
    'proxy-revalidate'(test: Test) {
      test.equal((new cpactions.CacheControlResponse()).proxyRevalidate().toString(), 'proxy-revalidate');

      test.done();
    },
    's-maxage'(test: Test) {
      test.equal((new cpactions.CacheControlResponse()).sMaxAge(testDuration).toString(), 's-maxage=3600');

      test.done();
    },
  },
  'stacking': {
    'shared and specific'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).noCache().onlyIfCached().toString(), 'no-cache, only-if-cached');
      test.equal((new cpactions.CacheControlResponse()).noCache().proxyRevalidate().toString(), 'no-cache, proxy-revalidate');

      test.done();
    },
    'duplicate'(test: Test) {
      test.equal((new cpactions.CacheControlRequest()).noCache().noCache().toString(), 'no-cache, no-cache');

      test.done();
    },
  }
}