import { Linter } from '../linter';

// List of grant methods that already existed prior to this lint rule being created
const exemptions: Record<string, Array<string>> = {
  '@aws-cdk/aws-apprunner-alpha.Secret': ['grantRead'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.BrowserCustomBase': ['grantRead', 'grantUse'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.CodeInterpreterCustomBase': ['grantInvoke', 'grantRead', 'grantUse'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.GatewayBase': ['grantInvoke', 'grantManage', 'grantRead'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.GatewayTarget': ['grantSync'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.GatewayTargetBase': ['grantManage', 'grantRead'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.ManagedMemoryStrategy': ['grant'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.MemoryBase': ['grantAdmin', 'grantDelete', 'grantDeleteLongTermMemory', 'grantDeleteShortTermMemory', 'grantFullAccess', 'grantRead', 'grantReadLongTermMemory', 'grantReadShortTermMemory', 'grantWrite'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.RuntimeBase': ['grantInvoke', 'grantInvokeRuntime', 'grantInvokeRuntimeForUser'],
  '@aws-cdk/aws-bedrock-agentcore-alpha.SelfManagedMemoryStrategy': ['grant'],
  '@aws-cdk/aws-bedrock-alpha.AgentAliasBase': ['grantGet', 'grantInvoke'],
  '@aws-cdk/aws-bedrock-alpha.AgentBase': ['grantInvoke'],
  '@aws-cdk/aws-bedrock-alpha.AgentCollaborator': ['grant'],
  '@aws-cdk/aws-bedrock-alpha.ApplicationInferenceProfile': ['grantInvoke', 'grantProfileUsage'],
  '@aws-cdk/aws-bedrock-alpha.BedrockFoundationModel': ['grantInvoke', 'grantInvokeAllRegions'],
  '@aws-cdk/aws-bedrock-alpha.CrossRegionInferenceProfile': ['grantInvoke', 'grantProfileUsage'],
  '@aws-cdk/aws-bedrock-alpha.GuardrailBase': ['grantApply'],
  '@aws-cdk/aws-bedrock-alpha.InferenceProfileBase': ['grantProfileUsage'],
  '@aws-cdk/aws-bedrock-alpha.PromptBase': ['grantGet'],
  '@aws-cdk/aws-bedrock-alpha.PromptRouter': ['grantInvoke'],
  '@aws-cdk/aws-elasticache-alpha.IamUser': ['grantConnect'],
  '@aws-cdk/aws-elasticache-alpha.ServerlessCacheBase': ['grantConnect'],
  '@aws-cdk/aws-glue-alpha.ExternalTable': ['grantRead', 'grantReadWrite', 'grantWrite'],
  '@aws-cdk/aws-glue-alpha.S3Table': ['grantRead', 'grantReadWrite', 'grantWrite'],
  '@aws-cdk/aws-glue-alpha.TableBase': ['grantRead', 'grantReadWrite', 'grantWrite'],
  '@aws-cdk/aws-imagebuilder-alpha.Component': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.ContainerRecipeBase': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.DistributionConfiguration': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.Image': ['grantDefaultExecutionRolePermissions', 'grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.ImagePipeline': ['grantDefaultExecutionRolePermissions', 'grantRead', 'grantStartExecution'],
  '@aws-cdk/aws-imagebuilder-alpha.ImageRecipe': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.InfrastructureConfiguration': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.LifecyclePolicy': ['grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.S3ComponentData': ['grantPut', 'grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.S3DockerfileData': ['grantPut', 'grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.S3WorkflowData': ['grantPut', 'grantRead'],
  '@aws-cdk/aws-imagebuilder-alpha.Workflow': ['grantRead'],
  '@aws-cdk/aws-iotevents-alpha.Input': ['grantWrite'],
  '@aws-cdk/aws-location-alpha.GeofenceCollection': ['grantRead'],
  '@aws-cdk/aws-location-alpha.Map': ['grantRendering'],
  '@aws-cdk/aws-location-alpha.PlaceIndex': ['grantSearch'],
  '@aws-cdk/aws-location-alpha.RouteCalculator': ['grantRead'],
  '@aws-cdk/aws-location-alpha.Tracker': ['grantRead', 'grantUpdateDevicePositions'],
  '@aws-cdk/aws-neptune-alpha.DatabaseClusterBase': ['grantConnect'],
  '@aws-cdk/aws-sagemaker-alpha.Endpoint': ['grantInvoke'],
  '@aws-cdk/aws-s3tables-alpha.Table': ['grantRead', 'grantReadWrite', 'grantWrite'],
  '@aws-cdk/example-construct-library.ExampleResource': ['grantRead'],
  'aws-cdk-lib.aws_apigateway.ApiKey': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_apigateway.Method': ['grantExecute'],
  'aws-cdk-lib.aws_apigateway.RateLimitedApiKey': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_apigatewayv2.ApiKey': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_apigatewayv2.RateLimitedApiKey': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_apigatewayv2.WebSocketApi': ['grantManageConnections'],
  'aws-cdk-lib.aws_apigatewayv2.WebSocketStage': ['grantManagementApiAccess'],
  'aws-cdk-lib.aws_appconfig.Environment': ['grantReadConfig'],
  'aws-cdk-lib.aws_appmesh.VirtualGateway': ['grantStreamAggregatedResources'],
  'aws-cdk-lib.aws_appmesh.VirtualNode': ['grantStreamAggregatedResources'],
  'aws-cdk-lib.aws_appsync.ChannelNamespace': ['grantPublish', 'grantPublishAndSubscribe', 'grantSubscribe'],
  'aws-cdk-lib.aws_appsync.EventApiBase': ['grantConnect', 'grantPublish', 'grantPublishAndSubscribe', 'grantSubscribe'],
  'aws-cdk-lib.aws_batch.Secret': ['grantRead'],
  'aws-cdk-lib.aws_cloudfront.CloudFrontWebDistribution': ['grantCreateInvalidation'],
  'aws-cdk-lib.aws_cloudfront.Distribution': ['grantCreateInvalidation'],
  'aws-cdk-lib.aws_cloudfront.experimental.EdgeFunction': ['grantInvoke', 'grantInvokeLatestVersion', 'grantInvokeUrl'],
  'aws-cdk-lib.aws_codebuild.ReportGroup': ['grantWrite'],
  'aws-cdk-lib.aws_codecommit.Repository': ['grantPull', 'grantPullPush', 'grantRead'],
  'aws-cdk-lib.aws_codedeploy.LambdaDeploymentGroup': ['grantPutLifecycleEventHookExecutionStatus'],
  'aws-cdk-lib.aws_codeguruprofiler.ProfilingGroup': ['grantPublish', 'grantRead'],
  'aws-cdk-lib.aws_codepipeline_actions.ManualApprovalAction': ['grantManualApproval'],
  'aws-cdk-lib.aws_dynamodb.TableBase': ['grantFullAccess', 'grantReadData', 'grantReadWriteData', 'grantStreamRead', 'grantTableListStreams', 'grantWriteData'],
  'aws-cdk-lib.aws_dynamodb.TableBaseV2': ['grantFullAccess', 'grantReadData', 'grantReadWriteData', 'grantStreamRead', 'grantTableListStreams', 'grantWriteData'],
  'aws-cdk-lib.aws_ecr.RepositoryBase': ['grantPull', 'grantPullPush', 'grantPush', 'grantRead'],
  'aws-cdk-lib.aws_ecs.Cluster': ['grantTaskProtection'],
  'aws-cdk-lib.aws_ecs.Secret': ['grantRead'],
  'aws-cdk-lib.aws_ecs.TaskDefinition': ['grantRun'],
  'aws-cdk-lib.aws_efs.FileSystem': ['grantRead', 'grantReadWrite', 'grantRootAccess'],
  'aws-cdk-lib.aws_elasticsearch.Domain': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_kinesis.Stream': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_kinesis.StreamConsumer': ['grantRead'],
  'aws-cdk-lib.aws_kinesisfirehose.DeliveryStream': ['grantPutRecords'],
  'aws-cdk-lib.aws_kinesisfirehose.KinesisStreamSource': ['grantRead'],
  'aws-cdk-lib.aws_kms.Alias': ['grantDecrypt', 'grantEncrypt', 'grantEncryptDecrypt', 'grantGenerateMac', 'grantSign', 'grantSignVerify', 'grantVerify', 'grantVerifyMac'],
  'aws-cdk-lib.aws_kms.Key': ['grantAdmin', 'grantDecrypt', 'grantEncrypt', 'grantEncryptDecrypt', 'grantGenerateMac', 'grantSign', 'grantSignVerify', 'grantVerify', 'grantVerifyMac'],
  'aws-cdk-lib.aws_lambda.FunctionBase': ['grantInvoke', 'grantInvokeLatestVersion', 'grantInvokeUrl'],
  'aws-cdk-lib.aws_lambda.FunctionUrl': ['grantInvokeUrl'],
  'aws-cdk-lib.aws_logs.LogGroup': ['grantRead', 'grantWrite'],
  'aws-cdk-lib.aws_opensearchservice.Domain': ['grantRead', 'grantReadWrite', 'grantWrite'],
  'aws-cdk-lib.aws_rds.DatabaseClusterBase': ['grantDataApiAccess'],
  'aws-cdk-lib.aws_rds.ServerlessCluster': ['grantDataApiAccess'],
  'aws-cdk-lib.aws_rds.ServerlessClusterFromSnapshot': ['grantDataApiAccess'],
  'aws-cdk-lib.aws_s3_assets.Asset': ['grantRead'],
  'aws-cdk-lib.aws_scheduler.ScheduleGroup': ['grantDeleteSchedules', 'grantReadSchedules', 'grantWriteSchedules'],
  'aws-cdk-lib.aws_secretsmanager.Secret': ['grantWrite'],
  'aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment': ['grantWrite'],
  'aws-cdk-lib.aws_ses.EmailIdentity': ['grantSendEmail'],
  'aws-cdk-lib.aws_sns.TopicBase': ['grantPublish', 'grantSubscribe'],
  'aws-cdk-lib.aws_sqs.QueueBase': ['grantConsumeMessages', 'grantPurge', 'grantSendMessages'],
  'aws-cdk-lib.aws_ssm.StringListParameter': ['grantRead', 'grantWrite'],
  'aws-cdk-lib.aws_ssm.StringParameter': ['grantRead', 'grantWrite'],
  'aws-cdk-lib.aws_stepfunctions.StateMachine': ['grantRead', 'grantRedriveExecution', 'grantStartExecution', 'grantStartSyncExecution', 'grantTaskResponse'],
  'aws-cdk-lib.custom_resources.WaiterStateMachine': ['grantStartExecution'],
};

export const grantsMethodsLinter = new Linter(assembly => assembly.allClasses);

grantsMethodsLinter.add({
  code: 'no-grants',
  message: 'L2 constructs are not allowed to have new "grantXxx()" methods. Create or re-use a companion <Contruct>Grants class instead.',
  eval: e => {
    const grants = Object.values(e.ctx.getMethods())
      .filter(m => !m.static)
      .filter(m => m.name.startsWith('grant'))
      .filter(m => m.parameters.length === 1 && m.parameters[0].type.fqn === 'aws-cdk-lib.aws_iam.IGrantable')
      .map(m => m.name);

    grants.forEach((grant) => {
      e.assert(isExempted(e.ctx.fqn, grant), `${e.ctx.fqn}.${grant}`);
    });
  },
});

function isExempted(classFqn: string, methodName: string): boolean {
  const exemptedMethods = exemptions[classFqn];
  return exemptedMethods ? exemptedMethods.includes(methodName) : false;
}
