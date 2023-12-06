import { ComponentType, ComponentDefinition } from './framework';

type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ComponentDefinition[] } };

export const config: HandlerFrameworkConfig = {
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'ReplicaOnEventProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler')",
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        className: 'ReplicaOnCompleteProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler')",
        entrypoint: 'index.onCompleteHandler',
      },
    ],
  },
  'aws-ses': {
    'drop-spam-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        className: 'DropSpamProvider',
        codeDirectory: "path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-ses', 'drop-spam-handler')",
        uuid: '224e77f9-a32e-4b4d-ac32-983477abba16',
      },
    ],
  },
  'aws-cloudfront': {
    'cross-region-reader-provider': [
      {
        type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
        className: 'CrossRegionReaderProvider',
        codeDirectory: "path.join(__dirname, '..', '..', '..', 'custom-resource-handlers', 'dist', 'aws-cloudfront', 'edge-function')",
      },
    ],
  },
};
