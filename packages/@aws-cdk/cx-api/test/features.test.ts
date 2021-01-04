import * as feats from '../lib/features';

test('all future flags have defaults configured', () => {
  Object.keys(feats.FUTURE_FLAGS).forEach(flag => {
    expect(typeof(feats.futureFlagDefault(flag))).toEqual('boolean');
  });
});