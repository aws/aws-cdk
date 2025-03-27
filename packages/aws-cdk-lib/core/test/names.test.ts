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
