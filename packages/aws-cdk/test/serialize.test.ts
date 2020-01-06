import { toYAML } from '../lib/serialize';

describe(toYAML, () => {
  test('does not wrap lines', () => {
    const longString = 'Long string is long!'.repeat(1_024);
    expect(toYAML({ longString })).toEqual(`longString: ${longString}\n`);
  });
});
