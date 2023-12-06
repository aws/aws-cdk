import { ComponentType, ComponentDefinition } from './framework';
import { FrameworkRuntime } from './classes';

type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ComponentDefinition[] } };

export const config: HandlerFrameworkConfig = {
  'aws-certificatemanager': {
    'certificate-request-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'CertificateRequestProvider',
        codeDirectory: "path.resolve(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-certificatemanager', 'dns-validated-certificate-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ec2': {
    'restrict-default-sg-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        className: 'RestrictDefaultSgProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-ec2', 'restrict-default-security-group-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecr': {
    'auto-delete-images-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        className: 'AutoDeleteImagesProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-ecr', 'auto-delete-images-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ecs': {
    'drain-hook-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'DrainHookProvider',
        codeDirectory: "path.join(__dirname, '..', '..', '..', 'custom-resource-handlers', 'dist', 'aws-ecs', 'lambda-source')",
        compatibleRuntimes: [FrameworkRuntime.PYTHON_3_9],
        entrypoint: 'index.lambda_handler',
      },
    ],
  },
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'ReplicaOnEventProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'ReplicaOnCompleteProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
        entrypoint: 'index.onCompleteHandler',
      },
    ],
  },
  'aws-events-targets': {
    'rule-target-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        className: 'RuleTargetProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-events-targets', 'aws-api-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-ses': {
    'drop-spam-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        className: 'DropSpamProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-ses', 'drop-spam-handler')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
  'aws-cloudfront': {
    'cross-region-reader-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        className: 'CrossRegionReaderProvider',
        codeDirectory: "path.join(__dirname, '..', '..', '..', 'custom-resource-handlers', 'dist', 'aws-cloudfront', 'edge-function')",
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
      },
    ],
  },
};
