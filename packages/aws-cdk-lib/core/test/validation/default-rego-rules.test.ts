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

describe('default GameLift fleet rules', () => {
  test('CDK-GameLift-004 fires for a fleet with more than 50 ingress rules', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        Name: 'my-fleet',
        BuildId: 'build-1234',
        EC2InstanceType: 'c5.large',
        EC2InboundPermissions: Array.from({ length: 60 }, (_, i) => ({
          FromPort: 1000 + i,
          ToPort: 1000 + i,
          IpRange: '10.0.0.0/24',
          Protocol: 'TCP',
        })),
      },
    });

    const report = loadValidationReport(app.synth());
    const violations = pluginViolations(report);

    expect(violations).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-004',
      description: expect.stringContaining('No more than 50 ingress rules are allowed per fleet, given 60'),
    }));
  });

  test('CDK-GameLift-005 fires for a fleet location with negative capacity', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        Name: 'my-fleet',
        BuildId: 'build-1234',
        EC2InstanceType: 'c5.large',
        Locations: [{
          Location: 'us-east-1',
          LocationCapacity: { DesiredEC2Instances: 1, MinSize: -2, MaxSize: 3 },
        }],
      },
    });

    const report = loadValidationReport(app.synth());
    const violations = pluginViolations(report);

    expect(violations).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-005',
      description: expect.stringContaining('MinSize for the Fleet cannot be lower than 0, given -2'),
    }));
  });

  test('no GameLift findings for a compliant fleet', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        Name: 'my-fleet',
        BuildId: 'build-1234',
        EC2InstanceType: 'c5.large',
        EC2InboundPermissions: [{ FromPort: 7777, ToPort: 7777, IpRange: '10.0.0.0/24', Protocol: 'TCP' }],
        Locations: [{
          Location: 'us-east-1',
          LocationCapacity: { DesiredEC2Instances: 1, MinSize: 0, MaxSize: 3 },
        }],
      },
    });

    const report = loadValidationReport(app.synth());
    const violations = pluginViolations(report);

    expect(violations.filter((v) => v.ruleName.startsWith('CDK-GameLift'))).toEqual([]);
  });

  test('all five GameLift rules are wired into the report', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        Name: 'x'.repeat(1025),
        Description: 'y'.repeat(1025),
        BuildId: 'build-1234',
        EC2InstanceType: 'c5.large',
        EC2InboundPermissions: Array.from({ length: 60 }, (_, i) => ({
          FromPort: 1000 + i, ToPort: 1000 + i, IpRange: '10.0.0.0/24', Protocol: 'TCP',
        })),
        Locations: Array.from({ length: 101 }, (_, i) => ({
          Location: `loc-${i}`,
          LocationCapacity: { DesiredEC2Instances: 1, MinSize: -1, MaxSize: 3 },
        })),
      },
    });

    const report = loadValidationReport(app.synth());
    const ruleNames = new Set(pluginViolations(report).map((v) => v.ruleName));

    for (const id of ['CDK-GameLift-001', 'CDK-GameLift-002', 'CDK-GameLift-003', 'CDK-GameLift-004', 'CDK-GameLift-005']) {
      expect(ruleNames).toContain(id);
    }
  });
});

function loadValidationReport(asm: cxapi.CloudAssembly) {
  const p = path.join(asm.directory, 'validation-report.json');
  return JSON.parse(fs.readFileSync(p, { encoding: 'utf-8' })) as PolicyValidationReportJson;
}

function pluginViolations(report: PolicyValidationReportJson) {
  return report.pluginReports
    .filter((r) => r.pluginName === 'CloudFormation Validate')
    .flatMap((r) => r.violations);
}
