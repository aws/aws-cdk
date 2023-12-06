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
   *
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
        name: 'CertificateRequestProvider',
        sourceCode: path.resolve(__dirname, '..', 'aws-certificatemanager', 'dns-validated-certificate-handler', 'index.js'),
        compatibleRuntimes: [FrameworkRuntime.NODEJS_18_X],
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
};
