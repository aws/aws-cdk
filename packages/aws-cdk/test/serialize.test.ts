/* eslint-disable import/order */
import { toYAML } from '@aws-cdk/tmp-toolkit-helpers/lib/util/serialize';

describe(toYAML, () => {
  test('does not wrap lines', () => {
    const longString = 'Long string is long!'.repeat(1_024);
    expect(toYAML({ longString })).toEqual(`longString: ${longString}\n`);
  });
});
