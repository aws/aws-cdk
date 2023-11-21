import { DelegationGrantNames } from '../lib/delegation-grant-names';

describe('delegation-grant-names', () => {
  const NAMES = ['name-1', 'name-2'];

  test('ofEquals() creates instance whose _equals() is not null', () => {
    // WHEN
    const actual = DelegationGrantNames.ofEquals(...NAMES);

    // THEN
    expect(actual._equals()).toStrictEqual(NAMES);
    expect(actual._like()).toBeNull();
  });

  test('ofLike() creates instance whose _like() is not null', () => {
    // WHEN
    const actual = DelegationGrantNames.ofLike(...NAMES);

    // THEN
    expect(actual._equals()).toBeNull();
    expect(actual._like()).toStrictEqual(NAMES);
  });
});
