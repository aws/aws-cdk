import { info } from 'console';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { warning } from '../../logging';
import { loadStructuredFile } from '../../serialize';
import { SdkProvider } from '../aws-auth';
import { DeployStackResult } from '../deploy-stack';
import { BootstrapEnvironmentOptions } from './bootstrap-props';
import { BootstrapStack } from './deploy-bootstrap';
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

  const current = await BootstrapStack.lookup(sdkProvider, environment, options.toolkitStackName);
  return current.update(legacyBootstrapTemplate(params), {}, options);
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

  const bootstrapTemplatePath = path.join(__dirname, 'bootstrap-template.yaml');
  const bootstrapTemplate = await loadStructuredFile(bootstrapTemplatePath);

  const current = await BootstrapStack.lookup(sdkProvider, environment, options.toolkitStackName);

  // If people re-bootstrap, existing parameter values are reused so that people don't accidentally change the configuration
  // on their bootstrap stack (this happens automatically in deployStack). However, to do proper validation on the
  // combined arguments (such that if --trust has been given, --cloudformation-execution-policies is necessary as well)
  // we need to take this parameter reuse into account.
  //
  // Ideally we'd do this inside the template, but the `Rules` section of CFN
  // templates doesn't seem to be able to express the conditions that we need
  // (can't use Fn::Join or reference Conditions) so we do it here instead.
  const trustedAccounts = params.trustedAccounts ?? current.parameters.TrustedAccounts?.split(',') ?? [];
  const cloudFormationExecutionPolicies = params.cloudFormationExecutionPolicies ?? current.parameters.CloudFormationExecutionPolicies?.split(',') ?? [];

  if (trustedAccounts.length > 0 && cloudFormationExecutionPolicies.length === 0) {
    throw new Error(`You need to pass \'--cloudformation-execution-policies\' when trusting other accounts using \'--trust\' (${trustedAccounts}). Try a managed policy of the form \'arn:aws:iam::aws:policy/<PolicyName>\'.`);
  }
  if (trustedAccounts.length === 0 && cloudFormationExecutionPolicies.length === 0) {
    // For self-trust it's okay to default to AdministratorAccess, and it improves the usability of bootstrapping a lot.
    //
    // We don't actually make the implicity policy a physical parameter. The template will infer it instead,
    // we simply do the UI advertising that behavior here.
    //
    // If we DID make it an explicit parameter, we wouldn't be able to tell the difference between whether
    // we inferred it or whether the user told us, and the sequence:
    //
    // $ cdk bootstrap
    // $ cdk bootstrap --trust 1234
    //
    // Would leave AdministratorAccess policies with a trust relationship, without the user explicitly
    // approving the trust policy.
    const implicitPolicy = `arn:${await current.partition()}:iam::aws:policy/AdministratorAccess`;
    warning(`Defaulting execution policy to '${implicitPolicy}'. Pass \'--cloudformation-execution-policies\' to customize.`);
  } else {
    // Remind people what the current settings are
    info(`Trusted accounts:   ${trustedAccounts.length > 0 ? trustedAccounts.join(', ') : '(none)'}`);
    info(`Execution policies: ${cloudFormationExecutionPolicies.join(', ')}`);
  }

  return current.update(
    bootstrapTemplate,
    {
      FileAssetsBucketName: params.bucketName,
      FileAssetsBucketKmsKeyId: params.kmsKeyId,
      // Empty array becomes empty string
      TrustedAccounts: trustedAccounts.join(','),
      CloudFormationExecutionPolicies: cloudFormationExecutionPolicies.join(','),
      Qualifier: params.qualifier,
      PublicAccessBlockConfiguration: params.publicAccessBlockConfiguration || params.publicAccessBlockConfiguration === undefined ? 'true' : 'false',
    },
    options);
}