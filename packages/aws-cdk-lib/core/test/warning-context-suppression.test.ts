import { Construct } from 'constructs';
import { getWarnings } from './util';
import { App, Stack, Annotations, Validations, WarningContextFilter } from '../lib';

const UNSUPPORTED = 'aws-cloudwatch:logAlarmUnsupportedAction';

function messages(app: App): string[] {
  return getWarnings(app.synth()).map((w) => w.message);
}

describe('WarningContextFilter matcher', () => {
  test('callSite matches an equal key/value', () => {
    expect(WarningContextFilter.callSite('service', 'aiops').matches({ service: 'aiops' })).toBe(true);
  });

  test('callSite does not match a different value', () => {
    expect(WarningContextFilter.callSite('service', 'aiops').matches({ service: 'sns' })).toBe(false);
  });

  test('callSite does not match a missing key (empty context)', () => {
    expect(WarningContextFilter.callSite('service', 'aiops').matches({})).toBe(false);
  });

  test('callSite ignores unrelated keys', () => {
    expect(WarningContextFilter.callSite('service', 'aiops').matches({ service: 'aiops', resource: 'x' })).toBe(true);
  });
});

describe('context-scoped warning suppression', () => {
  test('a filtered acknowledgement suppresses only matching occurrences', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN — two occurrences of the same id with different call-site context
    Validations.of(c1).addWarning(UNSUPPORTED, 'aiops action ignored', { context: { service: 'aiops' } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'sns action ignored', { context: { service: 'sns' } });
    Validations.of(c1).acknowledge({
      id: UNSUPPORTED,
      reason: 'aiops actions are attached intentionally',
      where: [WarningContextFilter.callSite('service', 'aiops')],
    });

    // THEN — only the aiops occurrence is suppressed
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('sns action ignored'))).toBe(true);
    expect(msgs.some((m) => m.includes('aiops action ignored'))).toBe(false);
  });

  test('an unfiltered acknowledgement suppresses all occurrences (backwards compatible)', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Validations.of(c1).addWarning(UNSUPPORTED, 'aiops action ignored', { context: { service: 'aiops' } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'sns action ignored', { context: { service: 'sns' } });
    Validations.of(c1).acknowledge({ id: UNSUPPORTED, reason: 'accept all' });

    // THEN
    expect(messages(app)).toEqual([]);
  });

  test('a non-matching filter leaves the warning in place', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Validations.of(c1).addWarning(UNSUPPORTED, 'aiops action ignored', { context: { service: 'aiops' } });
    Validations.of(c1).acknowledge({
      id: UNSUPPORTED,
      reason: 'wrong filter',
      where: [WarningContextFilter.callSite('service', 'lambda')],
    });

    // THEN
    expect(messages(app).some((m) => m.includes('aiops action ignored'))).toBe(true);
  });

  test('a warning with no context is not matched by a filtered acknowledgement', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN — warning carries no context
    Validations.of(c1).addWarning(UNSUPPORTED, 'no-context warning');
    Validations.of(c1).acknowledge({
      id: UNSUPPORTED,
      reason: 'filtered ack should not catch a context-less warning',
      where: [WarningContextFilter.callSite('service', 'aiops')],
    });

    // THEN — still present
    expect(messages(app).some((m) => m.includes('no-context warning'))).toBe(true);
  });

  test('multiple filters are combined with AND', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Validations.of(c1).addWarning(UNSUPPORTED, 'both match', { context: { service: 'aiops', resource: 'investigation-group' } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'only service matches', { context: { service: 'aiops', resource: 'other' } });
    Validations.of(c1).acknowledge({
      id: UNSUPPORTED,
      reason: 'only the exact pair',
      where: [
        WarningContextFilter.callSite('service', 'aiops'),
        WarningContextFilter.callSite('resource', 'investigation-group'),
      ],
    });

    // THEN — only the occurrence matching BOTH filters is suppressed
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('both match'))).toBe(false);
    expect(msgs.some((m) => m.includes('only service matches'))).toBe(true);
  });

  test('context added via Annotations.addWarningV2 is also filterable', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN — emit via the low-level API with context, acknowledge via Validations
    Annotations.of(c1).addWarningV2('my-lib:SomeWarning', 'aiops via annotations', { service: 'aiops' });
    Validations.of(c1).acknowledge({
      id: 'my-lib:SomeWarning',
      reason: 'ok',
      where: [WarningContextFilter.callSite('service', 'aiops')],
    });

    // THEN
    expect(messages(app).some((m) => m.includes('aiops via annotations'))).toBe(false);
  });
});
