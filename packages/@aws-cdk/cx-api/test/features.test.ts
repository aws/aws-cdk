import { testLegacyBehavior } from 'cdk-build-tools/lib/feature-flag';
import * as feats from '../lib/features';

test('all future flags have defaults configured', () => {
  Object.keys(feats.FUTURE_FLAGS).forEach(flag => {
    expect(typeof(feats.futureFlagDefault(flag))).toEqual('boolean');
  });
});

testLegacyBehavior('FUTURE_FLAGS_EXPIRED must be empty in CDKv1', Object, () => {
  expect(feats.FUTURE_FLAGS_EXPIRED.length).toEqual(0);
});