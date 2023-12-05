import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

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
}

/**
 * Properties used to generate a specific handler framework component
 */
export interface ComponentDefinition {
  /**
   * The component type to generate.
   */
  readonly type: ComponentType;

  /**
   * The name to generate the component with.
   *
   * Note: This will be the name of the class, i.e., `MyCdkFunction`, etc.
   */
  readonly name: string;

  /**
   * The local file system directory with the source code.
   */
  readonly codeDirectory: string;

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
   * Configurable options for the underlying Lambda function.
   */
  readonly providerOptions?: any;
}

export type HandlerFrameworkConfig = { [module: string]: { [identifier: string]: ComponentDefinition[] } };

// output will be packages/aws-cdk-lib/handler-framework/<module>/<identifier>/index.generated.ts
export const config: HandlerFrameworkConfig = {
  'aws-s3': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'ReplicaOnEventProvider',
        codeDirectory: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler'),
        compatibleRuntimes: [Runtime.NODEJS_LATEST],
        entrypoint: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        name: 'ReplicaOnCompleteProvider',
        codeDirectory: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-dynamodb', 'replica-handler'),
        compatibleRuntimes: [Runtime.NODEJS_LATEST],
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
        compatibleRuntimes: [Runtime.NODEJS_LATEST],
      },
    ],
  },
};
