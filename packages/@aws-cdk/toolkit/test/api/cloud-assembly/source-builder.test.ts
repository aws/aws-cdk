import { Toolkit } from '../../../lib/toolkit';
import { appFixture, builderFixture, cdkOutFixture, TestIoHost } from '../../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
});

describe('fromAssemblyBuilder', () => {
  test('defaults', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    const cached = await toolkit.synth(cx);
    const assembly = await cached.produce();

    // THEN
    expect(assembly.stacksRecursively.map(s => s.hierarchicalId)).toEqual(['Stack1', 'Stack2']);
  });
});

describe('fromAssemblyDirectory', () => {
  test('defaults', async () => {
    // WHEN
    const cx = await cdkOutFixture(toolkit, 'two-empty-stacks');
    const cached = await toolkit.synth(cx);
    const assembly = await cached.produce();

    // THEN
    expect(assembly.stacksRecursively.map(s => s.hierarchicalId)).toEqual(['Stack1', 'Stack2']);
  });
});

describe('fromCdkApp', () => {
  test('defaults', async () => {
    // WHEN
    const cx = await appFixture(toolkit, 'two-empty-stacks');
    const cached = await toolkit.synth(cx);
    const assembly = await cached.produce();

    // THEN
    expect(assembly.stacksRecursively.map(s => s.hierarchicalId)).toEqual(['Stack1', 'Stack2']);
  });
});
