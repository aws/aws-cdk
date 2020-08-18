import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { loadStructuredFile } from '../../serialize';
import { SdkProvider } from '../aws-auth';
import { DeployStackResult } from '../deploy-stack';
import { BootstrapEnvironmentOptions } from './bootstrap-props';
import { deployBootstrapStack } from './deploy-bootstrap';
import { legacyBootstrapTemplate } from './legacy-template';

/* eslint-disable max-len */

/**
 * Deploy legacy bootstrap stack
 *
 * @experimental
 */
export async function bootstrapEnvironment(environment: cxapi.Environment, sdkProvider: SdkProvider, options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {
  const params = options.parameters ?? {};

  if (params.trustedAccounts?.length) {
    throw new Error('--trust can only be passed for the new bootstrap experience.');
  }
  if (params.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies can only be passed for the new bootstrap experience.');
  }
  if (params.qualifier) {
    throw new Error('--qualifier can only be passed for the new bootstrap experience.');
  }

  return deployBootstrapStack(
    legacyBootstrapTemplate(params),
    {},
    environment,
    sdkProvider,
    options);
}

/**
 * Deploy CI/CD-ready bootstrap stack from template
 *
 * @experimental
 */
export async function bootstrapEnvironment2(
  environment: cxapi.Environment,
  sdkProvider: SdkProvider,
  options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {

  const params = options.parameters ?? {};

  if (params.trustedAccounts?.length && !params.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies are required if --trust has been passed!');
  }

  const bootstrapTemplatePath = path.join(__dirname, 'bootstrap-template.yaml');
  const bootstrapTemplate = await loadStructuredFile(bootstrapTemplatePath);

  return deployBootstrapStack(
    bootstrapTemplate,
    {
      FileAssetsBucketName: params.bucketName,
      FileAssetsBucketKmsKeyId: params.kmsKeyId,
      TrustedAccounts: params.trustedAccounts?.join(','),
      CloudFormationExecutionPolicies: params.cloudFormationExecutionPolicies?.join(','),
      Qualifier: params.qualifier,
      PublicAccessBlockConfiguration: params.publicAccessBlockConfiguration || params.publicAccessBlockConfiguration === undefined ? 'true' : 'false',
    },
    environment,
    sdkProvider,
    options);
}