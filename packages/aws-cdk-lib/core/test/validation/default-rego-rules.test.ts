import * as fs from 'fs';
import * as path from 'path';
import type { PolicyValidationReportJson } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../../../cx-api';
import * as core from '../../lib';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { return true; });
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
  process.exitCode = undefined;
});

afterEach(() => {
  jest.clearAllMocks();
});

const originalContextJson = process.env.CDK_CONTEXT_JSON;

beforeAll(() => {
  // These tests validate rule behavior through the report — strict mode would mask
  // the signals by throwing before tests can assert on the report contents.
  process.env.CDK_CONTEXT_JSON = JSON.stringify({
    ...JSON.parse(originalContextJson ?? '{}'),
    '@aws-cdk/core:strictCfnValidateErrors': false,
  });
});

afterAll(() => {
  jest.resetAllMocks();
  process.env.CDK_CONTEXT_JSON = originalContextJson;
});

describe('default GameLift rules', () => {
  test('CDK-GameLift-001 fires for an inverted ingress port range', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        EC2InboundPermissions: [
          { FromPort: 9000, ToPort: 80, IpRange: '10.0.0.0/24', Protocol: 'TCP' },
        ],
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-001',
      description: expect.stringContaining('FromPort 9000 is greater than ToPort 80'),
    }));
  });

  test('CDK-GameLift-002 fires when a location capacity MinSize exceeds MaxSize', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        Locations: [{
          Location: 'us-east-1',
          LocationCapacity: { DesiredEC2Instances: 5, MinSize: 10, MaxSize: 2 },
        }],
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-002',
      description: expect.stringContaining('MinSize 10 is greater than MaxSize 2'),
    }));
  });

  test('CDK-GameLift-003 fires when DesiredEC2Instances is outside [MinSize, MaxSize]', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        Locations: [{
          Location: 'us-east-1',
          LocationCapacity: { DesiredEC2Instances: 50, MinSize: 1, MaxSize: 10 },
        }],
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-003',
      description: expect.stringContaining('DesiredEC2Instances 50 is outside the range'),
    }));
  });

  test('CDK-GameLift-004 fires for an alias with SIMPLE routing and a terminal message', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'my-alias',
        RoutingStrategy: { Type: 'SIMPLE', FleetId: 'fleet-1234', Message: 'goodbye' },
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-004',
    }));
  });

  test('CDK-GameLift-005 fires for an alias with TERMINAL routing and a fleet', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'my-alias',
        RoutingStrategy: { Type: 'TERMINAL', Message: 'goodbye', FleetId: 'fleet-1234' },
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-005',
    }));
  });

  test('no GameLift findings for compliant resources', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        EC2InboundPermissions: [
          { FromPort: 7777, ToPort: 7777, IpRange: '10.0.0.0/24', Protocol: 'TCP' },
        ],
        Locations: [{
          Location: 'us-east-1',
          LocationCapacity: { DesiredEC2Instances: 5, MinSize: 1, MaxSize: 10 },
        }],
      },
    });
    new core.CfnResource(stack, 'SimpleAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'simple-alias',
        RoutingStrategy: { Type: 'SIMPLE', FleetId: 'fleet-1234' },
      },
    });
    new core.CfnResource(stack, 'TerminalAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'terminal-alias',
        RoutingStrategy: { Type: 'TERMINAL', Message: 'goodbye' },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));
    expect(violations.filter((v) => v.ruleName.startsWith('CDK-GameLift'))).toEqual([]);
  });

  test('an explicitly registered plugin with custom rules still evaluates the default rules', () => {
    const app = testApp();
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin({
      regoRules: [{
        name: 'my-custom.rego',
        content: [
          'package my_custom',
          'import rego.v1',
          'violation contains v if {',
          '	some name in resources_of_type("AWS::GameLift::Alias")',
          '	v := make_diag("MY-CUSTOM-001", "WARN", name, "custom rule fired")',
          '}',
        ].join('\n'),
      }],
    }));
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'my-alias',
        RoutingStrategy: { Type: 'SIMPLE', FleetId: 'fleet-1234', Message: 'goodbye' },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));

    // Both the user's custom rule and the CDK default rule must fire
    expect(violations).toContainEqual(expect.objectContaining({ ruleName: 'MY-CUSTOM-001' }));
    expect(violations).toContainEqual(expect.objectContaining({ ruleName: 'CDK-GameLift-004' }));
  });

  test('default rule findings can be suppressed via acknowledge()', () => {
    const app = testApp();
    core.Validations.of(app).acknowledge({
      id: 'CloudFormation-Validate::CDK-GameLift-004',
      reason: 'testing suppression of a default rule',
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'my-alias',
        RoutingStrategy: { Type: 'SIMPLE', FleetId: 'fleet-1234', Message: 'goodbye' },
      },
    });

    const report = loadValidationReport(app.synth());
    const violations = pluginViolations(report);

    // The finding is moved from violations to suppressedViolations
    expect(violations.filter((v) => v.ruleName === 'CDK-GameLift-004')).toEqual([]);
    const suppressed = report.pluginReports
      .filter((r) => r.pluginName === 'CloudFormation Validate')
      .flatMap((r) => r.suppressedViolations ?? []);
    expect(suppressed).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-004',
    }));
  });

  test('includeDefaultRules: false opts out of the default rules', () => {
    const app = testApp();
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin({
      includeDefaultRules: false,
    }));
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyAlias', {
      type: 'AWS::GameLift::Alias',
      properties: {
        Name: 'my-alias',
        RoutingStrategy: { Type: 'SIMPLE', FleetId: 'fleet-1234', Message: 'goodbye' },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));

    expect(violations.filter((v) => v.ruleName.startsWith('CDK-GameLift'))).toEqual([]);
  });
});

const FLEET_BASE = {
  Name: 'my-fleet',
  BuildId: 'build-1234',
  EC2InstanceType: 'c5.large',
};

function testApp() {
  return new core.App({
    context: {
      [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
    },
  });
}

function loadValidationReport(asm: cxapi.CloudAssembly) {
  const p = path.join(asm.directory, 'validation-report.json');
  return JSON.parse(fs.readFileSync(p, { encoding: 'utf-8' })) as PolicyValidationReportJson;
}

function pluginViolations(report: PolicyValidationReportJson) {
  return report.pluginReports
    .filter((r) => r.pluginName === 'CloudFormation Validate')
    .flatMap((r) => r.violations);
}
