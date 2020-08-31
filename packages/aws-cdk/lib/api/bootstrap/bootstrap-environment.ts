import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { loadStructuredFile, toYAML } from '../../serialize';
import { SdkProvider } from '../aws-auth';
import { DeployStackResult } from '../deploy-stack';
import { BootstrapEnvironmentOptions, BootstrappingParameters } from './bootstrap-props';
import { deployBootstrapStack, bootstrapVersionFromTemplate } from './deploy-bootstrap';
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
        return this.defaultBootstrap(environment, sdkProvider, options);
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
      throw new Error('--trust can only be passed for the new bootstrap experience.');
    }
    if (params.cloudFormationExecutionPolicies?.length) {
      throw new Error('--cloudformation-execution-policies can only be passed for the new bootstrap experience.');
    }
    if (params.qualifier) {
      throw new Error('--qualifier can only be passed for the new bootstrap experience.');
    }

    return deployBootstrapStack(
      await this.loadTemplate(params),
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
  private async defaultBootstrap(
    environment: cxapi.Environment,
    sdkProvider: SdkProvider,
    options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {

    const params = options.parameters ?? {};

    if (params.trustedAccounts?.length && !params.cloudFormationExecutionPolicies?.length) {
      throw new Error('--cloudformation-execution-policies are required if --trust has been passed!');
    }

    const bootstrapTemplate = await this.loadTemplate();

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
      return this.defaultBootstrap(environment, sdkProvider, options);
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