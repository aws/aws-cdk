/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';

/**
 * Handler framework runtimes used for code generation.
 */
export enum Runtime {
  /**
   * The NodeJs 18.x runtime
   */
  NODEJS_18_X = 'nodejs18.x',

  /**
   * The Python 3.9 runtime
   */
  PYTHON_3_9 = 'python3.9',

  /**
   * The Python 3.10 runtime
   */
  PYTHON_3_10 = 'python3.10',
}

/**
 * Handler framework component types.
 */
export enum ComponentType {
  /**
   * Code generated Lambda function
   */
  FUNCTION = 'Function',

  /**
   * Code generate a Lambda singleton function
   */
  SINGLETON_FUNCTION = 'SingletonFunction',

  /**
   * Code generate a custom resource provider.
   */
  CUSTOM_RESOURCE_PROVIDER = 'CustomResourceProvider',

  /**
   * Do not create a handler framework component.
   *
   * Note: This is used to just move source code for airlifting.
   */
  NO_OP = 'NoOp',
}

/**
 * Properites used to generate individual framework components.
 */
export interface ComponentProps {
  /**
   * The framework component type to generate.
   */
  readonly type: ComponentType;

  /**
   * The source code that will be executed by the framework component.
   */
  readonly sourceCode: string;

  /**
   * The runtime that is compatible with the framework component's source code.
   *
   * @default Runtime.NODEJS_18_X
   */
  readonly runtime?: Runtime;

  /**
   * The name of the method within your code that the framework component calls.
   *
   * @default 'index.handler'
   */
  readonly handler?: string;

  /**
   * Whether the source code should be minified and bundled.
   *
   * @default true
   */
  readonly minifyAndBundle?: boolean;
}

export type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ComponentProps[] } };

export const config: HandlerFrameworkConfig = {
  'aws-amplify-alpha': {
    'asset-deployment-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-amplify-alpha', 'asset-deployment-handler', 'index.ts'),
        handler: 'index.onEvent',
      },
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-amplify-alpha', 'asset-deployment-handler', 'index.ts'),
        handler: 'index.isComplete',
      },
    ],
  },
  'aws-certificatemanager': {
    'certificate-request-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-certificatemanager', 'dns-validated-certificate-handler', 'index.js'),
        handler: 'index.certificateRequestHandler',
      },
    ],
  },
  'aws-cloudfront': {
    'cross-region-string-param-reader-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-cloudfront', 'edge-function', 'index.js'),
      },
    ],
  },
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        handler: 'index.onEventHandler',
      },
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        handler: 'index.isCompleteHandler',
      },
    ],
  },
  'aws-ec2': {
    'restrict-default-sg-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-ec2', 'restrict-default-security-group-handler', 'index.ts'),
      },
    ],
  },
  'aws-ecr': {
    'auto-delete-images-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-ecr', 'auto-delete-images-handler', 'index.ts'),
      },
    ],
  },
  'aws-ecs': {
    'drain-hook-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-ecs', 'lambda-source', 'index.py'),
        runtime: Runtime.PYTHON_3_9,
        handler: 'index.lambda_handler',
        minifyAndBundle: false,
      },
    ],
  },
  'aws-eks': {
    'cluster-resource-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        handler: 'index.onEvent',
      },
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        handler: 'index.isComplete',
      },
    ],
    'kubectl-provider': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'index.py'),
        runtime: Runtime.PYTHON_3_10,
        minifyAndBundle: false,
      },
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'apply', '__init__.py'),
        runtime: Runtime.PYTHON_3_10,
        minifyAndBundle: false,
      },
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'get', '__init__.py'),
        runtime: Runtime.PYTHON_3_10,
        minifyAndBundle: false,
      },
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'helm', '__init__.py'),
        runtime: Runtime.PYTHON_3_10,
        minifyAndBundle: false,
      },
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'patch', '__init__.py'),
        runtime: Runtime.PYTHON_3_10,
        minifyAndBundle: false,
      },
    ],
  },
  'aws-events-targets': {
    'aws-api-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-events-targets', 'aws-api-handler', 'index.ts'),
      },
    ],
  },
  'aws-iam': {
    'oidc-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-iam', 'oidc-handler', 'index.ts'),
      },
    ],
  },
  'aws-logs': {
    'log-retention': [
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-logs', 'log-retention-handler', 'index.ts'),
      },
    ],
  },
  'aws-redshift-alpha': {
    'cluster-reboot-provider': [
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-redshift-alpha', 'cluster-parameter-change-reboot-handler', 'index.ts'),
      },
    ],
  },
  'aws-route53': {
    'cross-account-zone-delegation-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-route53', 'cross-account-zone-delegation-handler', 'index.ts'),
      },
    ],
    'delete-existing-record-set-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-route53', 'delete-existing-record-set-handler', 'index.ts'),
      },
    ],
  },
  'aws-s3': {
    'auto-delete-objects-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3', 'auto-delete-objects-handler', 'index.ts'),
      },
    ],
    'notifications-resource-handler': [
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3', 'notifications-resource-handler', 'index.py'),
        runtime: Runtime.PYTHON_3_9,
        minifyAndBundle: false,
      },
    ],
  },
  'aws-s3-deployment': {
    'bucket-deployment-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-s3-deployment', 'bucket-deployment-handler', 'index.py'),
        runtime: Runtime.PYTHON_3_9,
        minifyAndBundle: false,
      },
    ],
  },
  'aws-ses': {
    'drop-spam-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-ses', 'drop-spam-handler', 'index.ts'),
      },
    ],
  },
  'aws-stepfunctions-tasks': {
    'eval-nodejs-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'eval-nodejs-handler', 'index.ts'),
      },
    ],
    'role-policy-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'role-policy-handler', 'index.py'),
        runtime: Runtime.PYTHON_3_9,
        minifyAndBundle: false,
      },
    ],
  },
  'aws-synthetics': {
    'auto-delete-underlying-resources-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'aws-synthetics', 'auto-delete-underlying-resources-handler', 'index.ts'),
      },
    ],
  },
  'core': {
    'cfn-utils-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cfn-utils-provider', 'index.ts'),
      },
    ],
    'cross-region-ssm-writer-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cross-region-ssm-writer-handler', 'index.ts'),
      },
    ],
    'cross-region-ssm-reader-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'core', 'cross-region-ssm-reader-handler', 'index.ts'),
      },
    ],
    'nodejs-entrypoint-provider': [
      {
        type: ComponentType.NO_OP,
        sourceCode: path.resolve(__dirname, '..', 'core', 'nodejs-entrypoint-handler', 'index.js'),
        minifyAndBundle: false,
      },
    ],
  },
  'custom-resources': {
    'aws-custom-resource-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'custom-resources', 'aws-custom-resource-handler', 'index.ts'),
      },
    ],
  },
  'pipelines': {
    'approve-lambda': [
      {
        type: ComponentType.FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'pipelines', 'approve-lambda', 'index.ts'),
      },
    ],
  },
  'triggers': {
    'trigger-provider': [
      {
        type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
        sourceCode: path.resolve(__dirname, '..', 'triggers', 'lambda', 'index.ts'),
      },
    ],
  },
};
