import { Construct } from 'constructs';
import { Names, NestedStack } from '../lib';
import { App } from '../lib/app';
import { Stack } from '../lib/stack';

describe('stackRelativeConstructPath', () => {
  test('simple stack-relative paths', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct1 = new Construct(stack, 'Ctr1');
    const construct2 = new Construct(construct1, 'Ctr2');

    expect(Names.stackRelativeConstructPath(construct2)).toBe('Ctr1/Ctr2');
  });

  test('nested stacks are not considered roots', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct1 = new Construct(stack, 'Ctr1');
    const nested = new NestedStack(construct1, 'Nested');
    const construct2 = new Construct(nested, 'Ctr2');

    expect(Names.stackRelativeConstructPath(construct2)).toBe('Ctr1/Nested/Ctr2');
  });

  test('no stacks show entire path (with leading slash for root)', () => {
    const app = new App();
    const construct1 = new Construct(app, 'Ctr1');
    const construct2 = new Construct(construct1, 'Ctr2');

    expect(Names.stackRelativeConstructPath(construct2)).toBe('/Ctr1/Ctr2');
  });
});

describe('uniqueResourceName', () => {
  test('generates different names for same construct with different discriminators', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct = new Construct(stack, 'MyConstruct');

    const name1 = Names.uniqueResourceName(construct, { discriminator: '1' });
    const name2 = Names.uniqueResourceName(construct, { discriminator: '2' });

    expect(name1).not.toEqual(name2);
    // Both should have the same human-readable part but different hashes
    expect(name1.slice(0, -8)).toEqual(name2.slice(0, -8));
    expect(name1.slice(-8)).not.toEqual(name2.slice(-8));
  });

  test('generates same name for same construct with same discriminator', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct = new Construct(stack, 'MyConstruct');

    const name1 = Names.uniqueResourceName(construct, { discriminator: 'same' });
    const name2 = Names.uniqueResourceName(construct, { discriminator: 'same' });

    expect(name1).toEqual(name2);
  });

  test('generates same name for same construct without discriminator', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct = new Construct(stack, 'MyConstruct');

    const name1 = Names.uniqueResourceName(construct, {});
    const name2 = Names.uniqueResourceName(construct, {});

    expect(name1).toEqual(name2);
  });

  test('discriminator is included in hash but not in human-readable part', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const construct = new Construct(stack, 'MyConstruct');

    const name = Names.uniqueResourceName(construct, { discriminator: 'my-discriminator' });

    // Human-readable part should not contain discriminator
    expect(name).not.toContain('my-discriminator');
    // Should end with hash
    expect(name).toMatch(/[A-F0-9]{8}$/);
  });
});
