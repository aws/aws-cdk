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

  test('CDK-GameLift-006 fires when a fleet on a Windows build launches from a non-Windows path', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const build = new core.CfnResource(stack, 'MyBuild', {
      type: 'AWS::GameLift::Build',
      properties: {
        Name: 'my-build',
        OperatingSystem: 'WINDOWS_2016',
      },
    });
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        BuildId: build.ref,
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: '/local/game/server', ConcurrentExecutions: 1 },
          ],
        },
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-006',
      description: expect.stringContaining('does not match the referenced build\'s Windows operating system'),
    }));
  });

  test('CDK-GameLift-007 fires when a fleet on a Linux build launches from a non-Linux path', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const build = new core.CfnResource(stack, 'MyBuild', {
      type: 'AWS::GameLift::Build',
      properties: {
        Name: 'my-build',
        OperatingSystem: 'AMAZON_LINUX_2023',
      },
    });
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        BuildId: build.ref,
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: 'C:\\game\\server.exe', ConcurrentExecutions: 1 },
          ],
        },
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-GameLift-007',
      description: expect.stringContaining('does not match the referenced build\'s Linux operating system'),
    }));
  });

  test('cross-resource rules stay silent for an imported build', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    // BuildId is a literal external ID — the build's OS is unknowable, so no
    // launch-path finding regardless of path shape.
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        BuildId: 'build-11111111-2222-3333-4444-555555555555',
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: 'some/relative/path', ConcurrentExecutions: 1 },
          ],
        },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));
    expect(violations.filter((v) => v.ruleName === 'CDK-GameLift-006' || v.ruleName === 'CDK-GameLift-007')).toEqual([]);
  });

  test('cross-resource rules stay silent when the build omits OperatingSystem', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    // GameLift applies a server-side default OS; rather than guess it, the
    // rules only fire when the OS is stated in the template.
    const build = new core.CfnResource(stack, 'MyBuild', {
      type: 'AWS::GameLift::Build',
      properties: {
        Name: 'my-build',
      },
    });
    new core.CfnResource(stack, 'MyFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        BuildId: build.ref,
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: 'some/relative/path', ConcurrentExecutions: 1 },
          ],
        },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));
    expect(violations.filter((v) => v.ruleName === 'CDK-GameLift-006' || v.ruleName === 'CDK-GameLift-007')).toEqual([]);
  });

  test('no cross-resource findings when launch paths match the build OS', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const windowsBuild = new core.CfnResource(stack, 'WindowsBuild', {
      type: 'AWS::GameLift::Build',
      properties: { Name: 'windows-build', OperatingSystem: 'WINDOWS_2016' },
    });
    const linuxBuild = new core.CfnResource(stack, 'LinuxBuild', {
      type: 'AWS::GameLift::Build',
      properties: { Name: 'linux-build', OperatingSystem: 'AMAZON_LINUX_2023' },
    });
    new core.CfnResource(stack, 'WindowsFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        Name: 'windows-fleet',
        BuildId: windowsBuild.ref,
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: 'C:\\game\\server.exe', ConcurrentExecutions: 1 },
          ],
        },
      },
    });
    new core.CfnResource(stack, 'LinuxFleet', {
      type: 'AWS::GameLift::Fleet',
      properties: {
        ...FLEET_BASE,
        Name: 'linux-fleet',
        BuildId: linuxBuild.ref,
        RuntimeConfiguration: {
          ServerProcesses: [
            { LaunchPath: '/local/game/server', ConcurrentExecutions: 1 },
          ],
        },
      },
    });

    const violations = pluginViolations(loadValidationReport(app.synth()));
    expect(violations.filter((v) => v.ruleName.startsWith('CDK-GameLift'))).toEqual([]);
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

describe('default ElastiCache rules', () => {
  test('CDK-ElastiCache-001 fires when a multi node group uses a parameter group without cluster mode', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const parameterGroup = new core.CfnResource(stack, 'ParameterGroup', {
      type: 'AWS::ElastiCache::ParameterGroup',
      properties: { ...PARAMETER_GROUP_BASE, Properties: { 'maxmemory-policy': 'allkeys-lru' } },
    });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        NumNodeGroups: 2,
        CacheParameterGroupName: parameterGroup.ref,
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-ElastiCache-001',
      description: expect.stringContaining('does not set cluster-enabled to yes'),
    }));
  });

  test('CDK-ElastiCache-001 fires when the parameter group sets no parameters at all', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const parameterGroup = new core.CfnResource(stack, 'ParameterGroup', {
      type: 'AWS::ElastiCache::ParameterGroup',
      properties: { ...PARAMETER_GROUP_BASE },
    });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        NumNodeGroups: 2,
        CacheParameterGroupName: parameterGroup.ref,
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-ElastiCache-001',
      description: expect.stringContaining('does not set cluster-enabled to yes'),
    }));
  });

  test('CDK-ElastiCache-001 does not fire when the parameter group turns cluster mode on', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const parameterGroup = new core.CfnResource(stack, 'ParameterGroup', {
      type: 'AWS::ElastiCache::ParameterGroup',
      properties: { ...PARAMETER_GROUP_BASE, Properties: { 'cluster-enabled': 'yes' } },
    });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        NumNodeGroups: 2,
        CacheParameterGroupName: parameterGroup.ref,
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('CDK-ElastiCache-001 does not fire when cluster mode is left open by the template', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const clusterEnabled = new core.CfnParameter(stack, 'ClusterEnabled', { type: 'String' });
    const parameterGroup = new core.CfnResource(stack, 'ParameterGroup', {
      type: 'AWS::ElastiCache::ParameterGroup',
      properties: { ...PARAMETER_GROUP_BASE, Properties: { 'cluster-enabled': clusterEnabled.valueAsString } },
    });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        NumNodeGroups: 2,
        CacheParameterGroupName: parameterGroup.ref,
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('CDK-ElastiCache-001 does not fire for a parameter group the template does not define', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        NumNodeGroups: 2,
        CacheParameterGroupName: 'default.redis7.cluster.on',
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('CDK-ElastiCache-002 fires for user group access control without encryption in transit', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        UserGroupIds: ['my-user-group'],
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-ElastiCache-002',
      description: expect.stringContaining('UserGroupIds is set without encryption in transit'),
    }));
  });

  test('CDK-ElastiCache-002 does not fire when encryption in transit is left open by the template', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const transitEncryption = new core.CfnParameter(stack, 'TransitEncryption', { type: 'String' });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        UserGroupIds: ['my-user-group'],
        TransitEncryptionEnabled: transitEncryption.valueAsString,
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('CDK-ElastiCache-002 does not fire when encryption in transit is spelled as a string', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        UserGroupIds: ['my-user-group'],
        // CloudFormation coerces this to a boolean, so the rule must read it as one
        TransitEncryptionEnabled: 'true',
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('CDK-ElastiCache-003 fires for an AUTH token without encryption in transit', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        AuthToken: 'a-sufficiently-long-auth-token',
        TransitEncryptionEnabled: false,
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-ElastiCache-003',
      description: expect.stringContaining('AuthToken is set without encryption in transit'),
    }));
  });

  test('CDK-ElastiCache-004 fires for data tiering on a node type that does not support it', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        CacheNodeType: 'cache.t4g.micro',
        DataTieringEnabled: true,
      },
    });

    expect(pluginViolations(loadValidationReport(app.synth()))).toContainEqual(expect.objectContaining({
      ruleName: 'CDK-ElastiCache-004',
      description: expect.stringContaining('data tiering is enabled on node type cache.t4g.micro'),
    }));
  });

  test('CDK-ElastiCache-004 does not fire when the node type is unresolved at synth time', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const nodeType = new core.CfnParameter(stack, 'NodeType', { type: 'String' });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        CacheNodeType: nodeType.valueAsString,
        DataTieringEnabled: true,
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });

  test('no ElastiCache findings for compliant resources', () => {
    const app = testApp();
    const stack = new core.Stack(app, 'TestStack');
    const parameterGroup = new core.CfnResource(stack, 'ParameterGroup', {
      type: 'AWS::ElastiCache::ParameterGroup',
      properties: { ...PARAMETER_GROUP_BASE, Properties: { 'cluster-enabled': 'yes' } },
    });
    new core.CfnResource(stack, 'MyReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        CacheNodeType: 'cache.r6gd.xlarge',
        NumNodeGroups: 2,
        CacheParameterGroupName: parameterGroup.ref,
        DataTieringEnabled: true,
        TransitEncryptionEnabled: true,
        UserGroupIds: ['my-user-group'],
      },
    });
    new core.CfnResource(stack, 'AuthTokenReplicationGroup', {
      type: 'AWS::ElastiCache::ReplicationGroup',
      properties: {
        ...REPLICATION_GROUP_BASE,
        TransitEncryptionEnabled: true,
        AuthToken: 'a-sufficiently-long-auth-token',
      },
    });

    expect(elastiCacheViolations(app.synth())).toEqual([]);
  });
});

const FLEET_BASE = {
  Name: 'my-fleet',
  BuildId: 'build-1234',
  EC2InstanceType: 'c5.large',
};

const REPLICATION_GROUP_BASE = {
  ReplicationGroupDescription: 'my replication group',
  CacheNodeType: 'cache.r7g.large',
  Engine: 'redis',
};

const PARAMETER_GROUP_BASE = {
  CacheParameterGroupFamily: 'redis7',
  Description: 'my parameter group',
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

function elastiCacheViolations(asm: cxapi.CloudAssembly) {
  return pluginViolations(loadValidationReport(asm))
    .filter((v) => v.ruleName.startsWith('CDK-ElastiCache'));
}
