/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';
import { Runtime } from './runtime';

/**
 * Custom resource provider types.
 */
export enum ComponentType {
  /**
   * `CdkFunction`
   */
  CDK_FUNCTION = 'CdkFunction',

  /**
   * `CdkSingletonFunction`
   */
  CDK_SINGLETON_FUNCTION = 'CdkSingletonFunction',

  /**
   * `CdkCustomResourceProvider`
   */
  CDK_CUSTOM_RESOURCE_PROVIDER = 'CdkCustomResourceProvider',

  /**
   * Do not create a custom resource provider.
   *
   * Note: This is used to just move source code for airlifting.
   */
  CDK_NO_OP = 'CdkNoOp',
}

/**
 * Properites used to initialize individual handler framework components.
 */
export interface ConfigProps {
  /**
   * The component type to generate.
   */
  readonly type: ComponentType;

  /**
   * The source code that will be executed by the provider.
   */
  readonly sourceCode: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   *
   * @default 'index.handler'
   */
  readonly entrypoint?: string;

  /**
   * Prevents the source code from being minified and bundled. This is needed for python
   * files or for source code with a `require` import.
   *
   * @default false
   */
  readonly preventMinifyAndBundle?: boolean;
}

export type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ConfigProps[] } };

export const config: HandlerFrameworkConfig = {
  'aws-amplify-alpha': {
    'asset-deployment-handler': [
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-amplify-alpha', 'asset-deployment-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-certificatemanager': {
    'certificate-request-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-certificatemanager', 'dns-validated-certificate-handler', 'index.js'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        entrypoint: 'index.certificateRequestHandler',
      },
    ],
  },
  'aws-cloudfront': {
    'cross-region-string-param-reader-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-cloudfront', 'edge-function', 'index.js'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        entrypoint: 'index.isCompleteHandler',
      },
    ],
  },
  'aws-ec2': {
    'restrict-default-sg-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-ec2', 'restrict-default-security-group-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecr': {
    'auto-delete-images-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-ecr', 'auto-delete-images-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecs': {
    'drain-hook-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-ecs', 'lambda-source', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        entrypoint: 'index.lambda_handler',
        preventMinifyAndBundle: true,
      },
    ],
  },
  'aws-eks': {
    'cluster-resource-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        entrypoint: 'index.onEvent',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        entrypoint: 'index.isComplete',
      },
    ],
    'kubectl-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_10],
        preventMinifyAndBundle: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'apply', '__init__.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_10],
        preventMinifyAndBundle: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'get', '__init__.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_10],
        preventMinifyAndBundle: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'helm', '__init__.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_10],
        preventMinifyAndBundle: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'patch', '__init__.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_10],
        preventMinifyAndBundle: true,
      },
    ],
  },
  'aws-events-targets': {
    'aws-api-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-events-targets', 'aws-api-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-iam': {
    'oidc-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-iam', 'oidc-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-logs': {
    'log-retention': [
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-logs', 'log-retention-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-redshift-alpha': {
    'cluster-reboot-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-redshift-alpha', 'cluster-parameter-change-reboot-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-route53': {
    'cross-account-zone-delegation-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-route53', 'cross-account-zone-delegation-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'delete-existing-record-set-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-route53', 'delete-existing-record-set-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-s3': {
    'auto-delete-objects-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3', 'auto-delete-objects-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'notifications-resource-handler': [
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3', 'notifications-resource-handler', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        preventMinifyAndBundle: true,
      },
    ],
  },
  'aws-s3-deployment': {
    'bucket-deployment-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3-deployment', 'bucket-deployment-handler', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        preventMinifyAndBundle: true,
      },
    ],
  },
  'aws-ses': {
    'drop-spam-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-ses', 'drop-spam-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'aws-stepfunctions-tasks': {
    'eval-nodejs-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'eval-nodejs-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'role-policy-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'role-policy-handler', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        preventMinifyAndBundle: true,
      },
    ],
  },
  'aws-synthetics': {
    'auto-delete-underlying-resources-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-synthetics', 'auto-delete-underlying-resources-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'core': {
    'cfn-utils-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cfn-utils-provider', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'cross-region-ssm-writer-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cross-region-ssm-writer-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'cross-region-ssm-reader-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cross-region-ssm-reader-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'nodejs-entrypoint': [
      {
        type: ComponentType.CDK_NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'core', 'nodejs-entrypoint-handler', 'index.js'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        preventMinifyAndBundle: true,
      },
    ],
  },
  'custom-resources': {
    'aws-custom-resource-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'custom-resources', 'aws-custom-resource-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'pipelines': {
    'approve-lambda': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'pipelines', 'approve-lambda', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
  'triggers': {
    'trigger-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'triggers', 'lambda', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
  },
};
