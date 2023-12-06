import * as path from 'path';
import { ComponentType, ComponentDefinition } from './framework';

type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ComponentDefinition[] } };

export const config: HandlerFrameworkConfig = {
  'aws-dynamodb': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'ReplicaOnEventProvider',
        codeDirectory: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler'),
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'ReplicaOnCompleteProvider',
        codeDirectory: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler'),
        entrypoint: 'index.onCompleteHandler',
      },
    ],
  },
  'aws-ses': {
    'drop-spam-provider': [
      {
        type: ComponentType.CDK_SINGLETON_FUNCTION,
        name: 'DropSpamProvider',
        codeDirectory: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-ses', 'drop-spam-handler'),
      },
    ],
  },
};
