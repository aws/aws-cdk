import {
  AppSyncClient,
  FunctionConfiguration,
  GetSchemaCreationStatusCommand,
  type GetSchemaCreationStatusCommandInput,
  type GetSchemaCreationStatusCommandOutput,
  type ListFunctionsCommandInput,
  paginateListFunctions,
  StartSchemaCreationCommand,
  type StartSchemaCreationCommandInput,
  type StartSchemaCreationCommandOutput,
  UpdateApiKeyCommand,
  type UpdateApiKeyCommandInput,
  type UpdateApiKeyCommandOutput,
  UpdateFunctionCommand,
  type UpdateFunctionCommandInput,
  type UpdateFunctionCommandOutput,
  UpdateResolverCommand,
  type UpdateResolverCommandInput,
  type UpdateResolverCommandOutput,
} from '@aws-sdk/client-appsync';
import {
  CloudFormationClient,
  ContinueUpdateRollbackCommand,
  ContinueUpdateRollbackCommandInput,
  ContinueUpdateRollbackCommandOutput,
  CreateChangeSetCommand,
  type CreateChangeSetCommandInput,
  type CreateChangeSetCommandOutput,
  CreateGeneratedTemplateCommand,
  type CreateGeneratedTemplateCommandInput,
  type CreateGeneratedTemplateCommandOutput,
  CreateStackCommand,
  type CreateStackCommandInput,
  type CreateStackCommandOutput,
  DeleteChangeSetCommand,
  type DeleteChangeSetCommandInput,
  type DeleteChangeSetCommandOutput,
  DeleteGeneratedTemplateCommand,
  type DeleteGeneratedTemplateCommandInput,
  type DeleteGeneratedTemplateCommandOutput,
  DeleteStackCommand,
  type DeleteStackCommandInput,
  type DeleteStackCommandOutput,
  DescribeChangeSetCommand,
  type DescribeChangeSetCommandInput,
  type DescribeChangeSetCommandOutput,
  DescribeGeneratedTemplateCommand,
  type DescribeGeneratedTemplateCommandInput,
  type DescribeGeneratedTemplateCommandOutput,
  DescribeResourceScanCommand,
  type DescribeResourceScanCommandInput,
  type DescribeResourceScanCommandOutput,
  DescribeStackEventsCommand,
  type DescribeStackEventsCommandInput,
  DescribeStackEventsCommandOutput,
  DescribeStackResourcesCommand,
  DescribeStackResourcesCommandInput,
  DescribeStackResourcesCommandOutput,
  DescribeStacksCommand,
  type DescribeStacksCommandInput,
  type DescribeStacksCommandOutput,
  ExecuteChangeSetCommand,
  type ExecuteChangeSetCommandInput,
  type ExecuteChangeSetCommandOutput,
  GetGeneratedTemplateCommand,
  type GetGeneratedTemplateCommandInput,
  type GetGeneratedTemplateCommandOutput,
  GetTemplateCommand,
  type GetTemplateCommandInput,
  type GetTemplateCommandOutput,
  GetTemplateSummaryCommand,
  type GetTemplateSummaryCommandInput,
  type GetTemplateSummaryCommandOutput,
  ListExportsCommand,
  type ListExportsCommandInput,
  type ListExportsCommandOutput,
  ListResourceScanRelatedResourcesCommand,
  type ListResourceScanRelatedResourcesCommandInput,
  type ListResourceScanRelatedResourcesCommandOutput,
  ListResourceScanResourcesCommand,
  type ListResourceScanResourcesCommandInput,
  type ListResourceScanResourcesCommandOutput,
  ListResourceScansCommand,
  type ListResourceScansCommandInput,
  type ListResourceScansCommandOutput,
  type ListStackResourcesCommandInput,
  ListStacksCommand,
  ListStacksCommandInput,
  ListStacksCommandOutput,
  paginateListStackResources,
  RollbackStackCommand,
  RollbackStackCommandInput,
  RollbackStackCommandOutput,
  StackResourceSummary,
  StartResourceScanCommand,
  type StartResourceScanCommandInput,
  type StartResourceScanCommandOutput,
  UpdateStackCommand,
  type UpdateStackCommandInput,
  type UpdateStackCommandOutput,
  UpdateTerminationProtectionCommand,
  type UpdateTerminationProtectionCommandInput,
  type UpdateTerminationProtectionCommandOutput,
} from '@aws-sdk/client-cloudformation';
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  type DescribeLogGroupsCommandInput,
  type DescribeLogGroupsCommandOutput,
  FilterLogEventsCommand,
  FilterLogEventsCommandInput,
  FilterLogEventsCommandOutput,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  CodeBuildClient,
  UpdateProjectCommand,
  type UpdateProjectCommandInput,
  type UpdateProjectCommandOutput,
} from '@aws-sdk/client-codebuild';
import {
  DescribeAvailabilityZonesCommand,
  type DescribeAvailabilityZonesCommandInput,
  type DescribeAvailabilityZonesCommandOutput,
  DescribeImagesCommand,
  type DescribeImagesCommandInput,
  type DescribeImagesCommandOutput,
  DescribeInstancesCommand,
  type DescribeInstancesCommandInput,
  type DescribeInstancesCommandOutput,
  DescribeRouteTablesCommand,
  type DescribeRouteTablesCommandInput,
  type DescribeRouteTablesCommandOutput,
  DescribeSecurityGroupsCommand,
  type DescribeSecurityGroupsCommandInput,
  type DescribeSecurityGroupsCommandOutput,
  DescribeSubnetsCommand,
  type DescribeSubnetsCommandInput,
  type DescribeSubnetsCommandOutput,
  DescribeVpcEndpointServicesCommand,
  type DescribeVpcEndpointServicesCommandInput,
  type DescribeVpcEndpointServicesCommandOutput,
  DescribeVpcsCommand,
  type DescribeVpcsCommandInput,
  type DescribeVpcsCommandOutput,
  DescribeVpnGatewaysCommand,
  type DescribeVpnGatewaysCommandInput,
  type DescribeVpnGatewaysCommandOutput,
  EC2Client,
} from '@aws-sdk/client-ec2';
import {
  BatchDeleteImageCommand,
  BatchDeleteImageCommandInput,
  BatchDeleteImageCommandOutput,
  CreateRepositoryCommand,
  type CreateRepositoryCommandInput,
  type CreateRepositoryCommandOutput,
  DescribeImagesCommand as ECRDescribeImagesCommand,
  type DescribeImagesCommandInput as ECRDescribeImagesCommandInput,
  type DescribeImagesCommandOutput as ECRDescribeImagesCommandOutput,
  DescribeRepositoriesCommand,
  type DescribeRepositoriesCommandInput,
  type DescribeRepositoriesCommandOutput,
  ECRClient,
  GetAuthorizationTokenCommand,
  type GetAuthorizationTokenCommandInput,
  type GetAuthorizationTokenCommandOutput,
  ListImagesCommand,
  ListImagesCommandInput,
  ListImagesCommandOutput,
  PutImageCommand,
  PutImageCommandInput,
  PutImageCommandOutput,
  PutImageScanningConfigurationCommand,
  type PutImageScanningConfigurationCommandInput,
  type PutImageScanningConfigurationCommandOutput,
  BatchGetImageCommandInput,
  BatchGetImageCommand,
  BatchGetImageCommandOutput,
} from '@aws-sdk/client-ecr';
import {
  DescribeServicesCommandInput,
  ECSClient,
  ListClustersCommand,
  type ListClustersCommandInput,
  type ListClustersCommandOutput,
  RegisterTaskDefinitionCommand,
  RegisterTaskDefinitionCommandInput,
  type RegisterTaskDefinitionCommandOutput,
  UpdateServiceCommand,
  type UpdateServiceCommandInput,
  type UpdateServiceCommandOutput,
  waitUntilServicesStable,
} from '@aws-sdk/client-ecs';
import {
  DescribeListenersCommand,
  type DescribeListenersCommandInput,
  type DescribeListenersCommandOutput,
  DescribeLoadBalancersCommand,
  type DescribeLoadBalancersCommandInput,
  type DescribeLoadBalancersCommandOutput,
  DescribeTagsCommand,
  type DescribeTagsCommandInput,
  type DescribeTagsCommandOutput,
  ElasticLoadBalancingV2Client,
  Listener,
  LoadBalancer,
  paginateDescribeListeners,
  paginateDescribeLoadBalancers,
} from '@aws-sdk/client-elastic-load-balancing-v2';
import {
  CreatePolicyCommand,
  type CreatePolicyCommandInput,
  type CreatePolicyCommandOutput,
  GetPolicyCommand,
  type GetPolicyCommandInput,
  type GetPolicyCommandOutput,
  GetRoleCommand,
  type GetRoleCommandInput,
  type GetRoleCommandOutput,
  IAMClient,
} from '@aws-sdk/client-iam';
import {
  DescribeKeyCommand,
  type DescribeKeyCommandInput,
  type DescribeKeyCommandOutput,
  KMSClient,
  ListAliasesCommand,
  type ListAliasesCommandInput,
  type ListAliasesCommandOutput,
} from '@aws-sdk/client-kms';
import {
  InvokeCommand,
  type InvokeCommandInput,
  type InvokeCommandOutput,
  LambdaClient,
  PublishVersionCommand,
  type PublishVersionCommandInput,
  type PublishVersionCommandOutput,
  UpdateAliasCommand,
  type UpdateAliasCommandInput,
  type UpdateAliasCommandOutput,
  UpdateFunctionCodeCommand,
  type UpdateFunctionCodeCommandInput,
  type UpdateFunctionCodeCommandOutput,
  UpdateFunctionConfigurationCommand,
  type UpdateFunctionConfigurationCommandInput,
  type UpdateFunctionConfigurationCommandOutput,
  waitUntilFunctionUpdatedV2,
} from '@aws-sdk/client-lambda';
import {
  GetHostedZoneCommand,
  type GetHostedZoneCommandInput,
  type GetHostedZoneCommandOutput,
  ListHostedZonesByNameCommand,
  type ListHostedZonesByNameCommandInput,
  type ListHostedZonesByNameCommandOutput,
  ListHostedZonesCommand,
  type ListHostedZonesCommandInput,
  type ListHostedZonesCommandOutput,
  Route53Client,
} from '@aws-sdk/client-route-53';
import {
  type CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  DeleteObjectTaggingCommand,
  DeleteObjectTaggingCommandInput,
  DeleteObjectTaggingCommandOutput,
  GetBucketEncryptionCommand,
  type GetBucketEncryptionCommandInput,
  type GetBucketEncryptionCommandOutput,
  GetBucketLocationCommand,
  type GetBucketLocationCommandInput,
  type GetBucketLocationCommandOutput,
  GetObjectCommand,
  type GetObjectCommandInput,
  type GetObjectCommandOutput,
  GetObjectTaggingCommand,
  GetObjectTaggingCommandInput,
  GetObjectTaggingCommandOutput,
  ListObjectsV2Command,
  type ListObjectsV2CommandInput,
  type ListObjectsV2CommandOutput,
  type PutObjectCommandInput,
  PutObjectTaggingCommand,
  PutObjectTaggingCommandInput,
  PutObjectTaggingCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  GetSecretValueCommand,
  type GetSecretValueCommandInput,
  type GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  SFNClient,
  UpdateStateMachineCommand,
  UpdateStateMachineCommandInput,
  UpdateStateMachineCommandOutput,
} from '@aws-sdk/client-sfn';
import {
  GetParameterCommand,
  type GetParameterCommandInput,
  type GetParameterCommandOutput,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';
import { getEndpointFromInstructions } from '@smithy/middleware-endpoint';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';
import { AwsCredentialIdentityProvider, Logger } from '@smithy/types';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import { WaiterResult } from '@smithy/util-waiter';
import { AccountAccessKeyCache } from './account-cache';
import { cachedAsync } from './cached';
import { Account } from './sdk-provider';
import { defaultCliUserAgent } from './user-agent';
import { debug } from '../../logging';
import { AuthenticationError } from '../../toolkit/error';
import { traceMethods } from '../../util/tracing';

export interface S3ClientOptions {
  /**
   * If APIs are used that require MD5 checksums.
   *
   * Some S3 APIs in SDKv2 have a bug that always requires them to use a MD5 checksum.
   * These APIs are not going to be supported in a FIPS environment.
   */
  needsMd5Checksums?: boolean;
}

/**
 * Additional SDK configuration options
 */
export interface SdkOptions {
  /**
   * Additional descriptive strings that indicate where the "AssumeRole" credentials are coming from
   *
   * Will be printed in an error message to help users diagnose auth problems.
   */
  readonly assumeRoleCredentialsSourceDescription?: string;
}

// TODO: still some cleanup here. Make the pagination functions do all the work here instead of in individual packages.
// Also add async/await. Does that actually matter in this context? Find out and update accordingly.

// Also add notes to the PR about why you imported everything individually and used 'type' so reviewers don't have to ask.

export interface ConfigurationOptions {
  region: string;
  credentials: AwsCredentialIdentityProvider;
  requestHandler: NodeHttpHandlerOptions;
  retryStrategy: ConfiguredRetryStrategy;
  customUserAgent: string;
  logger?: Logger;
  s3DisableBodySigning?: boolean;
  computeChecksums?: boolean;
}

export interface IAppSyncClient {
  getSchemaCreationStatus(input: GetSchemaCreationStatusCommandInput): Promise<GetSchemaCreationStatusCommandOutput>;
  startSchemaCreation(input: StartSchemaCreationCommandInput): Promise<StartSchemaCreationCommandOutput>;
  updateApiKey(input: UpdateApiKeyCommandInput): Promise<UpdateApiKeyCommandOutput>;
  updateFunction(input: UpdateFunctionCommandInput): Promise<UpdateFunctionCommandOutput>;
  updateResolver(input: UpdateResolverCommandInput): Promise<UpdateResolverCommandOutput>;
  // Pagination functions
  listFunctions(input: ListFunctionsCommandInput): Promise<FunctionConfiguration[]>;
}

export interface ICloudFormationClient {
  continueUpdateRollback(input: ContinueUpdateRollbackCommandInput): Promise<ContinueUpdateRollbackCommandOutput>;
  createChangeSet(input: CreateChangeSetCommandInput): Promise<CreateChangeSetCommandOutput>;
  createGeneratedTemplate(input: CreateGeneratedTemplateCommandInput): Promise<CreateGeneratedTemplateCommandOutput>;
  createStack(input: CreateStackCommandInput): Promise<CreateStackCommandOutput>;
  deleteChangeSet(input: DeleteChangeSetCommandInput): Promise<DeleteChangeSetCommandOutput>;
  deleteGeneratedTemplate(input: DeleteGeneratedTemplateCommandInput): Promise<DeleteGeneratedTemplateCommandOutput>;
  deleteStack(input: DeleteStackCommandInput): Promise<DeleteStackCommandOutput>;
  describeChangeSet(input: DescribeChangeSetCommandInput): Promise<DescribeChangeSetCommandOutput>;
  describeGeneratedTemplate(
    input: DescribeGeneratedTemplateCommandInput,
  ): Promise<DescribeGeneratedTemplateCommandOutput>;
  describeResourceScan(input: DescribeResourceScanCommandInput): Promise<DescribeResourceScanCommandOutput>;
  describeStacks(input: DescribeStacksCommandInput): Promise<DescribeStacksCommandOutput>;
  describeStackResources(input: DescribeStackResourcesCommandInput): Promise<DescribeStackResourcesCommandOutput>;
  executeChangeSet(input: ExecuteChangeSetCommandInput): Promise<ExecuteChangeSetCommandOutput>;
  getGeneratedTemplate(input: GetGeneratedTemplateCommandInput): Promise<GetGeneratedTemplateCommandOutput>;
  getTemplate(input: GetTemplateCommandInput): Promise<GetTemplateCommandOutput>;
  getTemplateSummary(input: GetTemplateSummaryCommandInput): Promise<GetTemplateSummaryCommandOutput>;
  listExports(input: ListExportsCommandInput): Promise<ListExportsCommandOutput>;
  listResourceScanRelatedResources(
    input: ListResourceScanRelatedResourcesCommandInput,
  ): Promise<ListResourceScanRelatedResourcesCommandOutput>;
  listResourceScanResources(
    input: ListResourceScanResourcesCommandInput,
  ): Promise<ListResourceScanResourcesCommandOutput>;
  listResourceScans(input?: ListResourceScansCommandInput): Promise<ListResourceScansCommandOutput>;
  listStacks(input: ListStacksCommandInput): Promise<ListStacksCommandOutput>;
  rollbackStack(input: RollbackStackCommandInput): Promise<RollbackStackCommandOutput>;
  startResourceScan(input: StartResourceScanCommandInput): Promise<StartResourceScanCommandOutput>;
  updateStack(input: UpdateStackCommandInput): Promise<UpdateStackCommandOutput>;
  updateTerminationProtection(
    input: UpdateTerminationProtectionCommandInput,
  ): Promise<UpdateTerminationProtectionCommandOutput>;
  // Pagination functions
  describeStackEvents(input: DescribeStackEventsCommandInput): Promise<DescribeStackEventsCommandOutput>;
  listStackResources(input: ListStackResourcesCommandInput): Promise<StackResourceSummary[]>;
}

export interface ICloudWatchLogsClient {
  describeLogGroups(input: DescribeLogGroupsCommandInput): Promise<DescribeLogGroupsCommandOutput>;
  filterLogEvents(input: FilterLogEventsCommandInput): Promise<FilterLogEventsCommandOutput>;
}

export interface ICodeBuildClient {
  updateProject(input: UpdateProjectCommandInput): Promise<UpdateProjectCommandOutput>;
}
export interface IEC2Client {
  describeAvailabilityZones(
    input: DescribeAvailabilityZonesCommandInput,
  ): Promise<DescribeAvailabilityZonesCommandOutput>;
  describeImages(input: DescribeImagesCommandInput): Promise<DescribeImagesCommandOutput>;
  describeInstances(input: DescribeInstancesCommandInput): Promise<DescribeInstancesCommandOutput>;
  describeRouteTables(input: DescribeRouteTablesCommandInput): Promise<DescribeRouteTablesCommandOutput>;
  describeSecurityGroups(input: DescribeSecurityGroupsCommandInput): Promise<DescribeSecurityGroupsCommandOutput>;
  describeSubnets(input: DescribeSubnetsCommandInput): Promise<DescribeSubnetsCommandOutput>;
  describeVpcEndpointServices(
    input: DescribeVpcEndpointServicesCommandInput,
  ): Promise<DescribeVpcEndpointServicesCommandOutput>;
  describeVpcs(input: DescribeVpcsCommandInput): Promise<DescribeVpcsCommandOutput>;
  describeVpnGateways(input: DescribeVpnGatewaysCommandInput): Promise<DescribeVpnGatewaysCommandOutput>;
}

export interface IECRClient {
  batchDeleteImage(input: BatchDeleteImageCommandInput): Promise<BatchDeleteImageCommandOutput>;
  batchGetImage(input: BatchGetImageCommandInput): Promise<BatchGetImageCommandOutput>;
  createRepository(input: CreateRepositoryCommandInput): Promise<CreateRepositoryCommandOutput>;
  describeImages(input: ECRDescribeImagesCommandInput): Promise<ECRDescribeImagesCommandOutput>;
  describeRepositories(input: DescribeRepositoriesCommandInput): Promise<DescribeRepositoriesCommandOutput>;
  getAuthorizationToken(input: GetAuthorizationTokenCommandInput): Promise<GetAuthorizationTokenCommandOutput>;
  listImages(input: ListImagesCommandInput): Promise<ListImagesCommandOutput>;
  putImage(input: PutImageCommandInput): Promise<PutImageCommandOutput>;
  putImageScanningConfiguration(
    input: PutImageScanningConfigurationCommandInput,
  ): Promise<PutImageScanningConfigurationCommandOutput>;
}

export interface IECSClient {
  listClusters(input: ListClustersCommandInput): Promise<ListClustersCommandOutput>;
  registerTaskDefinition(input: RegisterTaskDefinitionCommandInput): Promise<RegisterTaskDefinitionCommandOutput>;
  updateService(input: UpdateServiceCommandInput): Promise<UpdateServiceCommandOutput>;
  // Waiters
  waitUntilServicesStable(input: DescribeServicesCommandInput): Promise<WaiterResult>;
}

export interface IElasticLoadBalancingV2Client {
  describeListeners(input: DescribeListenersCommandInput): Promise<DescribeListenersCommandOutput>;
  describeLoadBalancers(input: DescribeLoadBalancersCommandInput): Promise<DescribeLoadBalancersCommandOutput>;
  describeTags(input: DescribeTagsCommandInput): Promise<DescribeTagsCommandOutput>;
  // Pagination
  paginateDescribeListeners(input: DescribeListenersCommandInput): Promise<Listener[]>;
  paginateDescribeLoadBalancers(input: DescribeLoadBalancersCommandInput): Promise<LoadBalancer[]>;
}

export interface IIAMClient {
  createPolicy(input: CreatePolicyCommandInput): Promise<CreatePolicyCommandOutput>;
  getPolicy(input: GetPolicyCommandInput): Promise<GetPolicyCommandOutput>;
  getRole(input: GetRoleCommandInput): Promise<GetRoleCommandOutput>;
}

export interface IKMSClient {
  describeKey(input: DescribeKeyCommandInput): Promise<DescribeKeyCommandOutput>;
  listAliases(input: ListAliasesCommandInput): Promise<ListAliasesCommandOutput>;
}

export interface ILambdaClient {
  invokeCommand(input: InvokeCommandInput): Promise<InvokeCommandOutput>;
  publishVersion(input: PublishVersionCommandInput): Promise<PublishVersionCommandOutput>;
  updateAlias(input: UpdateAliasCommandInput): Promise<UpdateAliasCommandOutput>;
  updateFunctionCode(input: UpdateFunctionCodeCommandInput): Promise<UpdateFunctionCodeCommandOutput>;
  updateFunctionConfiguration(
    input: UpdateFunctionConfigurationCommandInput,
  ): Promise<UpdateFunctionConfigurationCommandOutput>;
  // Waiters
  waitUntilFunctionUpdated(delaySeconds: number, input: UpdateFunctionConfigurationCommandInput): Promise<WaiterResult>;
}

export interface IRoute53Client {
  getHostedZone(input: GetHostedZoneCommandInput): Promise<GetHostedZoneCommandOutput>;
  listHostedZones(input: ListHostedZonesCommandInput): Promise<ListHostedZonesCommandOutput>;
  listHostedZonesByName(input: ListHostedZonesByNameCommandInput): Promise<ListHostedZonesByNameCommandOutput>;
}

export interface IS3Client {
  deleteObjects(input: DeleteObjectsCommandInput): Promise<DeleteObjectsCommandOutput>;
  deleteObjectTagging(input: DeleteObjectTaggingCommandInput): Promise<DeleteObjectTaggingCommandOutput>;
  getBucketEncryption(input: GetBucketEncryptionCommandInput): Promise<GetBucketEncryptionCommandOutput>;
  getBucketLocation(input: GetBucketLocationCommandInput): Promise<GetBucketLocationCommandOutput>;
  getObject(input: GetObjectCommandInput): Promise<GetObjectCommandOutput>;
  getObjectTagging(input: GetObjectTaggingCommandInput): Promise<GetObjectTaggingCommandOutput>;
  listObjectsV2(input: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput>;
  putObjectTagging(input: PutObjectTaggingCommandInput): Promise<PutObjectTaggingCommandOutput>;
  upload(input: PutObjectCommandInput): Promise<CompleteMultipartUploadCommandOutput>;
}

export interface ISecretsManagerClient {
  getSecretValue(input: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput>;
}

export interface ISSMClient {
  getParameter(input: GetParameterCommandInput): Promise<GetParameterCommandOutput>;
}

export interface IStepFunctionsClient {
  updateStateMachine(input: UpdateStateMachineCommandInput): Promise<UpdateStateMachineCommandOutput>;
}

/**
 * Base functionality of SDK without credential fetching
 */
@traceMethods
export class SDK {
  private static readonly accountCache = new AccountAccessKeyCache();

  public readonly currentRegion: string;

  public readonly config: ConfigurationOptions;

  /**
   * STS is used to check credential validity, don't do too many retries.
   */
  private readonly stsRetryStrategy = new ConfiguredRetryStrategy(3, (attempt) => 100 * (2 ** attempt));

  /**
   * Whether we have proof that the credentials have not expired
   *
   * We need to do some manual plumbing around this because the JS SDKv2 treats `ExpiredToken`
   * as retriable and we have hefty retries on CFN calls making the CLI hang for a good 15 minutes
   * if the credentials have expired.
   */
  private _credentialsValidated = false;

  constructor(
    private readonly credProvider: AwsCredentialIdentityProvider,
    region: string,
    requestHandler: NodeHttpHandlerOptions,
    logger?: Logger,
  ) {
    this.config = {
      region,
      credentials: credProvider,
      requestHandler,
      retryStrategy: new ConfiguredRetryStrategy(7, (attempt) => 300 * (2 ** attempt)),
      customUserAgent: defaultCliUserAgent(),
      logger,
    };
    this.currentRegion = region;
  }

  public appendCustomUserAgent(userAgentData?: string): void {
    if (!userAgentData) {
      return;
    }

    const currentCustomUserAgent = this.config.customUserAgent;
    this.config.customUserAgent = currentCustomUserAgent ? `${currentCustomUserAgent} ${userAgentData}` : userAgentData;
  }

  public removeCustomUserAgent(userAgentData: string): void {
    this.config.customUserAgent = this.config.customUserAgent?.replace(userAgentData, '');
  }

  public appsync(): IAppSyncClient {
    const client = new AppSyncClient(this.config);
    return {
      getSchemaCreationStatus: (
        input: GetSchemaCreationStatusCommandInput,
      ): Promise<GetSchemaCreationStatusCommandOutput> => client.send(new GetSchemaCreationStatusCommand(input)),
      startSchemaCreation: (input: StartSchemaCreationCommandInput): Promise<StartSchemaCreationCommandOutput> =>
        client.send(new StartSchemaCreationCommand(input)),
      updateApiKey: (input: UpdateApiKeyCommandInput): Promise<UpdateApiKeyCommandOutput> =>
        client.send(new UpdateApiKeyCommand(input)),
      updateFunction: (input: UpdateFunctionCommandInput): Promise<UpdateFunctionCommandOutput> =>
        client.send(new UpdateFunctionCommand(input)),
      updateResolver: (input: UpdateResolverCommandInput): Promise<UpdateResolverCommandOutput> =>
        client.send(new UpdateResolverCommand(input)),

      // Pagination Functions
      listFunctions: async (input: ListFunctionsCommandInput): Promise<FunctionConfiguration[]> => {
        const functions = Array<FunctionConfiguration>();
        const paginator = paginateListFunctions({ client }, input);
        for await (const page of paginator) {
          functions.push(...(page.functions || []));
        }
        return functions;
      },
    };
  }

  public cloudFormation(): ICloudFormationClient {
    const client = new CloudFormationClient({
      ...this.config,
      retryStrategy: new ConfiguredRetryStrategy(11, (attempt: number) => 1000 * (2 ** attempt)),
    });
    return {
      continueUpdateRollback: async (
        input: ContinueUpdateRollbackCommandInput,
      ): Promise<ContinueUpdateRollbackCommandOutput> => client.send(new ContinueUpdateRollbackCommand(input)),
      createChangeSet: (input: CreateChangeSetCommandInput): Promise<CreateChangeSetCommandOutput> =>
        client.send(new CreateChangeSetCommand(input)),
      createGeneratedTemplate: (
        input: CreateGeneratedTemplateCommandInput,
      ): Promise<CreateGeneratedTemplateCommandOutput> => client.send(new CreateGeneratedTemplateCommand(input)),
      createStack: (input: CreateStackCommandInput): Promise<CreateStackCommandOutput> =>
        client.send(new CreateStackCommand(input)),
      deleteChangeSet: (input: DeleteChangeSetCommandInput): Promise<DeleteChangeSetCommandOutput> =>
        client.send(new DeleteChangeSetCommand(input)),
      deleteGeneratedTemplate: (
        input: DeleteGeneratedTemplateCommandInput,
      ): Promise<DeleteGeneratedTemplateCommandOutput> => client.send(new DeleteGeneratedTemplateCommand(input)),
      deleteStack: (input: DeleteStackCommandInput): Promise<DeleteStackCommandOutput> =>
        client.send(new DeleteStackCommand(input)),
      describeChangeSet: (input: DescribeChangeSetCommandInput): Promise<DescribeChangeSetCommandOutput> =>
        client.send(new DescribeChangeSetCommand(input)),
      describeGeneratedTemplate: (
        input: DescribeGeneratedTemplateCommandInput,
      ): Promise<DescribeGeneratedTemplateCommandOutput> => client.send(new DescribeGeneratedTemplateCommand(input)),
      describeResourceScan: (input: DescribeResourceScanCommandInput): Promise<DescribeResourceScanCommandOutput> =>
        client.send(new DescribeResourceScanCommand(input)),
      describeStacks: (input: DescribeStacksCommandInput): Promise<DescribeStacksCommandOutput> =>
        client.send(new DescribeStacksCommand(input)),
      describeStackResources: (input: DescribeStackResourcesCommandInput): Promise<DescribeStackResourcesCommandOutput> =>
        client.send(new DescribeStackResourcesCommand(input)),
      executeChangeSet: (input: ExecuteChangeSetCommandInput): Promise<ExecuteChangeSetCommandOutput> =>
        client.send(new ExecuteChangeSetCommand(input)),
      getGeneratedTemplate: (input: GetGeneratedTemplateCommandInput): Promise<GetGeneratedTemplateCommandOutput> =>
        client.send(new GetGeneratedTemplateCommand(input)),
      getTemplate: (input: GetTemplateCommandInput): Promise<GetTemplateCommandOutput> =>
        client.send(new GetTemplateCommand(input)),
      getTemplateSummary: (input: GetTemplateSummaryCommandInput): Promise<GetTemplateSummaryCommandOutput> =>
        client.send(new GetTemplateSummaryCommand(input)),
      listExports: (input: ListExportsCommandInput): Promise<ListExportsCommandOutput> =>
        client.send(new ListExportsCommand(input)),
      listResourceScanRelatedResources: (
        input: ListResourceScanRelatedResourcesCommandInput,
      ): Promise<ListResourceScanRelatedResourcesCommandOutput> =>
        client.send(new ListResourceScanRelatedResourcesCommand(input)),
      listResourceScanResources: (
        input: ListResourceScanResourcesCommandInput,
      ): Promise<ListResourceScanResourcesCommandOutput> => client.send(new ListResourceScanResourcesCommand(input)),
      listResourceScans: (input: ListResourceScansCommandInput): Promise<ListResourceScansCommandOutput> =>
        client.send(new ListResourceScansCommand(input)),
      listStacks: (input: ListStacksCommandInput): Promise<ListStacksCommandOutput> =>
        client.send(new ListStacksCommand(input)),
      rollbackStack: (input: RollbackStackCommandInput): Promise<RollbackStackCommandOutput> =>
        client.send(new RollbackStackCommand(input)),
      startResourceScan: (input: StartResourceScanCommandInput): Promise<StartResourceScanCommandOutput> =>
        client.send(new StartResourceScanCommand(input)),
      updateStack: (input: UpdateStackCommandInput): Promise<UpdateStackCommandOutput> =>
        client.send(new UpdateStackCommand(input)),
      updateTerminationProtection: (
        input: UpdateTerminationProtectionCommandInput,
      ): Promise<UpdateTerminationProtectionCommandOutput> =>
        client.send(new UpdateTerminationProtectionCommand(input)),
      describeStackEvents: (input: DescribeStackEventsCommandInput): Promise<DescribeStackEventsCommandOutput> => {
        return client.send(new DescribeStackEventsCommand(input));
      },
      listStackResources: async (input: ListStackResourcesCommandInput): Promise<StackResourceSummary[]> => {
        const stackResources = Array<StackResourceSummary>();
        const paginator = paginateListStackResources({ client }, input);
        for await (const page of paginator) {
          stackResources.push(...(page?.StackResourceSummaries || []));
        }
        return stackResources;
      },
    };
  }

  public cloudWatchLogs(): ICloudWatchLogsClient {
    const client = new CloudWatchLogsClient(this.config);
    return {
      describeLogGroups: (input: DescribeLogGroupsCommandInput): Promise<DescribeLogGroupsCommandOutput> =>
        client.send(new DescribeLogGroupsCommand(input)),
      filterLogEvents: (input: FilterLogEventsCommandInput): Promise<FilterLogEventsCommandOutput> =>
        client.send(new FilterLogEventsCommand(input)),
    };
  }

  public codeBuild(): ICodeBuildClient {
    const client = new CodeBuildClient(this.config);
    return {
      updateProject: (input: UpdateProjectCommandInput): Promise<UpdateProjectCommandOutput> =>
        client.send(new UpdateProjectCommand(input)),
    };
  }

  public ec2(): IEC2Client {
    const client = new EC2Client(this.config);
    return {
      describeAvailabilityZones: (
        input: DescribeAvailabilityZonesCommandInput,
      ): Promise<DescribeAvailabilityZonesCommandOutput> => client.send(new DescribeAvailabilityZonesCommand(input)),
      describeImages: (input: DescribeImagesCommandInput): Promise<DescribeImagesCommandOutput> =>
        client.send(new DescribeImagesCommand(input)),
      describeInstances: (input: DescribeInstancesCommandInput): Promise<DescribeInstancesCommandOutput> =>
        client.send(new DescribeInstancesCommand(input)),
      describeRouteTables: (input: DescribeRouteTablesCommandInput): Promise<DescribeRouteTablesCommandOutput> =>
        client.send(new DescribeRouteTablesCommand(input)),
      describeSecurityGroups: (
        input: DescribeSecurityGroupsCommandInput,
      ): Promise<DescribeSecurityGroupsCommandOutput> => client.send(new DescribeSecurityGroupsCommand(input)),
      describeSubnets: (input: DescribeSubnetsCommandInput): Promise<DescribeSubnetsCommandOutput> =>
        client.send(new DescribeSubnetsCommand(input)),
      describeVpcEndpointServices: (
        input: DescribeVpcEndpointServicesCommandInput,
      ): Promise<DescribeVpcEndpointServicesCommandOutput> =>
        client.send(new DescribeVpcEndpointServicesCommand(input)),
      describeVpcs: (input: DescribeVpcsCommandInput): Promise<DescribeVpcsCommandOutput> =>
        client.send(new DescribeVpcsCommand(input)),
      describeVpnGateways: (input: DescribeVpnGatewaysCommandInput): Promise<DescribeVpnGatewaysCommandOutput> =>
        client.send(new DescribeVpnGatewaysCommand(input)),
    };
  }

  public ecr(): IECRClient {
    const client = new ECRClient(this.config);
    return {
      batchDeleteImage: (input: BatchDeleteImageCommandInput): Promise<BatchDeleteImageCommandOutput> =>
        client.send(new BatchDeleteImageCommand(input)),
      batchGetImage: (input: BatchGetImageCommandInput): Promise<BatchGetImageCommandOutput> =>
        client.send(new BatchGetImageCommand(input)),
      createRepository: (input: CreateRepositoryCommandInput): Promise<CreateRepositoryCommandOutput> =>
        client.send(new CreateRepositoryCommand(input)),
      describeImages: (input: ECRDescribeImagesCommandInput): Promise<ECRDescribeImagesCommandOutput> =>
        client.send(new ECRDescribeImagesCommand(input)),
      describeRepositories: (input: DescribeRepositoriesCommandInput): Promise<DescribeRepositoriesCommandOutput> =>
        client.send(new DescribeRepositoriesCommand(input)),
      getAuthorizationToken: (input: GetAuthorizationTokenCommandInput): Promise<GetAuthorizationTokenCommandOutput> =>
        client.send(new GetAuthorizationTokenCommand(input)),
      listImages: (input: ListImagesCommandInput): Promise<ListImagesCommandOutput> =>
        client.send(new ListImagesCommand(input)),
      putImage: (input: PutImageCommandInput): Promise<PutImageCommandOutput> =>
        client.send(new PutImageCommand(input)),
      putImageScanningConfiguration: (
        input: PutImageScanningConfigurationCommandInput,
      ): Promise<PutImageScanningConfigurationCommandOutput> =>
        client.send(new PutImageScanningConfigurationCommand(input)),
    };
  }

  public ecs(): IECSClient {
    const client = new ECSClient(this.config);
    return {
      listClusters: (input: ListClustersCommandInput): Promise<ListClustersCommandOutput> =>
        client.send(new ListClustersCommand(input)),
      registerTaskDefinition: (
        input: RegisterTaskDefinitionCommandInput,
      ): Promise<RegisterTaskDefinitionCommandOutput> => client.send(new RegisterTaskDefinitionCommand(input)),
      updateService: (input: UpdateServiceCommandInput): Promise<UpdateServiceCommandOutput> =>
        client.send(new UpdateServiceCommand(input)),
      // Waiters
      waitUntilServicesStable: (input: DescribeServicesCommandInput): Promise<WaiterResult> => {
        return waitUntilServicesStable(
          {
            client,
            maxWaitTime: 600,
            minDelay: 6,
            maxDelay: 6,
          },
          input,
        );
      },
    };
  }

  public elbv2(): IElasticLoadBalancingV2Client {
    const client = new ElasticLoadBalancingV2Client(this.config);
    return {
      describeListeners: (input: DescribeListenersCommandInput): Promise<DescribeListenersCommandOutput> =>
        client.send(new DescribeListenersCommand(input)),
      describeLoadBalancers: (input: DescribeLoadBalancersCommandInput): Promise<DescribeLoadBalancersCommandOutput> =>
        client.send(new DescribeLoadBalancersCommand(input)),
      describeTags: (input: DescribeTagsCommandInput): Promise<DescribeTagsCommandOutput> =>
        client.send(new DescribeTagsCommand(input)),
      // Pagination Functions
      paginateDescribeListeners: async (input: DescribeListenersCommandInput): Promise<Listener[]> => {
        const listeners = Array<Listener>();
        const paginator = paginateDescribeListeners({ client }, input);
        for await (const page of paginator) {
          listeners.push(...(page?.Listeners || []));
        }
        return listeners;
      },
      paginateDescribeLoadBalancers: async (input: DescribeLoadBalancersCommandInput): Promise<LoadBalancer[]> => {
        const loadBalancers = Array<LoadBalancer>();
        const paginator = paginateDescribeLoadBalancers({ client }, input);
        for await (const page of paginator) {
          loadBalancers.push(...(page?.LoadBalancers || []));
        }
        return loadBalancers;
      },
    };
  }

  public iam(): IIAMClient {
    const client = new IAMClient(this.config);
    return {
      createPolicy: (input: CreatePolicyCommandInput): Promise<CreatePolicyCommandOutput> =>
        client.send(new CreatePolicyCommand(input)),
      getPolicy: (input: GetPolicyCommandInput): Promise<GetPolicyCommandOutput> =>
        client.send(new GetPolicyCommand(input)),
      getRole: (input: GetRoleCommandInput): Promise<GetRoleCommandOutput> => client.send(new GetRoleCommand(input)),
    };
  }

  public kms(): IKMSClient {
    const client = new KMSClient(this.config);
    return {
      describeKey: (input: DescribeKeyCommandInput): Promise<DescribeKeyCommandOutput> =>
        client.send(new DescribeKeyCommand(input)),
      listAliases: (input: ListAliasesCommandInput): Promise<ListAliasesCommandOutput> =>
        client.send(new ListAliasesCommand(input)),
    };
  }

  public lambda(): ILambdaClient {
    const client = new LambdaClient(this.config);
    return {
      invokeCommand: (input: InvokeCommandInput): Promise<InvokeCommandOutput> => client.send(new InvokeCommand(input)),
      publishVersion: (input: PublishVersionCommandInput): Promise<PublishVersionCommandOutput> =>
        client.send(new PublishVersionCommand(input)),
      updateAlias: (input: UpdateAliasCommandInput): Promise<UpdateAliasCommandOutput> =>
        client.send(new UpdateAliasCommand(input)),
      updateFunctionCode: (input: UpdateFunctionCodeCommandInput): Promise<UpdateFunctionCodeCommandOutput> =>
        client.send(new UpdateFunctionCodeCommand(input)),
      updateFunctionConfiguration: (
        input: UpdateFunctionConfigurationCommandInput,
      ): Promise<UpdateFunctionConfigurationCommandOutput> =>
        client.send(new UpdateFunctionConfigurationCommand(input)),
      // Waiters
      waitUntilFunctionUpdated: (
        delaySeconds: number,
        input: UpdateFunctionConfigurationCommandInput,
      ): Promise<WaiterResult> => {
        return waitUntilFunctionUpdatedV2(
          {
            client,
            maxDelay: delaySeconds,
            minDelay: delaySeconds,
            maxWaitTime: delaySeconds * 60,
          },
          input,
        );
      },
    };
  }

  public route53(): IRoute53Client {
    const client = new Route53Client(this.config);
    return {
      getHostedZone: (input: GetHostedZoneCommandInput): Promise<GetHostedZoneCommandOutput> =>
        client.send(new GetHostedZoneCommand(input)),
      listHostedZones: (input: ListHostedZonesCommandInput): Promise<ListHostedZonesCommandOutput> =>
        client.send(new ListHostedZonesCommand(input)),
      listHostedZonesByName: (input: ListHostedZonesByNameCommandInput): Promise<ListHostedZonesByNameCommandOutput> =>
        client.send(new ListHostedZonesByNameCommand(input)),
    };
  }

  public s3(): IS3Client {
    const client = new S3Client(this.config);
    return {
      deleteObjects: (input: DeleteObjectsCommandInput): Promise<DeleteObjectsCommandOutput> =>
        client.send(new DeleteObjectsCommand({
          ...input,
          ChecksumAlgorithm: 'SHA256',
        })),
      deleteObjectTagging: (input: DeleteObjectTaggingCommandInput): Promise<DeleteObjectTaggingCommandOutput> =>
        client.send(new DeleteObjectTaggingCommand(input)),
      getBucketEncryption: (input: GetBucketEncryptionCommandInput): Promise<GetBucketEncryptionCommandOutput> =>
        client.send(new GetBucketEncryptionCommand(input)),
      getBucketLocation: (input: GetBucketLocationCommandInput): Promise<GetBucketLocationCommandOutput> =>
        client.send(new GetBucketLocationCommand(input)),
      getObject: (input: GetObjectCommandInput): Promise<GetObjectCommandOutput> =>
        client.send(new GetObjectCommand(input)),
      getObjectTagging: (input: GetObjectTaggingCommandInput): Promise<GetObjectTaggingCommandOutput> =>
        client.send(new GetObjectTaggingCommand(input)),
      listObjectsV2: (input: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput> =>
        client.send(new ListObjectsV2Command(input)),
      putObjectTagging: (input: PutObjectTaggingCommandInput): Promise<PutObjectTaggingCommandOutput> =>
        client.send(new PutObjectTaggingCommand({
          ...input,
          ChecksumAlgorithm: 'SHA256',
        })),
      upload: (input: PutObjectCommandInput): Promise<CompleteMultipartUploadCommandOutput> => {
        try {
          const upload = new Upload({
            client,
            params: { ...input, ChecksumAlgorithm: 'SHA256' },
          });

          return upload.done();
        } catch (e: any) {
          throw new AuthenticationError(`Upload failed: ${e.message}`);
        }
      },
    };
  }

  public secretsManager(): ISecretsManagerClient {
    const client = new SecretsManagerClient(this.config);
    return {
      getSecretValue: (input: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput> =>
        client.send(new GetSecretValueCommand(input)),
    };
  }

  public ssm(): ISSMClient {
    const client = new SSMClient(this.config);
    return {
      getParameter: (input: GetParameterCommandInput): Promise<GetParameterCommandOutput> =>
        client.send(new GetParameterCommand(input)),
    };
  }

  public stepFunctions(): IStepFunctionsClient {
    const client = new SFNClient(this.config);
    return {
      updateStateMachine: (input: UpdateStateMachineCommandInput): Promise<UpdateStateMachineCommandOutput> =>
        client.send(new UpdateStateMachineCommand(input)),
    };
  }

  /**
   * The AWS SDK v3 requires a client config and a command in order to get an endpoint for
   * any given service.
   */
  public async getUrlSuffix(region: string): Promise<string> {
    const cfn = new CloudFormationClient({ region });
    const endpoint = await getEndpointFromInstructions({}, DescribeStackResourcesCommand, { ...cfn.config });
    return endpoint.url.hostname.split(`${region}.`).pop()!;
  }

  public async currentAccount(): Promise<Account> {
    return cachedAsync(this, CURRENT_ACCOUNT_KEY, async () => {
      const creds = await this.credProvider();
      return SDK.accountCache.fetch(creds.accessKeyId, async () => {
        // if we don't have one, resolve from STS and store in cache.
        debug('Looking up default account ID from STS');
        const client = new STSClient({
          ...this.config,
          retryStrategy: this.stsRetryStrategy,
        });
        const command = new GetCallerIdentityCommand({});
        const result = await client.send(command);
        const accountId = result.Account;
        const partition = result.Arn!.split(':')[1];
        if (!accountId) {
          throw new AuthenticationError("STS didn't return an account ID");
        }
        debug('Default account ID:', accountId);

        // Save another STS call later if this one already succeeded
        this._credentialsValidated = true;
        return { accountId, partition };
      });
    });
  }

  /**
   * Make sure the the current credentials are not expired
   */
  public async validateCredentials() {
    if (this._credentialsValidated) {
      return;
    }

    const client = new STSClient({ ...this.config, retryStrategy: this.stsRetryStrategy });
    await client.send(new GetCallerIdentityCommand({}));
    this._credentialsValidated = true;
  }
}

const CURRENT_ACCOUNT_KEY = Symbol('current_account_key');
