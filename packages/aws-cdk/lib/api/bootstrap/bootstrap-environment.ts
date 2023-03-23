import { info } from 'console';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { BootstrapEnvironmentOptions, BootstrappingParameters } from './bootstrap-props';
import { BootstrapStack, bootstrapVersionFromTemplate } from './deploy-bootstrap';
import { legacyBootstrapTemplate } from './legacy-template';
import { warning } from '../../logging';
import { loadStructuredFile, serializeStructure } from '../../serialize';
import { rootDir } from '../../util/directories';
import { ISDK, Mode, SdkProvider } from '../aws-auth';
import { DeployStackResult } from '../deploy-stack';

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

  public async showTemplate(json: boolean) {
    const template = await this.loadTemplate();
    process.stdout.write(`${serializeStructure(template, json)}\n`);
  }

  /**
   * Deploy legacy bootstrap stack
   *
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
   */
  private async modernBootstrap(
    environment: cxapi.Environment,
    sdkProvider: SdkProvider,
    options: BootstrapEnvironmentOptions = {}): Promise<DeployStackResult> {

    const params = options.parameters ?? {};

    const bootstrapTemplate = await this.loadTemplate();

    const current = await BootstrapStack.lookup(sdkProvider, environment, options.toolkitStackName);
    const partition = await current.partition();

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
    const trustedAccounts = params.trustedAccounts ?? splitCfnArray(current.parameters.TrustedAccounts);
    info(`Trusted accounts for deployment: ${trustedAccounts.length > 0 ? trustedAccounts.join(', ') : '(none)'}`);

    const trustedAccountsForLookup = params.trustedAccountsForLookup ?? splitCfnArray(current.parameters.TrustedAccountsForLookup);
    info(`Trusted accounts for lookup: ${trustedAccountsForLookup.length > 0 ? trustedAccountsForLookup.join(', ') : '(none)'}`);

    const cloudFormationExecutionPolicies = params.cloudFormationExecutionPolicies ?? splitCfnArray(current.parameters.CloudFormationExecutionPolicies);
    if (trustedAccounts.length === 0 && cloudFormationExecutionPolicies.length === 0) {
      // For self-trust it's okay to default to AdministratorAccess, and it improves the usability of bootstrapping a lot.
      //
      // We don't actually make the implicitly policy a physical parameter. The template will infer it instead,
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
      const implicitPolicy = `arn:${partition}:iam::aws:policy/AdministratorAccess`;
      warning(`Using default execution policy of '${implicitPolicy}'. Pass '--cloudformation-execution-policies' to customize.`);
    } else if (cloudFormationExecutionPolicies.length === 0) {
      throw new Error('Please pass \'--cloudformation-execution-policies\' when using \'--trust\' to specify deployment permissions. Try a managed policy of the form \'arn:aws:iam::aws:policy/<PolicyName>\'.');
    } else {
      // Remind people what the current settings are
      info(`Execution policies: ${cloudFormationExecutionPolicies.join(', ')}`);
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
          params.createCustomerMasterKey === false || currentKmsKeyId === undefined ? USE_AWS_MANAGED_KEY : undefined);

    /* A permissions boundary can be provided via:
    *    - the flag indicating the example one should be used
    *    - the name indicating the custom permissions boundary to be used
    * Re-bootstrapping will NOT be blocked by either tightening or relaxing the permissions' boundary.
    */

    // InputPermissionsBoundary is an `any` type and if it is not defined it
    // appears as an empty string ''. We need to force it to evaluate an empty string
    // as undefined
    const currentPermissionsBoundary: string | undefined = current.parameters.InputPermissionsBoundary || undefined;
    const inputPolicyName = params.examplePermissionsBoundary ? CDK_BOOTSTRAP_PERMISSIONS_BOUNDARY : params.customPermissionsBoundary;
    let policyName: string | undefined;
    if (inputPolicyName) {
      // If the example policy is not already in place, it must be created.
      const sdk = (await sdkProvider.forEnvironment(environment, Mode.ForWriting)).sdk;
      policyName = await this.getPolicyName(environment, sdk, inputPolicyName, partition, params);
    }
    if (currentPermissionsBoundary !== policyName) {
      if (!currentPermissionsBoundary) {
        warning(`Adding new permissions boundary ${policyName}`);
      } else if (!policyName) {
        warning(`Removing existing permissions boundary ${currentPermissionsBoundary}`);
      } else {
        warning(`Changing permissions boundary from ${currentPermissionsBoundary} to ${policyName}`);
      }
    }

    return current.update(
      bootstrapTemplate,
      {
        FileAssetsBucketName: params.bucketName,
        FileAssetsBucketKmsKeyId: kmsKeyId,
        // Empty array becomes empty string
        TrustedAccounts: trustedAccounts.join(','),
        TrustedAccountsForLookup: trustedAccountsForLookup.join(','),
        CloudFormationExecutionPolicies: cloudFormationExecutionPolicies.join(','),
        Qualifier: params.qualifier,
        PublicAccessBlockConfiguration: params.publicAccessBlockConfiguration || params.publicAccessBlockConfiguration === undefined ? 'true' : 'false',
        InputPermissionsBoundary: policyName,
      }, {
        ...options,
        terminationProtection: options.terminationProtection ?? current.terminationProtection,
      });
  }

  private async getPolicyName(
    environment: cxapi.Environment,
    sdk: ISDK,
    permissionsBoundary: string,
    partition: string,
    params: BootstrappingParameters): Promise<string> {

    if (permissionsBoundary !== CDK_BOOTSTRAP_PERMISSIONS_BOUNDARY) {
      this.validatePolicyName(permissionsBoundary);
      return Promise.resolve(permissionsBoundary);
    }
    // if no Qualifier is supplied, resort to the default one
    const arn = await this.getExamplePermissionsBoundary(params.qualifier ?? 'hnb659fds', partition, environment.account, sdk);
    const policyName = arn.split('/').pop();
    if (!policyName) {
      throw new Error('Could not retrieve the example permission boundary!');
    }
    return Promise.resolve(policyName);
  }

  private async getExamplePermissionsBoundary(qualifier: string, partition: string, account: string, sdk: ISDK): Promise<string> {
    const iam = sdk.iam();

    let policyName = `cdk-${qualifier}-permissions-boundary`;
    const arn = `arn:${partition}:iam::${account}:policy/${policyName}`;

    try {
      let getPolicyResp = await iam.getPolicy({ PolicyArn: arn }).promise();
      if (getPolicyResp.Policy) {
        return arn;
      }
    } catch (e: any) {
      // https://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicy.html#API_GetPolicy_Errors
      if (e.name === 'NoSuchEntity') {
        //noop, proceed with creating the policy
      } else {
        throw e;
      }
    }

    const policyDoc = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['*'],
          Resource: '*',
          Effect: 'Allow',
          Sid: 'ExplicitAllowAll',
        },
        {
          Condition: {
            StringEquals: {
              'iam:PermissionsBoundary': `arn:${partition}:iam::${account}:policy/cdk-${qualifier}-permissions-boundary`,
            },
          },
          Action: [
            'iam:CreateUser',
            'iam:CreateRole',
            'iam:PutRolePermissionsBoundary',
            'iam:PutUserPermissionsBoundary',
          ],
          Resource: '*',
          Effect: 'Allow',
          Sid: 'DenyAccessIfRequiredPermBoundaryIsNotBeingApplied',
        },
        {
          Action: [
            'iam:CreatePolicyVersion',
            'iam:DeletePolicy',
            'iam:DeletePolicyVersion',
            'iam:SetDefaultPolicyVersion',
          ],
          Resource: `arn:${partition}:iam::${account}:policy/cdk-${qualifier}-permissions-boundary`,
          Effect: 'Deny',
          Sid: 'DenyPermBoundaryIAMPolicyAlteration',
        },
        {
          Action: [
            'iam:DeleteUserPermissionsBoundary',
            'iam:DeleteRolePermissionsBoundary',
          ],
          Resource: '*',
          Effect: 'Deny',
          Sid: 'DenyRemovalOfPermBoundaryFromAnyUserOrRole',
        },
      ],
    };
    const request = {
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(policyDoc),
    };
    const createPolicyResponse = await iam.createPolicy(request).promise();
    if (createPolicyResponse.Policy?.Arn) {
      return createPolicyResponse.Policy.Arn;
    } else {
      throw new Error(`Could not retrieve the example permission boundary ${arn}!`);
    }
  }

  private validatePolicyName(permissionsBoundary: string) {
    // https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreatePolicy.html
    const regexp: RegExp = /[\w+=,.@-]+/;
    const matches = regexp.exec(permissionsBoundary);
    if (!(matches && matches.length === 1 && matches[0] === permissionsBoundary)) {
      throw new Error(`The permissions boundary name ${permissionsBoundary} does not match the IAM conventions.`);
    }
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
        return loadStructuredFile(path.join(rootDir(), 'lib', 'api', 'bootstrap', 'bootstrap-template.yaml'));
      case 'legacy':
        return legacyBootstrapTemplate(params);
    }
  }
}

/**
 * Magic parameter value that will cause the bootstrap-template.yml to NOT create a CMK but use the default key
 */
const USE_AWS_MANAGED_KEY = 'AWS_MANAGED_KEY';

/**
 * Magic parameter value that will cause the bootstrap-template.yml to create a CMK
 */
const CREATE_NEW_KEY = '';
/**
 * Parameter value indicating the use of the default, CDK provided permissions boundary for bootstrap-template.yml
 */
const CDK_BOOTSTRAP_PERMISSIONS_BOUNDARY = 'CDK_BOOTSTRAP_PERMISSIONS_BOUNDARY';

/**
 * Split an array-like CloudFormation parameter on ,
 *
 * An empty string is the empty array (instead of `['']`).
 */
function splitCfnArray(xs: string | undefined): string[] {
  if (xs === '' || xs === undefined) { return []; }
  return xs.split(',');
}
