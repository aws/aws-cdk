import type { IConstruct } from 'constructs';
import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider } from '../../core';
import { App } from '../../core/lib/app';
import { Stack } from '../../core/lib/stack';
import { Validations } from '../../core/lib/validation/validations';
import * as ec2 from '../lib';

// W9010 is the "Hardcoded AMI ID" rule from the CloudFormation validation engine. It fires on any
// literal `ami-xxxxxxxx`/`ami-<17 hex>` value in an `ImageId` property. Machine images that resolve
// an AMI ID at synth time (context lookups) legitimately produce such literals, so those consuming
// constructs should have the warning acknowledged (see aws-ec2/lib/machine-image/utils.ts).
//
// A real AMI ID (17 hex chars) that would trigger the rule if not acknowledged. The lookup dummy
// value `ami-1234` intentionally does NOT match the rule, so we must seed a realistic value to
// prove the acknowledgement actually suppresses a would-be violation.
const REAL_AMI = 'ami-0123456789abcdef0';

const ACK_METADATA_KEY = Validations.ACKNOWLEDGED_RULES_METADATA_KEY;
const W9010_ID = 'CloudFormation-Validate::W9010';

/**
 * Whether W9010 has been acknowledged directly on the given construct.
 *
 * We check the exact node (not ancestors) because our machine-image code records the
 * acknowledgement on the scope passed to `getImage()`. Checking only that node also avoids false
 * positives from the global test hook, which acknowledges W9010 on the App (a parent scope).
 */
function w9010AcknowledgedOn(scope: IConstruct): boolean {
  return scope.node.metadata.some(
    (m) => m.type === ACK_METADATA_KEY && m.data && Object.prototype.hasOwnProperty.call(m.data, W9010_ID),
  );
}

describe('W9010 acknowledgement on machine images', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { account: '1234', region: 'testregion' } });
  });

  test('LookupMachineImage acknowledges W9010 on the consuming scope', () => {
    // WHEN
    new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);

    // THEN
    expect(w9010AcknowledgedOn(stack)).toBe(true);
  });

  test('cachedInContext SSM image acknowledges W9010 on the consuming scope', () => {
    // WHEN
    ec2.MachineImage.latestAmazonLinux({ cachedInContext: true }).getImage(stack);

    // THEN
    expect(w9010AcknowledgedOn(stack)).toBe(true);
  });

  test('cachedInContext fromSsmParameter image acknowledges W9010', () => {
    // WHEN
    ec2.MachineImage.fromSsmParameter('/some/parameter', { cachedInContext: true }).getImage(stack);

    // THEN
    expect(w9010AcknowledgedOn(stack)).toBe(true);
  });

  test('non-cached SSM image does NOT acknowledge W9010 (uses a dynamic reference, not a literal)', () => {
    // WHEN
    ec2.MachineImage.latestAmazonLinux({ cachedInContext: false }).getImage(stack);

    // THEN
    expect(w9010AcknowledgedOn(stack)).toBe(false);
  });

  test('hardcoded GenericLinuxImage does NOT acknowledge W9010 (genuine hardcoded AMI)', () => {
    // WHEN
    new ec2.GenericLinuxImage({ testregion: REAL_AMI }).getImage(stack);

    // THEN - a hand-authored literal AMI is exactly what W9010 is meant to flag, so we leave it.
    expect(w9010AcknowledgedOn(stack)).toBe(false);
  });
});

describe('W9010 end-to-end via the validation report', () => {
  // The global test hook (jest-global-app-testhook.ts) acknowledges W9010 for every test app, so
  // that a hardcoded AMI does not fail unrelated tests. Undo that here so we can observe the rule's
  // real behavior and prove our machine-image acknowledgement (not the global one) is what silences
  // the looked-up case.
  const APP_INIT_HOOK_SYMBOL = Symbol.for('@aws-cdk/core.App#initHook');
  let previousAppHook: any;
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    previousAppHook = (globalThis as any)[APP_INIT_HOOK_SYMBOL];
    (globalThis as any)[APP_INIT_HOOK_SYMBOL] = () => {
      // Intentionally empty: do not auto-acknowledge W9010 for these tests.
    };

    app = new App({ postCliContext: AssemblyValidationReport.APP_CONTEXT });
    stack = new Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  });

  afterEach(() => {
    (globalThis as any)[APP_INIT_HOOK_SYMBOL] = previousAppHook;
  });

  /** Seed the AMI context lookup so LookupMachineImage resolves to a real (rule-triggering) AMI ID. */
  function seedAmiLookup(name: string) {
    const key = ContextProvider.getKey(stack, {
      provider: cxschema.ContextProvider.AMI_PROVIDER,
      props: {
        owners: ['amazon'],
        filters: {
          'name': [name],
          'state': ['available'],
          'image-type': ['machine'],
          'platform': undefined,
        },
      } as cxschema.AmiContextQuery,
    }).key;
    stack.node.setContext(key, REAL_AMI);
  }

  test('an Instance built from a looked-up AMI produces no W9010 violation', () => {
    // GIVEN
    seedAmiLookup('bla*');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    const image = new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] });
    // Sanity check: the lookup resolved to the real (rule-triggering) AMI ID.
    expect(image.getImage(stack).imageId).toEqual(REAL_AMI);

    new ec2.Instance(stack, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: image,
    });

    // THEN
    AssemblyValidationReport.fromApp(app).hasNoViolation({ ruleName: 'W9010' });
  });

  test('an Instance built from a hand-authored hardcoded AMI still warns with W9010', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new ec2.Instance(stack, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.GenericLinuxImage({ 'us-east-1': REAL_AMI }),
    });

    // THEN
    AssemblyValidationReport.fromApp(app).hasViolation({ ruleName: 'W9010' });
  });
});
