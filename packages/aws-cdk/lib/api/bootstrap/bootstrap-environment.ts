import { info } from 'console';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { loadStructuredFile, toYAML } from '../../serialize';
import { SdkProvider } from '../aws-auth';
import { DeployStackResult } from '../deploy-stack';
import { BootstrapEnvironmentOptions, BootstrappingParameters } from './bootstrap-props';
import { BootstrapStack, bootstrapVersionFromTemplate } from './deploy-bootstrap';
import { legacyBootstrapTemplate } from './legacy-template';

/* eslint-disable max-len */

export type BootstrapSource =
  { source: 'legacy' }
  | { source: 'default' }
  | { source: 'custom'; templateFile: string };


export class Bootstrapper {
  constructor(private readonly source: BootstrapSource) {
  }

  public bootstrapEnvironment(environment: cxapi.Environment, sdkProvider: SdkProvider, options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {
    switch (this.source.source) {
      case 'legacy':
        return this.legacyBootstrap(environment, sdkProvider, options);
      case 'default':
        return this.modernBootstrap(environment, sdkProvider, options);
      case 'custom':
        return this.customBootstrap(environment, sdkProvider, options);
    }
  }

  public async showTemplate() {
    const template = await this.loadTemplate();
    process.stdout.write(`${toYAML(template)}\n`);
  }

  /**
   * Deploy legacy bootstrap stack
   *
   * @experimental
   */
  private async legacyBootstrap(environment: cxapi.Environment, sdkProvider: SdkProvider, options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {
    const params = options.parameters ?? {};

    if (params.trustedAccounts?.length) {
      throw new Error('--trust can only be passed for the modern bootstrap experience.');
    }
    if (params.cloudFormationExecutionPolicies?.length) {
      throw new Error('--cloudformation-execution-policies can only be passed for the modern bootstrap experience.');
    }
    if (params.createCustomerMasterKey !== undefined) {
      throw new Error('--bootstrap-customer-key can only be passed for the modern bootstrap experience.');
    }
    if (params.qualifier) {
      throw new Error('--qualifier can only be passed for the modern bootstrap experience.');
    }

    const current = await BootstrapStack.lookup(sdkProvider, environment, options.toolkitStackName);
    return current.update(await this.loadTemplate(params), {}, {
      ...options,
      terminationProtection: options.terminationProtection ?? current.terminationProtection,
    });
  }

  /**
   * Deploy CI/CD-ready bootstrap stack from template
   *
   * @experimental
   */
  private async modernBootstrap(
    environment: cxapi.Environment,
    sdkProvider: SdkProvider,
    options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {

    const params = options.parameters ?? {};

    const bootstrapTemplate = await this.loadTemplate();

    const current = await BootstrapStack.lookup(sdkProvider, environment, options.toolkitStackName);

    if (params.createCustomerMasterKey !== undefined && params.kmsKeyId) {
      throw new Error('You cannot pass \'--bootstrap-kms-key-id\' and \'--bootstrap-customer-key\' together. Specify one or the other');
    }

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

    // To prevent user errors, require --cfn-exec-policies always
    // (Hopefully until we get https://github.com/aws/aws-cdk/pull/9867 approved)
    if (cloudFormationExecutionPolicies.length === 0) {
      throw new Error('Please pass \'--cloudformation-execution-policies\' to specify deployment permissions. Try a managed policy of the form \'arn:aws:iam::aws:policy/<PolicyName>\'.');
    }

    // * If an ARN is given, that ARN. Otherwise:
    //   * '-' if customerKey = false
    //   * '' if customerKey = true
    //   * if customerKey is also not given
    //     * undefined if we already had a value in place (reusing what we had)
    //     * '-' if this is the first time we're deploying this stack (or upgrading from old to new bootstrap)
    const currentKmsKeyId = current.parameters.FileAssetsBucketKmsKeyId;
    const kmsKeyId = params.kmsKeyId ??
      (params.createCustomerMasterKey === true ? CREATE_NEW_KEY :
        params.createCustomerMasterKey === false || currentKmsKeyId === undefined ? USE_AWS_MANAGED_KEY :
          undefined);

    // Remind people what we settled on
    info(`Trusted accounts:   ${trustedAccounts.length > 0 ? trustedAccounts.join(', ') : '(none)'}`);
    info(`Execution policies: ${cloudFormationExecutionPolicies.join(', ')}`);

    return current.update(
      bootstrapTemplate,
      {
        FileAssetsBucketName: params.bucketName,
        FileAssetsBucketKmsKeyId: kmsKeyId,
        // Empty array becomes empty string
        TrustedAccounts: trustedAccounts.join(','),
        CloudFormationExecutionPolicies: cloudFormationExecutionPolicies.join(','),
        Qualifier: params.qualifier,
        PublicAccessBlockConfiguration: params.publicAccessBlockConfiguration || params.publicAccessBlockConfiguration === undefined ? 'true' : 'false',
      }, {
        ...options,
        terminationProtection: options.terminationProtection ?? current.terminationProtection,
      });
  }

  private async customBootstrap(
    environment: cxapi.Environment,
    sdkProvider: SdkProvider,
    options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {

    // Look at the template, decide whether it's most likely a legacy or modern bootstrap
    // template, and use the right bootstrapper for that.
    const version = bootstrapVersionFromTemplate(await this.loadTemplate());
    if (version === 0) {
      return this.legacyBootstrap(environment, sdkProvider, options);
    } else {
      return this.modernBootstrap(environment, sdkProvider, options);
    }
  }

  private async loadTemplate(params: BootstrappingParameters = {}): Promise<any> {
    switch (this.source.source) {
      case 'custom':
        return loadStructuredFile(this.source.templateFile);
      case 'default':
        return loadStructuredFile(path.join(__dirname, 'bootstrap-template.yaml'));
      case 'legacy':
        return legacyBootstrapTemplate(params);
    }
  }
}

/**
 * Magic parameter value that will cause the bootstrap-template.yml to NOT create a CMK but use the default keyo
 */
const USE_AWS_MANAGED_KEY = 'AWS_MANAGED_KEY';

/**
 * Magic parameter value that will cause the bootstrap-template.yml to create a CMK
 */
const CREATE_NEW_KEY = '';