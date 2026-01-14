import * as fs from 'fs';
import * as path from 'path';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib/core';
import { testFixture } from './util';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion, AlbControllerSecurityMode, HelmChart } from '../lib';

const versions = Object.values(AlbControllerVersion);

test.each(versions)('support AlbControllerVersion (%s)', (version) => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
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
            Ref: 'ClusterEB0386A7',
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

test('can configure a custom repository', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
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
            Ref: 'ClusterEB0386A7',
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
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
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
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
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
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
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
            Ref: 'ClusterEB0386A7',
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

test('SCOPED mode scopes wildcard resources to region and account', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    },
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

  // Helper to check if a resource is a scoped ARN (Fn::Join format with region/account)
  const isScopedResource = (resource: any): boolean => {
    if (typeof resource === 'string') {
      return resource.includes('us-west-2') && resource.includes('123456789012');
    }
    if (resource && resource['Fn::Join']) {
      const joinParts = resource['Fn::Join'][1];
      const joinStr = JSON.stringify(joinParts);
      return joinStr.includes('us-west-2') && joinStr.includes('123456789012');
    }
    return false;
  };

  // Check that read-only statements have scoped resources (not wildcard "*")
  const readOnlyStatements = albPolicyDocument.Statement.filter((stmt: any) =>
    Array.isArray(stmt.Action) &&
    stmt.Action.some((action: string) =>
      action.startsWith('ec2:Describe') ||
      action.startsWith('elasticloadbalancing:Describe') ||
      action.startsWith('acm:'),
    ),
  );

  expect(readOnlyStatements.length).toBeGreaterThan(0);

  // Verify that these statements have scoped resources (not wildcard "*")
  readOnlyStatements.forEach((stmt: any) => {
    // Resource should be scoped, not a simple "*"
    expect(stmt.Resource).not.toEqual('*');
    expect(isScopedResource(stmt.Resource)).toBe(true);
  });
});

test('COMPATIBLE mode does not add additional conditions', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { region: 'us-west-2', account: '123456789012' },
  });
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    },
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

  // Verify that these statements do NOT have additional region or account conditions
  readOnlyStatements.forEach((stmt: any) => {
    if (stmt.Condition?.StringEquals) {
      expect(stmt.Condition.StringEquals['aws:RequestedRegion']).toBeUndefined();
      expect(stmt.Condition.StringEquals['aws:ResourceAccount']).toBeUndefined();
    }
  });
});
