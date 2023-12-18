import { mangleLikeCloudFormation } from '../lib/diff/util';

test('mangled strings', () => {
  expect(mangleLikeCloudFormation('foo')).toEqual('foo');
  expect(mangleLikeCloudFormation('文字化け')).toEqual('????');
  expect(mangleLikeCloudFormation('🤦🏻‍♂️')).toEqual('?????');
  expect(mangleLikeCloudFormation('\u{10ffff}')).toEqual('?');
  expect(mangleLikeCloudFormation('\u007f')).toEqual('\u007f');
  expect(mangleLikeCloudFormation('\u0080')).toEqual('?');
});
