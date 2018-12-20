
# CloudFormation Resource Specification v2.18.0

## New Resource Types

* AWS::AmazonMQ::ConfigurationAssociation
* AWS::IoTAnalytics::Channel
* AWS::IoTAnalytics::Dataset
* AWS::IoTAnalytics::Datastore
* AWS::IoTAnalytics::Pipeline

## Attribute Changes

* AWS::AmazonMQ::Broker BrokerId (__deleted__)
* AWS::AmazonMQ::Broker AmqpEndpoints (__added__)
* AWS::AmazonMQ::Broker Arn (__added__)
* AWS::AmazonMQ::Broker ConfigurationId (__added__)
* AWS::AmazonMQ::Broker ConfigurationRevision (__added__)
* AWS::AmazonMQ::Broker IpAddresses (__added__)
* AWS::AmazonMQ::Broker MqttEndpoints (__added__)
* AWS::AmazonMQ::Broker OpenWireEndpoints (__added__)
* AWS::AmazonMQ::Broker StompEndpoints (__added__)
* AWS::AmazonMQ::Broker WssEndpoints (__added__)

## Property Changes

* AWS::SageMaker::Model Containers (__added__)
* AWS::SageMaker::Model PrimaryContainer.Required (__changed__)
  * Old: true
  * New: false
* AWS::ServiceDiscovery::Instance InstanceAttributes.PrimitiveType (__changed__)
  * Old: Json
  * New: Map

## Property Type Changes

* AWS::SageMaker::EndpointConfig.ProductionVariant AcceleratorType (__added__)


# CloudFormation Resource Specification v2.16.0

## New Resource Types

* AWS::AppSync::FunctionConfiguration
* AWS::CloudFormation::Macro
* AWS::EC2::EC2Fleet
* AWS::EC2::TransitGateway
* AWS::EC2::TransitGatewayAttachment
* AWS::EC2::TransitGatewayRoute
* AWS::EC2::TransitGatewayRouteTable
* AWS::EC2::TransitGatewayRouteTableAssociation
* AWS::EC2::TransitGatewayRouteTablePropagation
* AWS::Kinesis::StreamConsumer
* AWS::Route53Resolver::ResolverEndpoint
* AWS::Route53Resolver::ResolverRule
* AWS::ServiceDiscovery::HttpNamespace
* Alexa::ASK::Skill

## Attribute Changes


## Property Changes

* AWS::ApiGateway::Stage Tags (__added__)
* AWS::AutoScaling::AutoScalingGroup MixedInstancesPolicy (__added__)
* AWS::Batch::JobDefinition NodeProperties (__added__)
* AWS::Batch::JobDefinition ContainerProperties.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudWatch::Alarm MetricName.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudWatch::Alarm Namespace.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudWatch::Alarm Period.Required (__changed__)
  * Old: true
  * New: false
* AWS::DynamoDB::Table BillingMode (__added__)
* AWS::DynamoDB::Table ProvisionedThroughput.Required (__changed__)
  * Old: true
  * New: false
* AWS::EC2::EIP PublicIpv4Pool (__added__)
* AWS::EC2::Instance ElasticInferenceAccelerators (__added__)
* AWS::EC2::Instance LicenseSpecifications (__added__)
* AWS::EMR::Cluster Steps (__added__)
* AWS::IoT1Click::Placement PlacementName.Required (__changed__)
  * Old: true
  * New: false
* AWS::IoT1Click::Project ProjectName.Required (__changed__)
  * Old: true
  * New: false
* AWS::Lambda::Function Layers (__added__)
* AWS::RDS::DBCluster DeletionProtection (__added__)
* AWS::RDS::DBInstance DeleteAutomatedBackups (__added__)
* AWS::RDS::DBInstance DeletionProtection (__added__)
* AWS::S3::Bucket PublicAccessBlockConfiguration (__added__)
* AWS::SNS::Topic KmsMasterKeyId (__added__)

## Property Type Changes

* AWS::AutoScaling::AutoScalingGroup.InstancesDistribution (__added__)
* AWS::AutoScaling::AutoScalingGroup.LaunchTemplate (__added__)
* AWS::AutoScaling::AutoScalingGroup.LaunchTemplateOverrides (__added__)
* AWS::AutoScaling::AutoScalingGroup.MixedInstancesPolicy (__added__)
* AWS::Batch::ComputeEnvironment.LaunchTemplateSpecification (__added__)
* AWS::Batch::JobDefinition.NodeProperties (__added__)
* AWS::Batch::JobDefinition.NodeRangeProperty (__added__)
* AWS::EC2::Instance.ElasticInferenceAccelerator (__added__)
* AWS::EC2::Instance.LicenseSpecification (__added__)
* AWS::EMR::Cluster.HadoopJarStepConfig (__added__)
* AWS::EMR::Cluster.KeyValue (__added__)
* AWS::EMR::Cluster.StepConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.AuthenticateCognitoConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.AuthenticateOidcConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.FixedResponseConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.RedirectConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateCognitoConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateOidcConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.FixedResponseConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.RedirectConfig (__added__)
* AWS::S3::Bucket.PublicAccessBlockConfiguration (__added__)
* AWS::ApiGateway::Deployment.StageDescription Tags (__added__)
* AWS::Batch::ComputeEnvironment.ComputeResources LaunchTemplate (__added__)
* AWS::Batch::ComputeEnvironment.ComputeResources PlacementGroup (__added__)
* AWS::Batch::JobDefinition.ContainerProperties InstanceType (__added__)
* AWS::DynamoDB::Table.GlobalSecondaryIndex ProvisionedThroughput.Required (__changed__)
  * Old: true
  * New: false
* AWS::EMR::Cluster.JobFlowInstancesConfig KeepJobFlowAliveWhenNoSteps (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action AuthenticateCognitoConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action AuthenticateOidcConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action FixedResponseConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action Order (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action RedirectConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action TargetGroupArn.Required (__changed__)
  * Old: true
  * New: false
* AWS::ElasticLoadBalancingV2::ListenerRule.Action AuthenticateCognitoConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action AuthenticateOidcConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action FixedResponseConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action Order (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action RedirectConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action TargetGroupArn.Required (__changed__)
  * Old: true
  * New: false




# CloudFormation Resource Specification v2.13.0

## New Resource Types

* AWS::DLM::LifecyclePolicy
* AWS::SecretsManager::ResourcePolicy
* AWS::SecretsManager::RotationSchedule
* AWS::SecretsManager::Secret
* AWS::SecretsManager::SecretTargetAttachment

## Attribute Changes

* AWS::AutoScalingPlans::ScalingPlan ScalingPlanName (__added__)
* AWS::AutoScalingPlans::ScalingPlan ScalingPlanVersion (__added__)
* AWS::S3::Bucket RegionalDomainName (__added__)

## Property Changes

* AWS::ApiGateway::Stage TracingEnabled (__added__)
* AWS::AppSync::DataSource RelationalDatabaseConfig (__added__)
* AWS::AppSync::Resolver Kind (__added__)
* AWS::AppSync::Resolver PipelineConfig (__added__)
* AWS::AppSync::Resolver DataSourceName.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudFormation::WaitCondition Handle.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudFormation::WaitCondition Timeout.Required (__changed__)
  * Old: true
  * New: false
* AWS::CloudWatch::Alarm DatapointsToAlarm (__added__)
* AWS::CodeBuild::Project QueuedTimeoutInMinutes (__added__)
* AWS::CodePipeline::Pipeline ArtifactStores (__added__)
* AWS::CodePipeline::Pipeline ArtifactStore.Required (__changed__)
  * Old: true
  * New: false
* AWS::EC2::SecurityGroupIngress SourcePrefixListId (__added__)
* AWS::IAM::Role PermissionsBoundary (__added__)
* AWS::IAM::User PermissionsBoundary (__added__)
* AWS::KMS::Key PendingWindowInDays (__added__)
* AWS::RDS::DBCluster BacktrackWindow (__added__)
* AWS::RDS::DBCluster EnableCloudwatchLogsExports (__added__)
* AWS::RDS::DBCluster EnableIAMDatabaseAuthentication (__added__)
* AWS::RDS::DBInstance EnableCloudwatchLogsExports (__added__)
* AWS::RDS::DBInstance EnableIAMDatabaseAuthentication (__added__)
* AWS::RDS::DBInstance EnablePerformanceInsights (__added__)
* AWS::RDS::DBInstance PerformanceInsightsKMSKeyId (__added__)
* AWS::RDS::DBInstance PerformanceInsightsRetentionPeriod (__added__)
* AWS::RDS::DBInstance ProcessorFeatures (__added__)
* AWS::RDS::DBInstance PromotionTier (__added__)
* AWS::Route53::RecordSet MultiValueAnswer (__added__)
* AWS::SageMaker::NotebookInstance VolumeSizeInGB (__added__)
* AWS::ServiceDiscovery::Service NamespaceId (__added__)
* AWS::ServiceDiscovery::Service DnsConfig.Required (__changed__)
  * Old: true
  * New: false
* AWS::WorkSpaces::Workspace Tags (__added__)
* AWS::WorkSpaces::Workspace WorkspaceProperties (__added__)

## Property Type Changes

* AWS::AppSync::DataSource.AuthorizationConfig (__added__)
* AWS::AppSync::DataSource.AwsIamConfig (__added__)
* AWS::AppSync::DataSource.RdsHttpEndpointConfig (__added__)
* AWS::AppSync::DataSource.RelationalDatabaseConfig (__added__)
* AWS::AppSync::Resolver.PipelineConfig (__added__)
* AWS::AutoScalingPlans::ScalingPlan.CustomizedLoadMetricSpecification (__added__)
* AWS::AutoScalingPlans::ScalingPlan.PredefinedLoadMetricSpecification (__added__)
* AWS::CodePipeline::Pipeline.ArtifactStoreMap (__added__)
* AWS::IoT::TopicRule.IotAnalyticsAction (__added__)
* AWS::IoT::TopicRule.StepFunctionsAction (__added__)
* AWS::RDS::DBInstance.ProcessorFeature (__added__)
* AWS::WorkSpaces::Workspace.WorkspaceProperties (__added__)
* AWS::ApiGateway::Deployment.StageDescription TracingEnabled (__added__)
* AWS::AppSync::DataSource.HttpConfig AuthorizationConfig (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction CustomizedLoadMetricSpecification (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction DisableDynamicScaling (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction PredefinedLoadMetricSpecification (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction PredictiveScalingMaxCapacityBehavior (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction PredictiveScalingMaxCapacityBuffer (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction PredictiveScalingMode (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction ScalingPolicyUpdateBehavior (__added__)
* AWS::AutoScalingPlans::ScalingPlan.ScalingInstruction ScheduledActionBufferTime (__added__)
* AWS::CodePipeline::Pipeline.ActionDeclaration Region (__added__)
* AWS::EC2::SecurityGroup.Ingress SourcePrefixListId (__added__)
* AWS::EC2::SpotFleet.SpotFleetTagSpecification Tags (__added__)
* AWS::IoT::TopicRule.Action IotAnalytics (__added__)
* AWS::IoT::TopicRule.Action StepFunctions (__added__)
* AWS::IoT::TopicRule.TopicRulePayload ErrorAction (__added__)
* AWS::OpsWorks::Layer.VolumeConfiguration Encrypted (__added__)
* AWS::RDS::DBCluster.ScalingConfiguration SecondsBeforeAutoPause (__deleted__)
* AWS::RDS::DBCluster.ScalingConfiguration SecondsUntilAutoPause (__added__)
* AWS::Route53::RecordSetGroup.RecordSet MultiValueAnswer (__added__)
* AWS::ServiceDiscovery::Service.DnsConfig NamespaceId.Required (__changed__)
  * Old: true
  * New: false
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
* Tag Key.Required (__changed__)
  * Old: false
  * New: true
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
* Tag Value.Required (__changed__)
  * Old: false
  * New: true

