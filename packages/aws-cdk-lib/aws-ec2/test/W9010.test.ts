import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider } from '../../core';
import { App } from '../../core/lib/app';
import { Stack } from '../../core/lib/stack';
import * as ec2 from '../lib';

// W9010 is the "Hardcoded AMI ID" rule from the CloudFormation validation engine. It fires on any
// literal `ami-xxxxxxxx`/`ami-<17 hex>` value in an `ImageId` property.
const REAL_AMI = 'ami-0123456789abcdef0';

AssemblyValidationReport.disableTestSuppressions();

describe('W9010', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({ postCliContext: AssemblyValidationReport.APP_CONTEXT });
    stack = new Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  });

  /** Seed the AMI context lookup so LookupMachineImage resolves to a real (rule-triggering) AMI ID. */
  function seedAmiLookup(name: string) {
    const key = ContextProvider.getKey(stack, {
      provider: cxschema.ContextProvider.AMI_PROVIDER,
      props: {
        account: '1234',
        region: 'us-east-1',
        owners: ['amazon'],
        filters: {
          'name': [name],
          'state': ['available'],
          'image-type': ['machine'],
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
    new ec2.Instance(stack, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }),
    });

    // THEN
    AssemblyValidationReport.fromApp(app).hasNoViolation({ ruleName: 'W9010' });
  });

  test('a hand-authored hardcoded AMI next to a looked-up AMI still warns', () => {
    // GIVEN
    seedAmiLookup('bla*');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new ec2.Instance(stack, 'HandInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.GenericLinuxImage({ 'us-east-1': REAL_AMI }),
    });

    new ec2.Instance(stack, 'LookupInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }),
    });

    // THEN
    AssemblyValidationReport.fromApp(app).hasViolation({ ruleName: 'W9010' });
  });
});
