import { breakingModules } from '../parser';

describe('breakingModules', () => {
  test('no breakages', () => {
    const title = 'feat(m1): this is not a breaking change';
    const body = 'a regular description';

    expect(breakingModules(title, body)).toEqual([]);
  });

  test('main module breaks', () => {
    const title = 'feat(m1): this is a breaking change';
    const body = `
    a breaking change description
    BREAKING CHANGE: unintended breaking change
    `;

    expect(breakingModules(title, body)).toEqual(['m1']);
  });

  test('multiple breaking changes', () => {
    const title = 'feat(m1): this is a breaking change';
    const body = `
    a breaking change description
    BREAKING CHANGE: unintended breaking change
    continued message
    * **m2**: Another breaking change here
    continuing again
    `;

    expect(breakingModules(title, body)).toEqual(['m1', 'm2']);
  });

  test('additional footer', () => {
    const title = 'feat(m1): this is a breaking change';
    const body = `
    a breaking change description
    closes #123456789
    BREAKING CHANGE: unintended breaking change
    `;

    expect(breakingModules(title, body)).toEqual(['m1']);
  });
});