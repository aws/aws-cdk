import * as fs from 'fs';
import * as path from 'path';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixture } from './util';
import { Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack } from '../../core';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion, AlbControllerSecurityMode, HelmChart, KubernetesManifest, AuthenticationMode } from '../lib';

const versions = Object.values(AlbControllerVersion);

test.each(versions)('support AlbControllerVersion (%s)', (version) => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });
  AlbController.create(stack, {
    cluster,
    version,
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Version: version.helmChartVersion,
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          `","image":{"repository":"602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller","tag":"${version.version}"}}`,
        ],
      ],
    },
  });
});

test('all vended policies are valid', () => {
  const addOnsDir = path.join(__dirname, '..', 'lib', 'addons');

  for (const addOn of fs.readdirSync(addOnsDir)) {
    if (addOn.startsWith('alb-iam_policy')) {
      const policy = JSON.parse(fs.readFileSync(path.join(addOnsDir, addOn)).toString());
      try {
        for (const statement of policy.Statement) {
          iam.PolicyStatement.fromJson(statement);
        }
      } catch (error) {
        throw new Error(`Invalid policy: ${addOn}: ${error}`);
      }
    }
  }
});

test('SCOPED mode adds region conditions for read-only operations', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_24,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_13_3,
    securityMode: AlbControllerSecurityMode.SCOPED,
  });

  // THEN
  const template = Template.fromStack(stack);

  // Find the ALB controller service account policy statements
  const policies = template.findResources('AWS::IAM::Policy');
  const policyKeys = Object.keys(policies);
  expect(policyKeys.length).toBeGreaterThan(0);

  // Find the policy that contains ALB controller permissions (look for elasticloadbalancing actions)
  let albPolicyDocument: any = null;
  for (const policyKey of policyKeys) {
    const policy = policies[policyKey];
    const statements = policy.Properties.PolicyDocument.Statement;
    const hasELBActions = statements.some((stmt: any) =>
      Array.isArray(stmt.Action) &&
      stmt.Action.some((action: string) => action.startsWith('elasticloadbalancing:')),
    );
    if (hasELBActions) {
      albPolicyDocument = policy.Properties.PolicyDocument;
      break;
    }
  }

  expect(albPolicyDocument).toBeDefined();

  // Check that read-only statements with Resource: "*" have region conditions
  const readOnlyStatements = albPolicyDocument.Statement.filter((stmt: any) =>
    stmt.Resource === '*' &&
    Array.isArray(stmt.Action) &&
    stmt.Action.some((action: string) =>
      action.startsWith('ec2:Describe') ||
      action.startsWith('elasticloadbalancing:Describe') ||
      action.startsWith('acm:'),
    ),
  );

  expect(readOnlyStatements.length).toBeGreaterThan(0);

  // Verify that these statements have region conditions
  readOnlyStatements.forEach((stmt: any) => {
    expect(stmt.Condition).toBeDefined();
    expect(stmt.Condition.StringEquals).toBeDefined();
    expect(stmt.Condition.StringEquals['aws:RequestedRegion']).toEqual('us-west-2');
  });
});

test('COMPATIBLE mode does not add additional conditions', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_23,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_13_3,
    securityMode: AlbControllerSecurityMode.COMPATIBLE,
  });

  // THEN
  const template = Template.fromStack(stack);

  // Find the ALB controller service account policy statements
  const policies = template.findResources('AWS::IAM::Policy');
  const policyKeys = Object.keys(policies);
  expect(policyKeys.length).toBeGreaterThan(0);

  // Find the policy that contains ALB controller permissions
  let albPolicyDocument: any = null;
  for (const policyKey of policyKeys) {
    const policy = policies[policyKey];
    const statements = policy.Properties.PolicyDocument.Statement;
    const hasELBActions = statements.some((stmt: any) =>
      Array.isArray(stmt.Action) &&
      stmt.Action.some((action: string) => action.startsWith('elasticloadbalancing:')),
    );
    if (hasELBActions) {
      albPolicyDocument = policy.Properties.PolicyDocument;
      break;
    }
  }

  expect(albPolicyDocument).toBeDefined();

  // Check that read-only statements with Resource: "*" do NOT have additional region conditions
  const readOnlyStatements = albPolicyDocument.Statement.filter((stmt: any) =>
    stmt.Resource === '*' &&
    Array.isArray(stmt.Action) &&
    stmt.Action.some((action: string) =>
      action.startsWith('ec2:Describe') ||
      action.startsWith('elasticloadbalancing:Describe'),
    ),
  );

  expect(readOnlyStatements.length).toBeGreaterThan(0);

  // Verify that these statements do NOT have additional region conditions
  // (they may have existing conditions from the original policy, but not our added ones)
  readOnlyStatements.forEach((stmt: any) => {
    if (stmt.Condition?.StringEquals) {
      expect(stmt.Condition.StringEquals['aws:RequestedRegion']).toBeUndefined();
    }
  });
});

test('SCOPED mode applies partition-aware resource scoping', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_23,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_13_3,
    securityMode: AlbControllerSecurityMode.SCOPED,
  });

  // THEN
  const template = Template.fromStack(stack);

  // Find the ALB controller service account policy statements
  const policies = template.findResources('AWS::IAM::Policy');
  const policyKeys = Object.keys(policies);
  expect(policyKeys.length).toBeGreaterThan(0);

  // Find the policy that contains ALB controller permissions
  let albPolicyDocument: any = null;
  for (const policyKey of policyKeys) {
    const policy = policies[policyKey];
    const statements = policy.Properties.PolicyDocument.Statement;
    const hasELBActions = statements.some((stmt: any) =>
      Array.isArray(stmt.Action) &&
      stmt.Action.some((action: string) => action.startsWith('elasticloadbalancing:')),
    );
    if (hasELBActions) {
      albPolicyDocument = policy.Properties.PolicyDocument;
      break;
    }
  }

  expect(albPolicyDocument).toBeDefined();

  // Check that ARN-based resources use partition references instead of hardcoded 'arn:aws:'
  const arnStatements = albPolicyDocument.Statement.filter((stmt: any) =>
    Array.isArray(stmt.Resource) &&
    stmt.Resource.some((resource: any) =>
      typeof resource === 'string' &&
      (resource.includes('arn:aws:') || resource.includes('arn:${AWS::Partition}:')),
    ),
  );

  // If there are ARN statements, verify they use partition references
  if (arnStatements.length > 0) {
    arnStatements.forEach((stmt: any) => {
      stmt.Resource.forEach((resource: any) => {
        if (typeof resource === 'string' && resource.includes('arn:')) {
          // Should use partition reference, not hardcoded 'arn:aws:'
          expect(resource).toMatch(/arn:\$\{AWS::Partition\}:/);
        }
      });
    });
  }

  // The main test is that SCOPED mode doesn't break the policy structure
  expect(albPolicyDocument.Statement.length).toBeGreaterThan(0);
});

test('SCOPED mode preserves existing conditions', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_23,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_13_3,
    securityMode: AlbControllerSecurityMode.SCOPED,
  });

  // THEN
  const template = Template.fromStack(stack);

  // Find the ALB controller service account policy statements
  const policies = template.findResources('AWS::IAM::Policy');
  const policyKeys = Object.keys(policies);
  expect(policyKeys.length).toBeGreaterThan(0);

  // Find the policy that contains ALB controller permissions
  let albPolicyDocument: any = null;
  for (const policyKey of policyKeys) {
    const policy = policies[policyKey];
    const statements = policy.Properties.PolicyDocument.Statement;
    const hasELBActions = statements.some((stmt: any) =>
      Array.isArray(stmt.Action) &&
      stmt.Action.some((action: string) => action.startsWith('elasticloadbalancing:')),
    );
    if (hasELBActions) {
      albPolicyDocument = policy.Properties.PolicyDocument;
      break;
    }
  }

  expect(albPolicyDocument).toBeDefined();

  // Find statements that originally had conditions (like cluster tagging)
  const statementsWithOriginalConditions = albPolicyDocument.Statement.filter((stmt: any) =>
    stmt.Condition &&
    (stmt.Condition.Null?.['aws:ResourceTag/elbv2.k8s.aws/cluster'] === 'false' ||
     stmt.Condition.StringEquals?.['iam:AWSServiceName']),
  );

  expect(statementsWithOriginalConditions.length).toBeGreaterThan(0);

  // Verify that original conditions are preserved
  statementsWithOriginalConditions.forEach((stmt: any) => {
    expect(stmt.Condition).toBeDefined();
    // Original conditions should still be present
    const hasOriginalCondition =
      stmt.Condition.Null?.['aws:ResourceTag/elbv2.k8s.aws/cluster'] === 'false' ||
      stmt.Condition.StringEquals?.['iam:AWSServiceName'] === 'elasticloadbalancing.amazonaws.com';
    expect(hasOriginalCondition).toBeTruthy();
  });
});

test('can configure a custom repository', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.6.2"}}',
        ],
      ],
    },
  });
});

test('throws when a policy is not defined for a custom version', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  expect(() => AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.of('custom'),
  })).toThrow("'albControllerOptions.policy' is required when using a custom controller version");
});

test.each(['us-gov-west-1', 'cn-north-1'])('stack does not include hard-coded partition', (region) => {
  const { stack } = testFixture(region);
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
  });

  const template = Template.fromStack(stack);
  expect(JSON.stringify(template)).not.toContain('arn:aws');
});

test('correct helm chart version is set for selected alb controller version', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Version: '1.6.2', // The helm chart version associated with AlbControllerVersion.V2_6_2
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.6.2"}}',
        ],
      ],
    },
  });
});

test.each([
  { setting: 'enableWaf', value: false },
  { setting: 'enableWafv2', value: false },
  { setting: 'enableWaf', value: true },
  { setting: 'enableWafv2', value: true },
])('custom WAF settings - $setting', ({ setting, value }) => {
  // GIVEN
  const { stack } = testFixture();
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_4_1,
    additionalHelmChartValues: {
      [setting]: value,
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        Match.arrayWith([
          '{"clusterName":"',
          { Ref: 'Cluster9EE0221C' },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          { Ref: 'ClusterDefaultVpcFA9F2722' },
          `","image":{"repository":"602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller","tag":"v2.4.1"},"${setting}":${value}}`,
        ]),
      ],
    },
  });
});

describe('AlbController AwsAuth creation', () => {
  const setupTest = (authenticationMode?: AuthenticationMode) => {
    const { stack } = testFixture();
    const cluster = new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_27,
      authenticationMode,
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    });
    AlbController.create(stack, {
      cluster,
      version: AlbControllerVersion.V2_6_2,
    });
    return stack;
  };

  const awsAuthManifest = {
    Manifest: {
      'Fn::Join': [
        '',
        [
          '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
          {
            'Fn::GetAtt': [
              'ClusterNodegroupDefaultCapacityNodeGroupRole55953B04',
              'Arn',
            ],
          },
          '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
        ],
      ],
    },
  };

  test('will not create AwsAuth when the authenticationMode is API', () => {
    const stack = setupTest(AuthenticationMode.API);
    Template.fromStack(stack).hasResourceProperties(KubernetesManifest.RESOURCE_TYPE, Match.not(awsAuthManifest));
  });

  test.each([
    AuthenticationMode.API_AND_CONFIG_MAP,
    AuthenticationMode.CONFIG_MAP,
    undefined,
  ])('will create AwsAuth when the authenticationMode is %p', (authenticationMode) => {
    const stack = setupTest(authenticationMode);
    Template.fromStack(stack).hasResourceProperties(KubernetesManifest.RESOURCE_TYPE, awsAuthManifest);
  });
});
