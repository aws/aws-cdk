import * as path from 'path';
import { FrameworkRuntime } from './classes';

/**
 * Handler framework component types.
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
   * Do not create a framework component. This is used to just move source code for airlifting.
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
   * The name of the component class to generate, i.e., `MyCdkFunction`.
   */
  readonly name: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: FrameworkRuntime[];

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   *
   * @default 'index.handler'
   */
  readonly entrypoint?: string;

  /**
   * @default false
   */
  readonly disableBundleAndMinify?: boolean;
}

type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ConfigProps[] } };

export const config: HandlerFrameworkConfig = {
  'aws-certificatemanager': {
    'certificate-request-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'CertificateRequestFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-certificatemanager', 'dns-validated-certificate-handler', 'index.js'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.certificateRequestHandler',
      },
    ],
  },
  'aws-cloudfront': {
    'cross-region-string-param-reader-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        name: 'CrossRegionStringParamReaderProvider',
        sourceCode: path.resolve(__dirname, '..', 'aws-cloudfront', 'edge-function', 'index.js'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'OnEventFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'IsCompleteFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.isCompleteHandler',
      },
    ],
  },
  'aws-ec2': {
    'restrict-default-sg-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        name: 'RestrictDefaultSgProvider',
        sourceCode: path.resolve(__dirname, '..', 'aws-ec2', 'restrict-default-security-group-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecr': {
    'auto-delete-images-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        name: 'AutoDeleteImagesProvider',
        sourceCode: path.resolve(__dirname, '..', 'aws-ecr', 'auto-delete-images-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecs': {
    'drain-hook-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'DrainHookFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-ecs', 'lambda-source', 'index.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_9],
        entrypoint: 'index.lambda_handler',
        disableBundleAndMinify: true,
      },
    ],
  },
  'aws-eks': {
    'cluster-resource-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'OnEventFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.onEvent',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'IsCompleteFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'cluster-resource-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.isComplete',
      },
    ],
    'kubectl-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'KubectlFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'index.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_10],
        disableBundleAndMinify: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        name: 'ApplyHandler',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'apply', '__init__.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_10],
        disableBundleAndMinify: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        name: 'GetHandler',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'get', '__init__.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_10],
        disableBundleAndMinify: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        name: 'HelmHandler',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'helm', '__init__.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_10],
        disableBundleAndMinify: true,
      },
      {
        type: ComponentType.CDK_NO_OP,
        name: 'PatchHandler',
        sourceCode: path.resolve(__dirname, '..', 'aws-eks', 'kubectl-handler', 'patch', '__init__.py'),
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_10],
        disableBundleAndMinify: true,
      },
    ],
  },
  'aws-events-targets': {
    'aws-api-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        name: 'AwsApiFunction',
        sourceCode: path.resolve(__dirname, '..', 'aws-events-targets', 'aws-api-handler', 'index.ts'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
};
