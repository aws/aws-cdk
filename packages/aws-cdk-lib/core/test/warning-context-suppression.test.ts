import { Construct } from 'constructs';
import { getWarnings } from './util';
import { Annotations, App, Stack, Validations } from '../lib';

const UNSUPPORTED = 'aws-cloudwatch:logAlarmUnsupportedAction';

function messages(app: App): string[] {
  return getWarnings(app.synth()).map((w) => w.message);
}

/**
 * `where` is matched against each occurrence's call-site context as an objectLike
 * partial match (reusing the framework's internal value matcher). These tests
 * exercise that end-to-end through the public `Validations` API.
 */
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
      where: { service: 'aiops' },
    });

    // THEN — only the aiops occurrence is suppressed
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('sns action ignored'))).toBe(true);
    expect(msgs.some((m) => m.includes('aiops action ignored'))).toBe(false);
  });

  test('a single-key filter suppresses a multi-key context (unmentioned keys are unconstrained)', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN — warning carries a two-key context; acknowledge mentions only one key
    Validations.of(c1).addWarning(UNSUPPORTED, 'lambda action ignored', { context: { service: 'lambda', resource: 'function' } });
    Validations.of(c1).acknowledge({
      id: UNSUPPORTED,
      reason: 'lambda actions are attached intentionally',
      where: { service: 'lambda' },
    });

    // THEN — the two-key occurrence is suppressed by the single-key filter
    expect(messages(app).some((m) => m.includes('lambda action ignored'))).toBe(false);
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
      where: { service: 'lambda' },
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
      where: { service: 'aiops' },
    });

    // THEN — still present
    expect(messages(app).some((m) => m.includes('no-context warning'))).toBe(true);
  });

  test('multiple keys in the filter are combined with AND', () => {
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
      where: { service: 'aiops', resource: 'investigation-group' },
    });

    // THEN — only the occurrence matching every key is suppressed
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
    Annotations.of(c1).addWarningV2('my-lib:SomeWarning', 'aiops via annotations', { context: { service: 'aiops' } });
    Validations.of(c1).acknowledge({
      id: 'my-lib:SomeWarning',
      reason: 'ok',
      where: { service: 'aiops' },
    });

    // THEN
    expect(messages(app).some((m) => m.includes('aiops via annotations'))).toBe(false);
  });

  test('a filtered acknowledgement declared BEFORE the warning still suppresses only matching occurrences', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const parent = new Construct(stack, 'Parent');

    // WHEN — acknowledge on the parent FIRST (exercises the emit-time Acknowledgements.has path),
    // then emit on a child. The ack is declared on an ancestor so it is found via the ancestor
    // path-walk; acking and emitting on the *same* construct hits the separate pre-existing
    // searchPaths ordering bug (tracked in #38820 / fixed in #38821), which is out of scope here.
    Validations.of(parent).acknowledge({
      id: UNSUPPORTED,
      reason: 'aiops actions are attached intentionally',
      where: { service: 'aiops' },
    });
    const child = new Construct(parent, 'Child');
    Validations.of(child).addWarning(UNSUPPORTED, 'aiops action ignored', { context: { service: 'aiops' } });
    Validations.of(child).addWarning(UNSUPPORTED, 'sns action ignored', { context: { service: 'sns' } });

    // THEN — only the aiops occurrence is suppressed, even though the ack preceded the warnings
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('sns action ignored'))).toBe(true);
    expect(msgs.some((m) => m.includes('aiops action ignored'))).toBe(false);
  });

  test('non-string context values (numbers) are matched by equality', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Validations.of(c1).addWarning(UNSUPPORTED, 'port 8080 ignored', { context: { port: 8080 } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'port 443 ignored', { context: { port: 443 } });
    Validations.of(c1).acknowledge({ id: UNSUPPORTED, reason: 'accept 8080', where: { port: 8080 } });

    // THEN
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('port 8080 ignored'))).toBe(false);
    expect(msgs.some((m) => m.includes('port 443 ignored'))).toBe(true);
  });

  test('array context values are matched by equality', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Validations.of(c1).addWarning(UNSUPPORTED, 'sns+sqs ignored', { context: { actions: ['sns', 'sqs'] } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'lambda ignored', { context: { actions: ['lambda'] } });
    Validations.of(c1).acknowledge({ id: UNSUPPORTED, reason: 'accept sns+sqs', where: { actions: ['sns', 'sqs'] } });

    // THEN
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('sns+sqs ignored'))).toBe(false);
    expect(msgs.some((m) => m.includes('lambda ignored'))).toBe(true);
  });

  test('two filtered acknowledgements on the same id each suppress their own occurrences', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN — three occurrences of one id, then TWO separate filtered acks on that id.
    // Suppression is "any recorded ack matches", so both filters apply.
    Validations.of(c1).addWarning(UNSUPPORTED, 'aiops action ignored', { context: { service: 'aiops' } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'sns action ignored', { context: { service: 'sns' } });
    Validations.of(c1).addWarning(UNSUPPORTED, 'lambda action ignored', { context: { service: 'lambda' } });
    Validations.of(c1).acknowledge({ id: UNSUPPORTED, reason: 'accept aiops', where: { service: 'aiops' } });
    Validations.of(c1).acknowledge({ id: UNSUPPORTED, reason: 'accept sns', where: { service: 'sns' } });

    // THEN — the two acknowledged services are suppressed; lambda still warns
    const msgs = messages(app);
    expect(msgs.some((m) => m.includes('aiops action ignored'))).toBe(false);
    expect(msgs.some((m) => m.includes('sns action ignored'))).toBe(false);
    expect(msgs.some((m) => m.includes('lambda action ignored'))).toBe(true);
  });
});
