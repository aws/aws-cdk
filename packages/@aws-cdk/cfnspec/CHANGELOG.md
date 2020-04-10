# CloudFormation Resource Specification v12.2.0

## New Resource Types

* AWS::Detective::Graph
* AWS::Detective::MemberInvitation

## Attribute Changes


## Property Changes

* AWS::CloudWatch::InsightRule Tags (__added__)
* AWS::CodeBuild::ReportGroup Tags (__added__)
* AWS::FSx::FileSystem StorageType (__added__)
* AWS::KinesisAnalyticsV2::Application Tags (__added__)
* AWS::StepFunctions::StateMachine TracingConfiguration (__added__)

## Property Type Changes

* AWS::EC2::EC2Fleet.TagRequest (__removed__)
* AWS::CloudWatch::InsightRule.Tags (__added__)
* AWS::EC2::EC2Fleet.CapacityReservationOptionsRequest (__added__)
* AWS::EC2::EC2Fleet.Placement (__added__)
* AWS::StepFunctions::StateMachine.TracingConfiguration (__added__)
* AWS::Batch::JobDefinition.ContainerProperties Memory.Required (__changed__)
  * Old: true
  * New: false
* AWS::Batch::JobDefinition.ContainerProperties Vcpus.Required (__changed__)
  * Old: true
  * New: false
* AWS::EC2::EC2Fleet.FleetLaunchTemplateConfigRequest LaunchTemplateSpecification.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateConfigRequest Overrides.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest Placement (__added__)
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest AvailabilityZone.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest InstanceType.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest MaxPrice.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest Priority.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest SubnetId.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateOverridesRequest WeightedCapacity.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateSpecificationRequest LaunchTemplateId.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateSpecificationRequest LaunchTemplateName.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.FleetLaunchTemplateSpecificationRequest Version.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest CapacityReservationOptions (__added__)
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest MaxTotalPrice (__added__)
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest MinTargetCapacity (__added__)
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest SingleAvailabilityZone (__added__)
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest SingleInstanceType (__added__)
* AWS::EC2::EC2Fleet.OnDemandOptionsRequest AllocationStrategy.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.SpotOptionsRequest MaxTotalPrice (__added__)
* AWS::EC2::EC2Fleet.SpotOptionsRequest MinTargetCapacity (__added__)
* AWS::EC2::EC2Fleet.SpotOptionsRequest SingleAvailabilityZone (__added__)
* AWS::EC2::EC2Fleet.SpotOptionsRequest SingleInstanceType (__added__)
* AWS::EC2::EC2Fleet.SpotOptionsRequest AllocationStrategy.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.SpotOptionsRequest InstanceInterruptionBehavior.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.SpotOptionsRequest InstancePoolsToUseCount.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.TagSpecification ResourceType.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::EC2::EC2Fleet.TagSpecification Tags.ItemType (__changed__)
  * Old: TagRequest
  * New: Tag
* AWS::EC2::EC2Fleet.TagSpecification Tags.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::IoTEvents::DetectorModel.SetTimer DurationExpression (__added__)


# CloudFormation Resource Specification v12.0.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::ApiGatewayV2::Integration ConnectionId (__added__)
* AWS::AutoScaling::AutoScalingGroup MaxInstanceLifetime (__added__)
* AWS::EC2::Volume MultiAttachEnabled (__added__)

## Property Type Changes

* AWS::IoT::TopicRule.AssetPropertyTimestamp (__added__)
* AWS::IoT::TopicRule.AssetPropertyValue (__added__)
* AWS::IoT::TopicRule.AssetPropertyVariant (__added__)
* AWS::IoT::TopicRule.HttpAction (__added__)
* AWS::IoT::TopicRule.HttpActionHeader (__added__)
* AWS::IoT::TopicRule.HttpAuthorization (__added__)
* AWS::IoT::TopicRule.IotEventsAction (__added__)
* AWS::IoT::TopicRule.IotSiteWiseAction (__added__)
* AWS::IoT::TopicRule.PutAssetPropertyValueEntry (__added__)
* AWS::IoT::TopicRule.SigV4Authorization (__added__)
* AWS::IoT::TopicRule.Action Http (__added__)
* AWS::IoT::TopicRule.Action IotEvents (__added__)
* AWS::IoT::TopicRule.Action IotSiteWise (__added__)
* AWS::IoT::TopicRule.RepublishAction Qos (__added__)


# CloudFormation Resource Specification v11.6.0

## New Resource Types

* AWS::Cassandra::Keyspace
* AWS::Cassandra::Table
* AWS::CodeGuruProfiler::ProfilingGroup
* AWS::NetworkManager::CustomerGatewayAssociation
* AWS::NetworkManager::Device
* AWS::NetworkManager::GlobalNetwork
* AWS::NetworkManager::Link
* AWS::NetworkManager::LinkAssociation
* AWS::NetworkManager::Site
* AWS::NetworkManager::TransitGatewayRegistration
* AWS::ResourceGroups::Group

## Attribute Changes

* AWS::AppMesh::Mesh MeshOwner.PrimitiveType (__added__)
* AWS::AppMesh::Mesh ResourceOwner.PrimitiveType (__added__)
* AWS::AppMesh::Route MeshOwner.PrimitiveType (__added__)
* AWS::AppMesh::Route ResourceOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualNode MeshOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualNode ResourceOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualRouter MeshOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualRouter ResourceOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualService MeshOwner.PrimitiveType (__added__)
* AWS::AppMesh::VirtualService ResourceOwner.PrimitiveType (__added__)

## Property Changes

* AWS::ApiGatewayV2::Integration TlsConfig (__added__)
* AWS::AppMesh::Route MeshOwner (__added__)
* AWS::AppMesh::VirtualNode MeshOwner (__added__)
* AWS::AppMesh::VirtualRouter MeshOwner (__added__)
* AWS::AppMesh::VirtualService MeshOwner (__added__)
* AWS::DMS::Endpoint KafkaSettings (__added__)
* AWS::EC2::ClientVpnEndpoint SecurityGroupIds (__added__)
* AWS::EC2::ClientVpnEndpoint VpcId (__added__)
* AWS::MSK::Cluster LoggingInfo (__added__)
* AWS::ServiceCatalog::LaunchRoleConstraint LocalRoleName (__added__)
* AWS::ServiceCatalog::LaunchRoleConstraint RoleArn.Required (__changed__)
  * Old: true
  * New: false

## Property Type Changes

* AWS::ApiGatewayV2::Integration.TlsConfig (__added__)
* AWS::CloudFront::Distribution.OriginGroup (__added__)
* AWS::CloudFront::Distribution.OriginGroupFailoverCriteria (__added__)
* AWS::CloudFront::Distribution.OriginGroupMember (__added__)
* AWS::CloudFront::Distribution.OriginGroupMembers (__added__)
* AWS::CloudFront::Distribution.OriginGroups (__added__)
* AWS::CloudFront::Distribution.StatusCodes (__added__)
* AWS::DMS::Endpoint.KafkaSettings (__added__)
* AWS::MSK::Cluster.BrokerLogs (__added__)
* AWS::MSK::Cluster.CloudWatchLogs (__added__)
* AWS::MSK::Cluster.Firehose (__added__)
* AWS::MSK::Cluster.LoggingInfo (__added__)
* AWS::MSK::Cluster.S3 (__added__)
* AWS::CloudFront::Distribution.DistributionConfig OriginGroups (__added__)
* AWS::CloudFront::Distribution.LambdaFunctionAssociation IncludeBody (__added__)


# CloudFormation Resource Specification v11.4.0

## New Resource Types

* AWS::Athena::WorkGroup
* AWS::Chatbot::SlackChannelConfiguration
* AWS::CodeStarConnections::Connection

## Attribute Changes

* AWS::EKS::Cluster EncryptionConfigKeyArn (__added__)

## Property Changes

* AWS::EKS::Cluster EncryptionConfig (__added__)

## Property Type Changes

* AWS::EKS::Cluster.EncryptionConfig (__added__)
* AWS::EKS::Cluster.Provider (__added__)


# CloudFormation Resource Specification v11.3.0

## New Resource Types

* AWS::CloudWatch::CompositeAlarm

## Attribute Changes

* AWS::AppMesh::Mesh MeshOwner (__added__)
* AWS::AppMesh::Mesh ResourceOwner (__added__)
* AWS::AppMesh::Route MeshOwner (__added__)
* AWS::AppMesh::Route ResourceOwner (__added__)
* AWS::AppMesh::VirtualNode MeshOwner (__added__)
* AWS::AppMesh::VirtualNode ResourceOwner (__added__)
* AWS::AppMesh::VirtualRouter MeshOwner (__added__)
* AWS::AppMesh::VirtualRouter ResourceOwner (__added__)
* AWS::AppMesh::VirtualService MeshOwner (__added__)
* AWS::AppMesh::VirtualService ResourceOwner (__added__)

## Property Changes


## Property Type Changes

* AWS::AppMesh::VirtualNode.BackendDefaults (__added__)
* AWS::AppMesh::VirtualNode.ClientPolicy (__added__)
* AWS::AppMesh::VirtualNode.ClientPolicyTls (__added__)
* AWS::AppMesh::VirtualNode.ListenerTls (__added__)
* AWS::AppMesh::VirtualNode.ListenerTlsAcmCertificate (__added__)
* AWS::AppMesh::VirtualNode.ListenerTlsCertificate (__added__)
* AWS::AppMesh::VirtualNode.ListenerTlsFileCertificate (__added__)
* AWS::AppMesh::VirtualNode.TlsValidationContext (__added__)
* AWS::AppMesh::VirtualNode.TlsValidationContextAcmTrust (__added__)
* AWS::AppMesh::VirtualNode.TlsValidationContextFileTrust (__added__)
* AWS::AppMesh::VirtualNode.TlsValidationContextTrust (__added__)
* AWS::Greengrass::ResourceDefinition.ResourceDownloadOwnerSetting (__added__)
* AWS::Greengrass::ResourceDefinitionVersion.ResourceDownloadOwnerSetting (__added__)
* AWS::AppMesh::VirtualNode.Listener TLS (__added__)
* AWS::AppMesh::VirtualNode.VirtualNodeSpec BackendDefaults (__added__)
* AWS::AppMesh::VirtualNode.VirtualServiceBackend ClientPolicy (__added__)
* AWS::Greengrass::ResourceDefinition.S3MachineLearningModelResourceData OwnerSetting (__added__)
* AWS::Greengrass::ResourceDefinition.SageMakerMachineLearningModelResourceData OwnerSetting (__added__)
* AWS::Greengrass::ResourceDefinitionVersion.S3MachineLearningModelResourceData OwnerSetting (__added__)
* AWS::Greengrass::ResourceDefinitionVersion.SageMakerMachineLearningModelResourceData OwnerSetting (__added__)

# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes


## Property Type Changes

* AWS::Serverless::Function.CloudWatchLogsEvent (__added__)
* AWS::Serverless::Function.EventSource Properties.Types (__changed__)
  * Added CloudWatchLogsEvent

# CloudFormation Resource Specification v11.1.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::CodeBuild::Project FileSystemLocations (__added__)
* AWS::Cognito::UserPool UsernameConfiguration (__added__)
* AWS::Config::AggregationAuthorization Tags (__added__)
* AWS::Config::ConfigurationAggregator Tags (__added__)
* AWS::WAFv2::IPSet Addresses.PrimitiveItemType (__added__)
* AWS::WAFv2::IPSet Addresses.Type (__changed__)
  * Old: IPAddresses
  * New: List
* AWS::WAFv2::IPSet Tags.ItemType (__added__)
* AWS::WAFv2::IPSet Tags.Type (__changed__)
  * Old: TagList
  * New: List
* AWS::WAFv2::RegexPatternSet RegularExpressionList.PrimitiveItemType (__added__)
* AWS::WAFv2::RegexPatternSet RegularExpressionList.Type (__changed__)
  * Old: RegularExpressionList
  * New: List
* AWS::WAFv2::RegexPatternSet Tags.ItemType (__added__)
* AWS::WAFv2::RegexPatternSet Tags.Type (__changed__)
  * Old: TagList
  * New: List
* AWS::WAFv2::RuleGroup Rules.ItemType (__added__)
* AWS::WAFv2::RuleGroup Rules.Type (__changed__)
  * Old: Rules
  * New: List
* AWS::WAFv2::RuleGroup Tags.ItemType (__added__)
* AWS::WAFv2::RuleGroup Tags.Type (__changed__)
  * Old: TagList
  * New: List
* AWS::WAFv2::WebACL Rules.ItemType (__added__)
* AWS::WAFv2::WebACL Rules.Type (__changed__)
  * Old: Rules
  * New: List
* AWS::WAFv2::WebACL Tags.ItemType (__added__)
* AWS::WAFv2::WebACL Tags.Type (__changed__)
  * Old: TagList
  * New: List

## Property Type Changes

* AWS::WAFv2::IPSet.IPAddresses (__removed__)
* AWS::WAFv2::IPSet.TagList (__removed__)
* AWS::WAFv2::RegexPatternSet.Regex (__removed__)
* AWS::WAFv2::RegexPatternSet.RegularExpressionList (__removed__)
* AWS::WAFv2::RegexPatternSet.TagList (__removed__)
* AWS::WAFv2::RuleGroup.AllQueryArguments (__removed__)
* AWS::WAFv2::RuleGroup.AllowAction (__removed__)
* AWS::WAFv2::RuleGroup.BlockAction (__removed__)
* AWS::WAFv2::RuleGroup.Body (__removed__)
* AWS::WAFv2::RuleGroup.CountAction (__removed__)
* AWS::WAFv2::RuleGroup.CountryCodes (__removed__)
* AWS::WAFv2::RuleGroup.Method (__removed__)
* AWS::WAFv2::RuleGroup.QueryString (__removed__)
* AWS::WAFv2::RuleGroup.Rules (__removed__)
* AWS::WAFv2::RuleGroup.SingleHeader (__removed__)
* AWS::WAFv2::RuleGroup.SingleQueryArgument (__removed__)
* AWS::WAFv2::RuleGroup.StatementThrees (__removed__)
* AWS::WAFv2::RuleGroup.StatementTwos (__removed__)
* AWS::WAFv2::RuleGroup.TagList (__removed__)
* AWS::WAFv2::RuleGroup.TextTransformations (__removed__)
* AWS::WAFv2::RuleGroup.UriPath (__removed__)
* AWS::WAFv2::WebACL.AllQueryArguments (__removed__)
* AWS::WAFv2::WebACL.AllowAction (__removed__)
* AWS::WAFv2::WebACL.BlockAction (__removed__)
* AWS::WAFv2::WebACL.Body (__removed__)
* AWS::WAFv2::WebACL.CountAction (__removed__)
* AWS::WAFv2::WebACL.CountryCodes (__removed__)
* AWS::WAFv2::WebACL.ExcludedRules (__removed__)
* AWS::WAFv2::WebACL.Method (__removed__)
* AWS::WAFv2::WebACL.NoneAction (__removed__)
* AWS::WAFv2::WebACL.QueryString (__removed__)
* AWS::WAFv2::WebACL.Rules (__removed__)
* AWS::WAFv2::WebACL.SingleHeader (__removed__)
* AWS::WAFv2::WebACL.SingleQueryArgument (__removed__)
* AWS::WAFv2::WebACL.StatementThrees (__removed__)
* AWS::WAFv2::WebACL.StatementTwos (__removed__)
* AWS::WAFv2::WebACL.TagList (__removed__)
* AWS::WAFv2::WebACL.TextTransformations (__removed__)
* AWS::WAFv2::WebACL.UriPath (__removed__)
* AWS::CodeBuild::Project.ProjectFileSystemLocation (__added__)
* AWS::Cognito::UserPool.UsernameConfiguration (__added__)
* AWS::WAFv2::RuleGroup.AndStatementOne Statements.ItemType (__added__)
* AWS::WAFv2::RuleGroup.AndStatementOne Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.AndStatementOne Statements.Type (__changed__)
  * Old: StatementTwos
  * New: List
* AWS::WAFv2::RuleGroup.AndStatementTwo Statements.ItemType (__added__)
* AWS::WAFv2::RuleGroup.AndStatementTwo Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.AndStatementTwo Statements.Type (__changed__)
  * Old: StatementThrees
  * New: List
* AWS::WAFv2::RuleGroup.ByteMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.ByteMatchStatement PositionalConstraint.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.ByteMatchStatement SearchString.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.ByteMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::RuleGroup.ByteMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.ByteMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::RuleGroup.FieldToMatch AllQueryArguments.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch AllQueryArguments.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch Body.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch Body.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch Method.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch Method.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch QueryString.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch QueryString.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch SingleHeader.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch SingleHeader.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch SingleQueryArgument.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch SingleQueryArgument.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.FieldToMatch UriPath.Type (__deleted__)
* AWS::WAFv2::RuleGroup.FieldToMatch UriPath.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.GeoMatchStatement CountryCodes.PrimitiveItemType (__added__)
* AWS::WAFv2::RuleGroup.GeoMatchStatement CountryCodes.Type (__changed__)
  * Old: CountryCodes
  * New: List
* AWS::WAFv2::RuleGroup.IPSetReferenceStatement Arn.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.NotStatementOne Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.NotStatementTwo Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.OrStatementOne Statements.ItemType (__added__)
* AWS::WAFv2::RuleGroup.OrStatementOne Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.OrStatementOne Statements.Type (__changed__)
  * Old: StatementTwos
  * New: List
* AWS::WAFv2::RuleGroup.OrStatementTwo Statements.ItemType (__added__)
* AWS::WAFv2::RuleGroup.OrStatementTwo Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.OrStatementTwo Statements.Type (__changed__)
  * Old: StatementThrees
  * New: List
* AWS::WAFv2::RuleGroup.RateBasedStatementOne AggregateKeyType.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RateBasedStatementOne Limit.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RateBasedStatementTwo AggregateKeyType.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RateBasedStatementTwo Limit.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement Arn.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::RuleGroup.Rule Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.Rule Priority.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.Rule Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.Rule VisibilityConfig.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.RuleAction Allow.Type (__deleted__)
* AWS::WAFv2::RuleGroup.RuleAction Allow.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.RuleAction Block.Type (__deleted__)
* AWS::WAFv2::RuleGroup.RuleAction Block.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.RuleAction Count.Type (__deleted__)
* AWS::WAFv2::RuleGroup.RuleAction Count.PrimitiveType (__added__)
* AWS::WAFv2::RuleGroup.SizeConstraintStatement ComparisonOperator.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SizeConstraintStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SizeConstraintStatement Size.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SizeConstraintStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::RuleGroup.SizeConstraintStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SizeConstraintStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::RuleGroup.SqliMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SqliMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::RuleGroup.SqliMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.SqliMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::RuleGroup.TextTransformation Priority.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.TextTransformation Type.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.VisibilityConfig CloudWatchMetricsEnabled.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.VisibilityConfig MetricName.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.VisibilityConfig SampledRequestsEnabled.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.XssMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.XssMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::RuleGroup.XssMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup.XssMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::WebACL.AndStatementOne Statements.ItemType (__added__)
* AWS::WAFv2::WebACL.AndStatementOne Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.AndStatementOne Statements.Type (__changed__)
  * Old: StatementTwos
  * New: List
* AWS::WAFv2::WebACL.AndStatementTwo Statements.ItemType (__added__)
* AWS::WAFv2::WebACL.AndStatementTwo Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.AndStatementTwo Statements.Type (__changed__)
  * Old: StatementThrees
  * New: List
* AWS::WAFv2::WebACL.ByteMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ByteMatchStatement PositionalConstraint.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ByteMatchStatement SearchString.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ByteMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::WebACL.ByteMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ByteMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::WebACL.DefaultAction Allow.Type (__deleted__)
* AWS::WAFv2::WebACL.DefaultAction Allow.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.DefaultAction Block.Type (__deleted__)
* AWS::WAFv2::WebACL.DefaultAction Block.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.ExcludedRule Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.FieldToMatch AllQueryArguments.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch AllQueryArguments.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch Body.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch Body.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch Method.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch Method.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch QueryString.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch QueryString.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch SingleHeader.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch SingleHeader.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch SingleQueryArgument.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch SingleQueryArgument.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.FieldToMatch UriPath.Type (__deleted__)
* AWS::WAFv2::WebACL.FieldToMatch UriPath.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.GeoMatchStatement CountryCodes.PrimitiveItemType (__added__)
* AWS::WAFv2::WebACL.GeoMatchStatement CountryCodes.Type (__changed__)
  * Old: CountryCodes
  * New: List
* AWS::WAFv2::WebACL.IPSetReferenceStatement Arn.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ManagedRuleGroupStatement ExcludedRules.ItemType (__added__)
* AWS::WAFv2::WebACL.ManagedRuleGroupStatement ExcludedRules.Type (__changed__)
  * Old: ExcludedRules
  * New: List
* AWS::WAFv2::WebACL.ManagedRuleGroupStatement Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.ManagedRuleGroupStatement VendorName.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.NotStatementOne Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.NotStatementTwo Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.OrStatementOne Statements.ItemType (__added__)
* AWS::WAFv2::WebACL.OrStatementOne Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.OrStatementOne Statements.Type (__changed__)
  * Old: StatementTwos
  * New: List
* AWS::WAFv2::WebACL.OrStatementTwo Statements.ItemType (__added__)
* AWS::WAFv2::WebACL.OrStatementTwo Statements.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.OrStatementTwo Statements.Type (__changed__)
  * Old: StatementThrees
  * New: List
* AWS::WAFv2::WebACL.OverrideAction Count.Type (__deleted__)
* AWS::WAFv2::WebACL.OverrideAction Count.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.OverrideAction None.Type (__deleted__)
* AWS::WAFv2::WebACL.OverrideAction None.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.RateBasedStatementOne AggregateKeyType.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RateBasedStatementOne Limit.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RateBasedStatementTwo AggregateKeyType.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RateBasedStatementTwo Limit.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement Arn.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::WebACL.Rule Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.Rule Priority.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.Rule Statement.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.Rule VisibilityConfig.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RuleAction Allow.Type (__deleted__)
* AWS::WAFv2::WebACL.RuleAction Allow.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.RuleAction Block.Type (__deleted__)
* AWS::WAFv2::WebACL.RuleAction Block.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.RuleAction Count.Type (__deleted__)
* AWS::WAFv2::WebACL.RuleAction Count.PrimitiveType (__added__)
* AWS::WAFv2::WebACL.RuleGroupReferenceStatement Arn.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.RuleGroupReferenceStatement ExcludedRules.ItemType (__added__)
* AWS::WAFv2::WebACL.RuleGroupReferenceStatement ExcludedRules.Type (__changed__)
  * Old: ExcludedRules
  * New: List
* AWS::WAFv2::WebACL.SizeConstraintStatement ComparisonOperator.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SizeConstraintStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SizeConstraintStatement Size.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SizeConstraintStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::WebACL.SizeConstraintStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SizeConstraintStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::WebACL.SqliMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SqliMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::WebACL.SqliMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.SqliMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List
* AWS::WAFv2::WebACL.TextTransformation Priority.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.TextTransformation Type.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.VisibilityConfig CloudWatchMetricsEnabled.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.VisibilityConfig MetricName.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.VisibilityConfig SampledRequestsEnabled.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.XssMatchStatement FieldToMatch.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.XssMatchStatement TextTransformations.ItemType (__added__)
* AWS::WAFv2::WebACL.XssMatchStatement TextTransformations.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL.XssMatchStatement TextTransformations.Type (__changed__)
  * Old: TextTransformations
  * New: List


# CloudFormation Resource Specification v11.0.0

## New Resource Types

* AWS::Config::ConformancePack
* AWS::Config::OrganizationConformancePack
* AWS::EC2::LocalGatewayRoute
* AWS::EC2::LocalGatewayRouteTableVPCAssociation
* AWS::FMS::NotificationChannel
* AWS::FMS::Policy

## Attribute Changes


## Property Changes

* AWS::Neptune::DBCluster DeletionProtection (__added__)
* AWS::Neptune::DBCluster EngineVersion (__added__)

## Property Type Changes

* AWS::ElasticLoadBalancingV2::Listener.ForwardConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.TargetGroupStickinessConfig (__added__)
* AWS::ElasticLoadBalancingV2::Listener.TargetGroupTuple (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.ForwardConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupStickinessConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupTuple (__added__)
* AWS::ElasticLoadBalancingV2::Listener.Action ForwardConfig (__added__)
* AWS::ElasticLoadBalancingV2::ListenerRule.Action ForwardConfig (__added__)
* AWS::FSx::FileSystem.LustreConfiguration DeploymentType (__added__)
* AWS::FSx::FileSystem.LustreConfiguration PerUnitStorageThroughput (__added__)


# CloudFormation Resource Specification v10.5.0

## New Resource Types

* AWS::AppConfig::Application
* AWS::AppConfig::ConfigurationProfile
* AWS::AppConfig::Deployment
* AWS::AppConfig::DeploymentStrategy
* AWS::AppConfig::Environment
* AWS::WAFv2::WebACLAssociation

## Attribute Changes

* AWS::Athena::NamedQuery NamedQueryId (__deleted__)
* AWS::Transfer::Server VpcEndpointId (__deleted__)

## Property Changes

* AWS::ACMPCA::Certificate Validity.PrimitiveType (__deleted__)
* AWS::ACMPCA::Certificate Validity.Type (__added__)
* AWS::ACMPCA::CertificateAuthority RevocationConfiguration.PrimitiveType (__deleted__)
* AWS::ACMPCA::CertificateAuthority RevocationConfiguration.Type (__added__)
* AWS::ACMPCA::CertificateAuthority Subject.PrimitiveType (__deleted__)
* AWS::ACMPCA::CertificateAuthority Subject.Type (__added__)
* AWS::AppSync::GraphQLApi XrayEnabled (__added__)
* AWS::EC2::ClientVpnEndpoint VpnPort (__added__)
* AWS::OpsWorksCM::Server Tags (__added__)

## Property Type Changes

* AWS::ACMPCA::Certificate.Validity (__added__)
* AWS::ACMPCA::CertificateAuthority.CrlConfiguration (__added__)
* AWS::ACMPCA::CertificateAuthority.RevocationConfiguration (__added__)
* AWS::ACMPCA::CertificateAuthority.Subject (__added__)
* AWS::Backup::BackupPlan.CopyActionResourceType (__added__)
* AWS::EC2::LaunchTemplate.MetadataOptions (__added__)
* AWS::MediaLive::Channel.MultiplexProgramChannelDestinationSettings (__added__)
* AWS::Backup::BackupPlan.BackupRuleResourceType CopyActions (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData MetadataOptions (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateElasticInferenceAccelerator Count (__added__)
* AWS::EC2::LaunchTemplate.Placement HostResourceGroupArn (__added__)
* AWS::EC2::LaunchTemplate.Placement PartitionNumber (__added__)
* AWS::EC2::LaunchTemplate.Placement SpreadDomain (__added__)
* AWS::MediaLive::Channel.OutputDestination MultiplexSettings (__added__)
* AWS::Transfer::Server.EndpointDetails AddressAllocationIds.UpdateType (__changed__)
  * Old: Mutable
  * New: Conditional


# CloudFormation Resource Specification v10.4.0

## New Resource Types

* AWS::ACMPCA::Certificate
* AWS::ACMPCA::CertificateAuthority
* AWS::ACMPCA::CertificateAuthorityActivation

## Attribute Changes

* AWS::Athena::NamedQuery NamedQueryId (__added__)
* AWS::Transfer::Server VpcEndpointId (__added__)

## Property Changes

* AWS::Cognito::UserPool AccountRecoverySetting (__added__)

## Property Type Changes

* AWS::Cognito::UserPool.AccountRecoverySetting (__added__)
* AWS::Cognito::UserPool.RecoveryOption (__added__)
* AWS::Transfer::Server.EndpointDetails AddressAllocationIds (__added__)
* AWS::Transfer::Server.EndpointDetails SubnetIds (__added__)
* AWS::Transfer::Server.EndpointDetails VpcId (__added__)
* AWS::Transfer::Server.EndpointDetails VpcEndpointId.Required (__changed__)
  * Old: true
  * New: false


# CloudFormation Resource Specification v10.3.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::AppStream::Fleet Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::AppStream::ImageBuilder Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::EC2::Instance HibernationOptions (__added__)
* AWS::EC2::Instance HostResourceGroupArn (__added__)
* AWS::IoTEvents::DetectorModel EvaluationMethod (__added__)
* AWS::RDS::DBInstance CACertificateIdentifier (__added__)
* AWS::SSM::ResourceDataSync S3Destination (__added__)
* AWS::SSM::ResourceDataSync SyncSource (__added__)
* AWS::SSM::ResourceDataSync SyncType (__added__)
* AWS::SSM::ResourceDataSync BucketName.Required (__changed__)
  * Old: true
  * New: false
* AWS::SSM::ResourceDataSync BucketRegion.Required (__changed__)
  * Old: true
  * New: false
* AWS::SSM::ResourceDataSync SyncFormat.Required (__changed__)
  * Old: true
  * New: false
* AWS::Transfer::User HomeDirectoryMappings (__added__)
* AWS::Transfer::User HomeDirectoryType (__added__)
* AWS::WAFv2::IPSet Addresses.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::IPSet IPAddressVersion.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::IPSet Name.Required (__changed__)
  * Old: true
  * New: false
* AWS::WAFv2::RegexPatternSet Name.Required (__changed__)
  * Old: true
  * New: false
* AWS::WAFv2::RegexPatternSet RegularExpressionList.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup Capacity.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::RuleGroup Name.Required (__changed__)
  * Old: true
  * New: false
* AWS::WAFv2::RuleGroup VisibilityConfig.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL DefaultAction.Required (__changed__)
  * Old: false
  * New: true
* AWS::WAFv2::WebACL Name.Required (__changed__)
  * Old: true
  * New: false
* AWS::WAFv2::WebACL VisibilityConfig.Required (__changed__)
  * Old: false
  * New: true

## Property Type Changes

* AWS::EC2::Instance.HibernationOptions (__added__)
* AWS::SSM::ResourceDataSync.AwsOrganizationsSource (__added__)
* AWS::SSM::ResourceDataSync.S3Destination (__added__)
* AWS::SSM::ResourceDataSync.SyncSource (__added__)
* AWS::Transfer::User.HomeDirectoryMapEntry (__added__)
* AWS::AutoScaling::AutoScalingGroup.LaunchTemplateOverrides WeightedCapacity (__added__)
* AWS::SageMaker::Model.ContainerDefinition Mode (__added__)


# CloudFormation Resource Specification v10.2.0

## New Resource Types

* AWS::CodeBuild::ReportGroup
* AWS::EC2::GatewayRouteTableAssociation

## Attribute Changes


## Property Changes

* AWS::Cloud9::EnvironmentEC2 Tags (__added__)
* AWS::Cloud9::EnvironmentEC2 Description.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::Cloud9::EnvironmentEC2 Name.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::EC2::EIP InstanceId.UpdateType (__changed__)
  * Old: Mutable
  * New: Conditional
* AWS::EC2::EIP PublicIpv4Pool.UpdateType (__changed__)
  * Old: Mutable
  * New: Conditional
* AWS::MSK::Cluster OpenMonitoring (__added__)
* AWS::MSK::Cluster EnhancedMonitoring.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::RDS::DBInstance MaxAllocatedStorage (__added__)
* AWS::SSM::Document Name (__added__)

## Property Type Changes

* AWS::DLM::LifecyclePolicy.CrossRegionCopyRetainRule (__added__)
* AWS::DLM::LifecyclePolicy.CrossRegionCopyRule (__added__)
* AWS::MSK::Cluster.JmxExporter (__added__)
* AWS::MSK::Cluster.NodeExporter (__added__)
* AWS::MSK::Cluster.OpenMonitoring (__added__)
* AWS::MSK::Cluster.Prometheus (__added__)
* AWS::DLM::LifecyclePolicy.FastRestoreRule Interval (__added__)
* AWS::DLM::LifecyclePolicy.FastRestoreRule IntervalUnit (__added__)
* AWS::DLM::LifecyclePolicy.FastRestoreRule Count.Required (__changed__)
  * Old: true
  * New: false
* AWS::DLM::LifecyclePolicy.PolicyDetails ResourceTypes.Required (__changed__)
  * Old: false
  * New: true
* AWS::DLM::LifecyclePolicy.PolicyDetails Schedules.Required (__changed__)
  * Old: false
  * New: true
* AWS::DLM::LifecyclePolicy.PolicyDetails TargetTags.Required (__changed__)
  * Old: false
  * New: true
* AWS::DLM::LifecyclePolicy.RetainRule Interval (__added__)
* AWS::DLM::LifecyclePolicy.RetainRule IntervalUnit (__added__)
* AWS::DLM::LifecyclePolicy.RetainRule Count.Required (__changed__)
  * Old: true
  * New: false
* AWS::DLM::LifecyclePolicy.Schedule CrossRegionCopyRules (__added__)


# CloudFormation Resource Specification v10.1.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Pinpoint::EmailTemplate DefaultSubstitutions (__added__)
* AWS::Pinpoint::EmailTemplate TemplateDescription (__added__)
* AWS::Pinpoint::PushTemplate DefaultSubstitutions (__added__)
* AWS::Pinpoint::PushTemplate TemplateDescription (__added__)
* AWS::Pinpoint::SmsTemplate DefaultSubstitutions (__added__)
* AWS::Pinpoint::SmsTemplate TemplateDescription (__added__)

## Property Type Changes



# CloudFormation Resource Specification v10.0.0

## New Resource Types

* AWS::AccessAnalyzer::Analyzer
* AWS::EventSchemas::Discoverer
* AWS::EventSchemas::Registry
* AWS::EventSchemas::Schema
* AWS::S3::AccessPoint

## Attribute Changes

* AWS::WAFv2::IPSet Arn (__added__)
* AWS::WAFv2::IPSet Id (__added__)
* AWS::WAFv2::RegexPatternSet Arn (__added__)
* AWS::WAFv2::RegexPatternSet Id (__added__)
* AWS::WAFv2::RuleGroup Arn (__added__)
* AWS::WAFv2::RuleGroup Id (__added__)
* AWS::WAFv2::WebACL Arn (__added__)
* AWS::WAFv2::WebACL Capacity (__added__)
* AWS::WAFv2::WebACL Id (__added__)

## Property Changes

* AWS::ApiGatewayV2::Api BasePath (__added__)
* AWS::ApiGatewayV2::Api Body (__added__)
* AWS::ApiGatewayV2::Api BodyS3Location (__added__)
* AWS::ApiGatewayV2::Api CorsConfiguration (__added__)
* AWS::ApiGatewayV2::Api CredentialsArn (__added__)
* AWS::ApiGatewayV2::Api FailOnWarnings (__added__)
* AWS::ApiGatewayV2::Api RouteKey (__added__)
* AWS::ApiGatewayV2::Api Target (__added__)
* AWS::ApiGatewayV2::Api Name.Required (__changed__)
  * Old: true
  * New: false
* AWS::ApiGatewayV2::Api ProtocolType.Required (__changed__)
  * Old: true
  * New: false
* AWS::ApiGatewayV2::Api RouteSelectionExpression.Required (__changed__)
  * Old: true
  * New: false
* AWS::ApiGatewayV2::Authorizer JwtConfiguration (__added__)
* AWS::ApiGatewayV2::Authorizer AuthorizerUri.Required (__changed__)
  * Old: true
  * New: false
* AWS::ApiGatewayV2::Integration PayloadFormatVersion (__added__)
* AWS::ApiGatewayV2::Stage AutoDeploy (__added__)
* AWS::ApiGatewayV2::Stage DeploymentId.Required (__changed__)
  * Old: true
  * New: false
* AWS::GuardDuty::Filter Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::Lambda::Alias ProvisionedConcurrencyConfig (__added__)
* AWS::Lambda::Version ProvisionedConcurrencyConfig (__added__)
* AWS::StepFunctions::StateMachine LoggingConfiguration (__added__)
* AWS::StepFunctions::StateMachine StateMachineType (__added__)
* AWS::WAFv2::IPSet IPSet (__deleted__)
* AWS::WAFv2::IPSet IPSetSummary (__deleted__)
* AWS::WAFv2::IPSet IPSets (__deleted__)
* AWS::WAFv2::IPSet Id (__deleted__)
* AWS::WAFv2::IPSet Limit (__deleted__)
* AWS::WAFv2::IPSet LockToken (__deleted__)
* AWS::WAFv2::IPSet NextLockToken (__deleted__)
* AWS::WAFv2::IPSet NextMarker (__deleted__)
* AWS::WAFv2::IPSet Summary (__deleted__)
* AWS::WAFv2::RegexPatternSet Id (__deleted__)
* AWS::WAFv2::RegexPatternSet Limit (__deleted__)
* AWS::WAFv2::RegexPatternSet LockToken (__deleted__)
* AWS::WAFv2::RegexPatternSet NextLockToken (__deleted__)
* AWS::WAFv2::RegexPatternSet NextMarker (__deleted__)
* AWS::WAFv2::RegexPatternSet RegexPatternSet (__deleted__)
* AWS::WAFv2::RegexPatternSet RegexPatternSets (__deleted__)
* AWS::WAFv2::RegexPatternSet Summary (__deleted__)
* AWS::WAFv2::RuleGroup Id (__deleted__)
* AWS::WAFv2::RuleGroup Limit (__deleted__)
* AWS::WAFv2::RuleGroup LockToken (__deleted__)
* AWS::WAFv2::RuleGroup NextLockToken (__deleted__)
* AWS::WAFv2::RuleGroup NextMarker (__deleted__)
* AWS::WAFv2::RuleGroup RuleGroup (__deleted__)
* AWS::WAFv2::RuleGroup RuleGroupSummary (__deleted__)
* AWS::WAFv2::RuleGroup RuleGroups (__deleted__)
* AWS::WAFv2::RuleGroup Statement (__deleted__)
* AWS::WAFv2::RuleGroup Summary (__deleted__)
* AWS::WAFv2::WebACL Id (__deleted__)
* AWS::WAFv2::WebACL Limit (__deleted__)
* AWS::WAFv2::WebACL LockToken (__deleted__)
* AWS::WAFv2::WebACL NextLockToken (__deleted__)
* AWS::WAFv2::WebACL NextMarker (__deleted__)
* AWS::WAFv2::WebACL Summary (__deleted__)
* AWS::WAFv2::WebACL WebACL (__deleted__)
* AWS::WAFv2::WebACL WebACLs (__deleted__)

## Property Type Changes

* AWS::WAFv2::IPSet.IPSet (__removed__)
* AWS::WAFv2::IPSet.IPSetSummary (__removed__)
* AWS::WAFv2::IPSet.IPSets (__removed__)
* AWS::WAFv2::RegexPatternSet.RegexPatternSet (__removed__)
* AWS::WAFv2::RegexPatternSet.RegexPatternSetSummary (__removed__)
* AWS::WAFv2::RegexPatternSet.RegexPatternSets (__removed__)
* AWS::WAFv2::RuleGroup.RuleGroup (__removed__)
* AWS::WAFv2::RuleGroup.RuleGroupSummary (__removed__)
* AWS::WAFv2::RuleGroup.RuleGroups (__removed__)
* AWS::WAFv2::WebACL.WebACL (__removed__)
* AWS::WAFv2::WebACL.WebACLSummary (__removed__)
* AWS::WAFv2::WebACL.WebACLs (__removed__)
* AWS::ApiGatewayV2::Api.BodyS3Location (__added__)
* AWS::ApiGatewayV2::Api.Cors (__added__)
* AWS::ApiGatewayV2::Authorizer.JWTConfiguration (__added__)
* AWS::Lambda::Alias.ProvisionedConcurrencyConfiguration (__added__)
* AWS::Lambda::Version.ProvisionedConcurrencyConfiguration (__added__)
* AWS::StepFunctions::StateMachine.CloudWatchLogsLogGroup (__added__)
* AWS::StepFunctions::StateMachine.LogDestination (__added__)
* AWS::StepFunctions::StateMachine.LoggingConfiguration (__added__)
* AWS::FSx::FileSystem.WindowsConfiguration DeploymentType (__added__)
* AWS::FSx::FileSystem.WindowsConfiguration PreferredSubnetId (__added__)
* AWS::WAFv2::RuleGroup.IPSetReferenceStatement ARN (__deleted__)
* AWS::WAFv2::RuleGroup.IPSetReferenceStatement Arn (__added__)
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement ARN (__deleted__)
* AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement Arn (__added__)
* AWS::WAFv2::WebACL.IPSetReferenceStatement ARN (__deleted__)
* AWS::WAFv2::WebACL.IPSetReferenceStatement Arn (__added__)
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement ARN (__deleted__)
* AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement Arn (__added__)
* AWS::WAFv2::WebACL.RuleGroupReferenceStatement ARN (__deleted__)
* AWS::WAFv2::WebACL.RuleGroupReferenceStatement Arn (__added__)


# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Serverless::Api Cors.PrimitiveType (__deleted__)
* AWS::Serverless::Api Cors.PrimitiveTypes (__added__)
* AWS::Serverless::Api Cors.Types (__added__)
* AWS::Serverless::Api MethodSettings.PrimitiveType (__deleted__)
* AWS::Serverless::Api MethodSettings.PrimitiveItemType (__added__)
* AWS::Serverless::Api MethodSettings.Type (__added__)

## Property Type Changes

* AWS::Serverless::Api.CorsConfiguration (__added__)
* AWS::Serverless::Function.S3KeyFilter (__added__)
* AWS::Serverless::Function.S3KeyFilterRule (__added__)
* AWS::Serverless::Function.S3NotificationFilter S3Key.PrimitiveType (__deleted__)
* AWS::Serverless::Function.S3NotificationFilter S3Key.Type (__added__)

# CloudFormation Resource Specification v9.1.1

## New Resource Types

* AWS::AppSync::ApiCache
* AWS::CloudWatch::InsightRule
* AWS::ECS::PrimaryTaskSet
* AWS::ECS::TaskSet
* AWS::EKS::Nodegroup
* AWS::GameLift::GameSessionQueue
* AWS::GameLift::MatchmakingConfiguration
* AWS::GameLift::MatchmakingRuleSet
* AWS::GameLift::Script
* AWS::Lambda::EventInvokeConfig
* AWS::WAFv2::IPSet
* AWS::WAFv2::RegexPatternSet
* AWS::WAFv2::RuleGroup
* AWS::WAFv2::WebACL

## Attribute Changes

* AWS::EKS::Cluster ClusterSecurityGroupId (__added__)

## Property Changes

* AWS::AmazonMQ::Broker StorageType (__added__)
* AWS::AppSync::Resolver CachingConfig (__added__)
* AWS::AppSync::Resolver SyncConfig (__added__)
* AWS::Cognito::IdentityPool AllowClassicFlow (__added__)
* AWS::Cognito::UserPoolClient PreventUserExistenceErrors (__added__)
* AWS::Cognito::UserPoolClient AllowedOAuthFlowsUserPoolClient.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::Cognito::UserPoolUser ClientMetadata (__added__)
* AWS::DocDB::DBCluster MasterUserPassword.Required (__changed__)
  * Old: false
  * New: true
* AWS::DocDB::DBCluster MasterUsername.Required (__changed__)
  * Old: false
  * New: true
* AWS::EC2::EIP Tags (__added__)
* AWS::EC2::NetworkAclEntry CidrBlock.Required (__changed__)
  * Old: true
  * New: false
* AWS::ECS::Cluster ClusterSettings (__added__)
* AWS::ECS::Service DeploymentController (__added__)
* AWS::ECS::Service TaskDefinition.Required (__changed__)
  * Old: true
  * New: false
* AWS::ElastiCache::ReplicationGroup AuthToken.UpdateType (__changed__)
  * Old: Immutable
  * New: Conditional
* AWS::Elasticsearch::Domain CognitoOptions (__added__)
* AWS::Elasticsearch::Domain ElasticsearchVersion.UpdateType (__changed__)
  * Old: Immutable
  * New: Conditional
* AWS::GameLift::Build OperatingSystem (__added__)
* AWS::GameLift::Fleet CertificateConfiguration (__added__)
* AWS::GameLift::Fleet FleetType (__added__)
* AWS::GameLift::Fleet InstanceRoleARN (__added__)
* AWS::GameLift::Fleet MetricGroups (__added__)
* AWS::GameLift::Fleet NewGameSessionProtectionPolicy (__added__)
* AWS::GameLift::Fleet PeerVpcAwsAccountId (__added__)
* AWS::GameLift::Fleet PeerVpcId (__added__)
* AWS::GameLift::Fleet ResourceCreationLimitPolicy (__added__)
* AWS::GameLift::Fleet RuntimeConfiguration (__added__)
* AWS::GameLift::Fleet ScriptId (__added__)
* AWS::GameLift::Fleet BuildId.Required (__changed__)
  * Old: true
  * New: false
* AWS::GameLift::Fleet DesiredEC2Instances.Required (__changed__)
  * Old: true
  * New: false
* AWS::GameLift::Fleet ServerLaunchPath.Required (__changed__)
  * Old: true
  * New: false
* AWS::Glue::MLTransform GlueVersion (__added__)
* AWS::IAM::User Tags (__added__)
* AWS::Lambda::EventSourceMapping BisectBatchOnFunctionError (__added__)
* AWS::Lambda::EventSourceMapping DestinationConfig (__added__)
* AWS::Lambda::EventSourceMapping MaximumRecordAgeInSeconds (__added__)
* AWS::Lambda::EventSourceMapping MaximumRetryAttempts (__added__)
* AWS::Lambda::EventSourceMapping ParallelizationFactor (__added__)
* AWS::OpsWorksCM::Server CustomCertificate (__added__)
* AWS::OpsWorksCM::Server CustomDomain (__added__)
* AWS::OpsWorksCM::Server CustomPrivateKey (__added__)
* AWS::RDS::DBCluster EnableHttpEndpoint (__added__)
* AWS::SNS::Subscription RedrivePolicy (__added__)
* AWS::SageMaker::Endpoint ExcludeRetainedVariantProperties (__added__)
* AWS::SageMaker::Endpoint RetainAllVariantProperties (__added__)

## Property Type Changes

* AWS::AppSync::DataSource.DeltaSyncConfig (__added__)
* AWS::AppSync::Resolver.CachingConfig (__added__)
* AWS::AppSync::Resolver.LambdaConflictHandlerConfig (__added__)
* AWS::AppSync::Resolver.SyncConfig (__added__)
* AWS::DLM::LifecyclePolicy.FastRestoreRule (__added__)
* AWS::ECS::Cluster.ClusterSetting (__added__)
* AWS::ECS::Service.DeploymentController (__added__)
* AWS::ECS::TaskDefinition.FirelensConfiguration (__added__)
* AWS::Elasticsearch::Domain.CognitoOptions (__added__)
* AWS::GameLift::Fleet.CertificateConfiguration (__added__)
* AWS::GameLift::Fleet.ResourceCreationLimitPolicy (__added__)
* AWS::GameLift::Fleet.RuntimeConfiguration (__added__)
* AWS::GameLift::Fleet.ServerProcess (__added__)
* AWS::Lambda::EventSourceMapping.DestinationConfig (__added__)
* AWS::Lambda::EventSourceMapping.OnFailure (__added__)
* AWS::SageMaker::Endpoint.VariantProperty (__added__)
* AWS::ApiGateway::RestApi.EndpointConfiguration VpcEndpointIds (__added__)
* AWS::AppSync::DataSource.DynamoDBConfig DeltaSyncConfig (__added__)
* AWS::AppSync::DataSource.DynamoDBConfig Versioned (__added__)
* AWS::CodePipeline::Pipeline.ActionDeclaration Namespace (__added__)
* AWS::Cognito::UserPool.EmailConfiguration ConfigurationSet (__added__)
* AWS::Cognito::UserPool.EmailConfiguration From (__added__)
* AWS::DLM::LifecyclePolicy.Schedule FastRestoreRule (__added__)
* AWS::EC2::Instance.ElasticInferenceAccelerator Count (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition FirelensConfiguration (__added__)
* AWS::ECS::TaskDefinition.InferenceAccelerator DevicePolicy (__added__)
* AWS::ECS::TaskDefinition.LinuxParameters MaxSwap (__added__)
* AWS::ECS::TaskDefinition.LinuxParameters Swappiness (__added__)
* AWS::GameLift::Build.S3Location ObjectVersion (__added__)


# CloudFormation Resource Specification v8.0.0

## New Resource Types

* AWS::CodeStarNotifications::NotificationRule
* AWS::MediaConvert::JobTemplate
* AWS::MediaConvert::Preset
* AWS::MediaConvert::Queue

## Attribute Changes


## Property Changes

* AWS::AppStream::ImageBuilder AccessEndpoints (__added__)
* AWS::AppStream::Stack AccessEndpoints (__added__)
* AWS::AppStream::Stack EmbedHostDomains (__added__)

## Property Type Changes

* AWS::DLM::LifecyclePolicy.FastRestoreRule (__removed__)
* AWS::AppStream::ImageBuilder.AccessEndpoint (__added__)
* AWS::AppStream::Stack.AccessEndpoint (__added__)
* AWS::DLM::LifecyclePolicy.Schedule FastRestoreRule (__deleted__)
* AWS::ECS::TaskDefinition.InferenceAccelerator DevicePolicy (__deleted__)


# CloudFormation Resource Specification v7.3.0

## New Resource Types

* AWS::Pinpoint::EmailTemplate
* AWS::Pinpoint::PushTemplate
* AWS::Pinpoint::SmsTemplate

## Attribute Changes


## Property Changes

* AWS::Amplify::Branch EnablePullRequestPreview (__added__)
* AWS::Amplify::Branch PullRequestEnvironmentName (__added__)
* AWS::ApiGateway::ApiKey Tags (__added__)
* AWS::ApiGateway::ClientCertificate Tags (__added__)
* AWS::ApiGateway::DomainName SecurityPolicy (__added__)
* AWS::ApiGateway::DomainName Tags (__added__)
* AWS::ApiGateway::RestApi Tags (__added__)
* AWS::ApiGateway::UsagePlan Tags (__added__)
* AWS::CodePipeline::CustomActionType Tags (__added__)
* AWS::CodePipeline::Pipeline Tags (__added__)
* AWS::Cognito::UserPool AliasAttributes.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::Cognito::UserPool Schema.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::Cognito::UserPool UserPoolName.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::Cognito::UserPool UsernameAttributes.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::ECS::TaskDefinition InferenceAccelerators (__added__)
* AWS::Elasticsearch::Domain LogPublishingOptions (__added__)
* AWS::Events::Rule EventBusName (__added__)
* AWS::Glue::Crawler DatabaseName.Required (__changed__)
  * Old: true
  * New: false
* AWS::SNS::Topic Tags (__added__)

## Property Type Changes

* AWS::AppMesh::Route.GrpcRetryPolicy (__added__)
* AWS::AppMesh::Route.GrpcRoute (__added__)
* AWS::AppMesh::Route.GrpcRouteAction (__added__)
* AWS::AppMesh::Route.GrpcRouteMatch (__added__)
* AWS::AppMesh::Route.GrpcRouteMetadata (__added__)
* AWS::AppMesh::Route.GrpcRouteMetadataMatchMethod (__added__)
* AWS::DLM::LifecyclePolicy.FastRestoreRule (__added__)
* AWS::ECS::TaskDefinition.InferenceAccelerator (__added__)
* AWS::Elasticsearch::Domain.LogPublishingOption (__added__)
* AWS::Events::Rule.BatchArrayProperties (__added__)
* AWS::Events::Rule.BatchParameters (__added__)
* AWS::Events::Rule.BatchRetryStrategy (__added__)
* AWS::Glue::Crawler.CatalogTarget (__added__)
* AWS::Glue::Crawler.DynamoDBTarget (__added__)
* AWS::Amplify::App.AutoBranchCreationConfig EnablePullRequestPreview (__added__)
* AWS::Amplify::App.AutoBranchCreationConfig PullRequestEnvironmentName (__added__)
* AWS::AppMesh::Route.RouteSpec GrpcRoute (__added__)
* AWS::AppMesh::Route.RouteSpec Http2Route (__added__)
* AWS::DLM::LifecyclePolicy.Schedule FastRestoreRule (__added__)
* AWS::Events::Rule.Target BatchParameters (__added__)
* AWS::Glue::Crawler.Targets CatalogTargets (__added__)
* AWS::Glue::Crawler.Targets DynamoDBTargets (__added__)
* AWS::RDS::DBCluster.DBClusterRole Status (__deleted__)
* AWS::RDS::DBInstance.DBInstanceRole Status (__deleted__)


# CloudFormation Resource Specification v7.1.0

## New Resource Types

* AWS::EC2::TrafficMirrorFilter
* AWS::EC2::TrafficMirrorFilterRule
* AWS::EC2::TrafficMirrorSession
* AWS::EC2::TrafficMirrorTarget
* AWS::Events::EventBus

## Attribute Changes


## Property Changes

* AWS::FSx::FileSystem FileSystemType.Required (__changed__)
  * Old: false
  * New: true
* AWS::FSx::FileSystem SubnetIds.Required (__changed__)
  * Old: false
  * New: true
* AWS::MSK::Cluster NumberOfBrokerNodes.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable

## Property Type Changes

* AWS::FSx::FileSystem.SelfManagedActiveDirectoryConfiguration (__added__)
* AWS::Batch::ComputeEnvironment.ComputeResources AllocationStrategy (__added__)
* AWS::Cognito::IdentityPoolRoleAttachment.RoleMapping IdentityProvider (__added__)
* AWS::FSx::FileSystem.WindowsConfiguration SelfManagedActiveDirectoryConfiguration (__added__)

# Serverless Application Model (SAM) Resource Specification v2016-10-31

## Property Type Changes

* AWS::Serverless::Function.S3Location Version.Required (__changed__)
  * Old: true
  * New: false

# CloudFormation Resource Specification v6.3.0

## New Resource Types

* AWS::Cognito::UserPoolDomain
* AWS::Cognito::UserPoolIdentityProvider
* AWS::Cognito::UserPoolResourceServer
* AWS::Cognito::UserPoolRiskConfigurationAttachment
* AWS::Cognito::UserPoolUICustomizationAttachment

## Attribute Changes

* AWS::Pinpoint::App Arn (__added__)
* AWS::Pinpoint::Campaign Arn (__added__)
* AWS::Pinpoint::Segment Arn (__added__)

## Property Changes

* AWS::Cognito::UserPool EnabledMfas (__added__)
* AWS::Events::EventBusPolicy EventBusName (__added__)
* AWS::Pinpoint::App Tags (__added__)
* AWS::Pinpoint::Campaign Tags (__added__)
* AWS::Pinpoint::Segment Tags (__added__)

## Property Type Changes

* AWS::Budgets::Budget.BudgetData PlannedBudgetLimits (__added__)


# CloudFormation Resource Specification v6.2.0

## New Resource Types

* AWS::EC2::VPCEndpointService
* AWS::Glue::Workflow
* AWS::SageMaker::CodeRepository

## Attribute Changes


## Property Changes

* AWS::AmazonMQ::Broker HostInstanceType.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::DocDB::DBCluster EnableCloudwatchLogsExports (__added__)
* AWS::Glue::DevEndpoint Arguments (__added__)
* AWS::Glue::DevEndpoint GlueVersion (__added__)
* AWS::Glue::DevEndpoint NumberOfWorkers (__added__)
* AWS::Glue::DevEndpoint WorkerType (__added__)
* AWS::Glue::Job NotificationProperty (__added__)
* AWS::Glue::Job Timeout (__added__)
* AWS::Glue::Trigger StartOnCreation (__added__)
* AWS::Glue::Trigger WorkflowName (__added__)
* AWS::ServiceDiscovery::Instance InstanceAttributes.PrimitiveType (__changed__)
  * Old: Map
  * New: Json

## Property Type Changes

* AWS::Glue::Job.NotificationProperty (__added__)
* AWS::Glue::Trigger.NotificationProperty (__added__)
* AWS::Glue::Trigger.Action CrawlerName (__added__)
* AWS::Glue::Trigger.Action NotificationProperty (__added__)
* AWS::Glue::Trigger.Action Timeout (__added__)
* AWS::Glue::Trigger.Condition CrawlState (__added__)
* AWS::Glue::Trigger.Condition CrawlerName (__added__)


# CloudFormation Resource Specification v6.1.0

## New Resource Types

* AWS::QLDB::Ledger

## Attribute Changes


## Property Changes

* AWS::Config::RemediationConfiguration Automatic (__added__)
* AWS::Config::RemediationConfiguration ExecutionControls (__added__)
* AWS::Config::RemediationConfiguration MaximumAutomaticAttempts (__added__)
* AWS::Config::RemediationConfiguration RetryAttemptSeconds (__added__)

## Property Type Changes

* AWS::AppMesh::Route.Duration (__added__)
* AWS::AppMesh::Route.HttpRetryPolicy (__added__)
* AWS::Config::RemediationConfiguration.ExecutionControls (__added__)
* AWS::Config::RemediationConfiguration.SsmControls (__added__)
* AWS::AppMesh::Route.HttpRoute RetryPolicy (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value


# CloudFormation Resource Specification v6.0.0

## New Resource Types

* AWS::Config::OrganizationConfigRule

## Attribute Changes


## Property Changes

* AWS::AmazonMQ::Broker SecurityGroups.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::ApplicationAutoScaling::ScalableTarget SuspendedState (__added__)
* AWS::CloudWatch::Alarm ThresholdMetricId (__added__)
* AWS::CloudWatch::Alarm Threshold.Required (__changed__)
  * Old: true
  * New: false
* AWS::Cognito::UserPoolClient RefreshTokenValidity.PrimitiveType (__changed__)
  * Old: Double
  * New: Integer
* AWS::EC2::Instance CpuOptions (__added__)
* AWS::ECS::TaskDefinition IpcMode (__added__)
* AWS::ECS::TaskDefinition PidMode (__added__)
* AWS::ElastiCache::ReplicationGroup KmsKeyId (__added__)
* AWS::IAM::Role Description (__added__)
* AWS::IAM::Role Tags (__added__)
* AWS::Lambda::EventSourceMapping MaximumBatchingWindowInSeconds (__added__)
* AWS::RDS::DBCluster AssociatedRoles (__added__)
* AWS::RDS::DBCluster RestoreType (__added__)
* AWS::RDS::DBCluster SourceDBClusterIdentifier (__added__)
* AWS::RDS::DBCluster UseLatestRestorableTime (__added__)
* AWS::RDS::DBInstance AssociatedRoles (__added__)
* AWS::SNS::Subscription Region.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable

## Property Type Changes

* AWS::ApplicationAutoScaling::ScalableTarget.SuspendedState (__added__)
* AWS::EC2::Instance.CpuOptions (__added__)
* AWS::ECS::TaskDefinition.SystemControl (__added__)
* AWS::Elasticsearch::Domain.ZoneAwarenessConfig (__added__)
* AWS::Events::Rule.AwsVpcConfiguration (__added__)
* AWS::Events::Rule.NetworkConfiguration (__added__)
* AWS::RDS::DBCluster.DBClusterRole (__added__)
* AWS::RDS::DBInstance.DBInstanceRole (__added__)
* AWS::Cognito::UserPool.AdminCreateUserConfig UnusedAccountValidityDays.PrimitiveType (__changed__)
  * Old: Double
  * New: Integer
* AWS::Cognito::UserPool.PasswordPolicy TemporaryPasswordValidityDays.PrimitiveType (__changed__)
  * Old: Double
  * New: Integer
* AWS::DynamoDB::Table.SSESpecification KMSMasterKeyId (__added__)
* AWS::DynamoDB::Table.SSESpecification SSEType (__added__)
* AWS::EC2::ClientVpnEndpoint.TagSpecification ResourceType.Required (__changed__)
  * Old: false
  * New: true
* AWS::EC2::ClientVpnEndpoint.TagSpecification Tags.Required (__changed__)
  * Old: false
  * New: true
* AWS::EC2::Instance.Ebs KmsKeyId (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition Interactive (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition PseudoTerminal (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition SystemControls (__added__)
* AWS::ECS::TaskDefinition.LogConfiguration SecretOptions (__added__)
* AWS::ECS::TaskDefinition.Tmpfs Size.Required (__changed__)
  * Old: false
  * New: true
* AWS::Elasticsearch::Domain.ElasticsearchClusterConfig ZoneAwarenessConfig (__added__)
* AWS::Events::Rule.EcsParameters Group (__added__)
* AWS::Events::Rule.EcsParameters LaunchType (__added__)
* AWS::Events::Rule.EcsParameters NetworkConfiguration (__added__)
* AWS::Events::Rule.EcsParameters PlatformVersion (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-value


# CloudFormation Resource Specification v5.3.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Neptune::DBCluster EnableCloudwatchLogsExports (__added__)

## Property Type Changes

* AWS::AppMesh::Route.HeaderMatchMethod (__added__)
* AWS::AppMesh::Route.HttpRouteHeader (__added__)
* AWS::AppMesh::Route.MatchRange (__added__)
* AWS::AppMesh::Route.HttpRouteMatch Headers (__added__)
* AWS::AppMesh::Route.HttpRouteMatch Method (__added__)
* AWS::AppMesh::Route.HttpRouteMatch Scheme (__added__)
* AWS::AppMesh::Route.RouteSpec Priority (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value


# CloudFormation Resource Specification v5.2.0

## New Resource Types

* AWS::SSM::MaintenanceWindowTarget
* AWS::SageMaker::Workteam

## Attribute Changes


## Property Changes

* AWS::DMS::ReplicationTask CdcStartPosition (__added__)
* AWS::DMS::ReplicationTask CdcStopPosition (__added__)

## Property Type Changes

* AWS::AppSync::GraphQLApi.LogConfig ExcludeVerboseContent (__added__)


# CloudFormation Resource Specification v5.1.0

## New Resource Types

* AWS::CodeBuild::SourceCredential
* AWS::Glue::MLTransform
* AWS::LakeFormation::DataLakeSettings
* AWS::LakeFormation::Permissions
* AWS::LakeFormation::Resource
* AWS::ManagedBlockchain::Member
* AWS::ManagedBlockchain::Node

## Attribute Changes


## Property Changes

* AWS::EC2::ClientVpnEndpoint SplitTunnel (__added__)
* AWS::Greengrass::ConnectorDefinition Tags (__added__)
* AWS::Greengrass::CoreDefinition Tags (__added__)
* AWS::Greengrass::DeviceDefinition Tags (__added__)
* AWS::Greengrass::FunctionDefinition Tags (__added__)
* AWS::Greengrass::Group Tags (__added__)
* AWS::Greengrass::LoggerDefinition Tags (__added__)
* AWS::Greengrass::ResourceDefinition Tags (__added__)
* AWS::Greengrass::SubscriptionDefinition Tags (__added__)

## Property Type Changes

* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-tag.html#cfn-iotevents-input-tag-value

# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Serverless::Api AccessLogSetting (__added__)

## Property Type Changes

* AWS::Serverless::Api.AccessLogSetting (__added__)

# CloudFormation Resource Specification v5.0.0

## New Resource Types

* AWS::CodeStar::GitHubRepository

## Attribute Changes


## Property Changes

* AWS::CodeCommit::Repository Tags (__added__)
* AWS::Cognito::UserPool UserPoolAddOns (__added__)
* AWS::Cognito::UserPool VerificationMessageTemplate (__added__)
* AWS::Cognito::UserPoolClient AllowedOAuthFlows (__added__)
* AWS::Cognito::UserPoolClient AllowedOAuthFlowsUserPoolClient (__added__)
* AWS::Cognito::UserPoolClient AllowedOAuthScopes (__added__)
* AWS::Cognito::UserPoolClient AnalyticsConfiguration (__added__)
* AWS::Cognito::UserPoolClient CallbackURLs (__added__)
* AWS::Cognito::UserPoolClient DefaultRedirectURI (__added__)
* AWS::Cognito::UserPoolClient LogoutURLs (__added__)
* AWS::Cognito::UserPoolClient SupportedIdentityProviders (__added__)
* AWS::Glue::Job GlueVersion (__added__)
* AWS::Glue::Job MaxCapacity (__added__)
* AWS::Glue::Job NumberOfWorkers (__added__)
* AWS::Glue::Job WorkerType (__added__)
* AWS::SSM::MaintenanceWindowTask ServiceRoleArn.Required (__changed__)
  * Old: true
  * New: false
* AWS::SSM::MaintenanceWindowTask WindowId.Required (__changed__)
  * Old: false
  * New: true

## Property Type Changes

* AWS::Batch::JobDefinition.Device (__added__)
* AWS::Batch::JobDefinition.LinuxParameters (__added__)
* AWS::Cognito::UserPool.UserPoolAddOns (__added__)
* AWS::Cognito::UserPool.VerificationMessageTemplate (__added__)
* AWS::Cognito::UserPoolClient.AnalyticsConfiguration (__added__)
* AWS::Batch::ComputeEnvironment.ComputeResources SecurityGroupIds.Required (__changed__)
  * Old: true
  * New: false
* AWS::Batch::JobDefinition.ContainerProperties LinuxParameters (__added__)
* AWS::CodeCommit::Repository.RepositoryTrigger DestinationArn.Required (__changed__)
  * Old: false
  * New: true
* AWS::CodeCommit::Repository.RepositoryTrigger Events.Required (__changed__)
  * Old: false
  * New: true
* AWS::CodeCommit::Repository.RepositoryTrigger Name.Required (__changed__)
  * Old: false
  * New: true
* AWS::Cognito::UserPool.LambdaConfig PreTokenGeneration (__added__)
* AWS::Cognito::UserPool.LambdaConfig UserMigration (__added__)
* AWS::Glue::Job.JobCommand PythonVersion (__added__)


# CloudFormation Resource Specification v4.3.0

## New Resource Types

* AWS::IoTEvents::DetectorModel
* AWS::IoTEvents::Input

## Attribute Changes


## Property Changes

* AWS::AmazonMQ::Broker EncryptionOptions (__added__)
* AWS::Amplify::App AutoBranchCreationConfig (__added__)
* AWS::Amplify::Branch EnableAutoBuild (__added__)

## Property Type Changes

* AWS::AmazonMQ::Broker.EncryptionOptions (__added__)
* AWS::Amplify::App.AutoBranchCreationConfig (__added__)
* AWS::Amplify::App.BasicAuthConfig Password.Required (__changed__)
  * Old: true
  * New: false
* AWS::Amplify::App.BasicAuthConfig Username.Required (__changed__)
  * Old: true
  * New: false
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-tag.html#cfn-transfer-user-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-tag.html#cfn-transfer-user-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
* Tag Value.Required (__changed__)
  * Old: false
  * New: true


# CloudFormation Resource Specification v4.2.0

## New Resource Types

* AWS::Backup::BackupPlan
* AWS::Backup::BackupSelection
* AWS::Backup::BackupVault
* AWS::CloudWatch::AnomalyDetector
* AWS::Config::RemediationConfiguration
* AWS::MediaLive::Channel
* AWS::MediaLive::Input
* AWS::MediaLive::InputSecurityGroup
* AWS::SecurityHub::Hub
* AWS::ServiceCatalog::StackSetConstraint

## Attribute Changes


## Property Changes

* AWS::Amplify::App Repository.Required (__changed__)
  * Old: true
  * New: false
* AWS::ApiGatewayV2::Api Tags (__added__)
* AWS::ApiGatewayV2::DomainName Tags (__added__)
* AWS::ApiGatewayV2::Stage Tags (__added__)
* AWS::AppMesh::Mesh Tags.ItemType (__changed__)
  * Old: TagRef
  * New: Tag
* AWS::AppMesh::Route Tags.ItemType (__changed__)
  * Old: TagRef
  * New: Tag
* AWS::AppMesh::VirtualNode Tags.ItemType (__changed__)
  * Old: TagRef
  * New: Tag
* AWS::AppMesh::VirtualRouter Tags.ItemType (__changed__)
  * Old: TagRef
  * New: Tag
* AWS::AppMesh::VirtualService Tags.ItemType (__changed__)
  * Old: TagRef
  * New: Tag
* AWS::AppStream::Fleet IdleDisconnectTimeoutInSeconds (__added__)
* AWS::IoTAnalytics::Channel ChannelStorage (__added__)
* AWS::IoTAnalytics::Datastore DatastoreStorage (__added__)
* AWS::ServiceCatalog::CloudFormationProvisionedProduct ProvisioningPreferences (__added__)

## Property Type Changes

* AWS::Amplify::App.Token (__removed__)
* AWS::AppMesh::Mesh.TagRef (__removed__)
* AWS::AppMesh::Route.TagRef (__removed__)
* AWS::AppMesh::VirtualNode.TagRef (__removed__)
* AWS::AppMesh::VirtualRouter.TagRef (__removed__)
* AWS::AppMesh::VirtualService.TagRef (__removed__)
* AWS::AppMesh::VirtualNode.AwsCloudMapInstanceAttribute (__added__)
* AWS::AppMesh::VirtualNode.AwsCloudMapServiceDiscovery (__added__)
* AWS::IoTAnalytics::Channel.ChannelStorage (__added__)
* AWS::IoTAnalytics::Channel.CustomerManagedS3 (__added__)
* AWS::IoTAnalytics::Channel.ServiceManagedS3 (__added__)
* AWS::IoTAnalytics::Datastore.CustomerManagedS3 (__added__)
* AWS::IoTAnalytics::Datastore.DatastoreStorage (__added__)
* AWS::IoTAnalytics::Datastore.ServiceManagedS3 (__added__)
* AWS::ServiceCatalog::CloudFormationProvisionedProduct.ProvisioningPreferences (__added__)
* AWS::AppMesh::VirtualNode.ServiceDiscovery AWSCloudMap (__added__)
* AWS::EC2::LaunchTemplate.SpotOptions BlockDurationMinutes (__added__)
* AWS::EC2::LaunchTemplate.SpotOptions ValidUntil (__added__)
* AWS::Route53Resolver::ResolverRule.TargetAddress Port.Required (__changed__)
  * Old: true
  * New: false
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-tag.html#cfn-amplify-branch-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-tag.html#cfn-transfer-user-tag-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-tag.html#cfn-amplify-branch-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-transfer-user-tag.html#cfn-transfer-user-tag-value
* Tag Value.Required (__changed__)
  * Old: true
  * New: false



# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Serverless::Function Policies.ItemTypes (__changed__)
  * Added SAMPolicyTemplate

## Property Type Changes

* AWS::Serverless::Function.BucketSAMPT (__added__)
* AWS::Serverless::Function.CollectionSAMPT (__added__)
* AWS::Serverless::Function.DomainSAMPT (__added__)
* AWS::Serverless::Function.EmptySAMPT (__added__)
* AWS::Serverless::Function.FunctionSAMPT (__added__)
* AWS::Serverless::Function.IdentitySAMPT (__added__)
* AWS::Serverless::Function.KeySAMPT (__added__)
* AWS::Serverless::Function.LogGroupSAMPT (__added__)
* AWS::Serverless::Function.QueueSAMPT (__added__)
* AWS::Serverless::Function.SAMPolicyTemplate (__added__)
* AWS::Serverless::Function.StateMachineSAMPT (__added__)
* AWS::Serverless::Function.StreamSAMPT (__added__)
* AWS::Serverless::Function.TableSAMPT (__added__)
* AWS::Serverless::Function.TableStreamSAMPT (__added__)
* AWS::Serverless::Function.TopicSAMPT (__added__)

# CloudFormation Resource Specification v3.3.0

## New Resource Types

* AWS::EC2::CapacityReservation
* AWS::PinpointEmail::ConfigurationSet
* AWS::PinpointEmail::ConfigurationSetEventDestination
* AWS::PinpointEmail::DedicatedIpPool
* AWS::PinpointEmail::Identity
* AWS::Transfer::Server
* AWS::Transfer::User
* AWS::WAFRegional::GeoMatchSet
* AWS::WAFRegional::RateBasedRule
* AWS::WAFRegional::RegexPatternSet

## Attribute Changes


## Property Changes

* AWS::CodeBuild::Project SecondarySourceVersions (__added__)
* AWS::CodeBuild::Project SourceVersion (__added__)
* AWS::CodeCommit::Repository Code (__added__)
* AWS::ECS::TaskDefinition ProxyConfiguration (__added__)

## Property Type Changes

* AWS::CodeBuild::Project.ProjectSourceVersion (__added__)
* AWS::CodeCommit::Repository.Code (__added__)
* AWS::CodeCommit::Repository.S3 (__added__)
* AWS::ECS::TaskDefinition.ContainerDependency (__added__)
* AWS::ECS::TaskDefinition.ProxyConfiguration (__added__)
* AWS::EC2::LaunchTemplate.NetworkInterface InterfaceType (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition DependsOn (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition StartTimeout (__added__)
* AWS::ECS::TaskDefinition.ContainerDefinition StopTimeout (__added__)


# CloudFormation Resource Specification v3.0.0

## New Resource Types

* AWS::ApiGatewayV2::ApiMapping
* AWS::ApiGatewayV2::DomainName

## Attribute Changes


## Property Changes

* AWS::FSx::FileSystem Tags.ItemType (__changed__)
  * Old: TagEntry
  * New: Tag

## Property Type Changes

* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-key
* Tag Key.Required (__changed__)
  * Old: false
  * New: true
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-value
* Tag Value.Required (__changed__)
  * Old: false
  * New: true


# CloudFormation Resource Specification v2.32.0

## New Resource Types

* AWS::Greengrass::ResourceDefinition

## Attribute Changes


## Property Changes

* AWS::SSM::Parameter Tags (__added__)
* AWS::ServiceCatalog::CloudFormationProvisionedProduct Tags.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable

## Property Type Changes

* AWS::Cognito::UserPool.EmailConfiguration EmailSendingAccount (__added__)
* AWS::Greengrass::FunctionDefinition.FunctionConfiguration MemorySize.Required (__changed__)
  * Old: true
  * New: false
* AWS::Greengrass::FunctionDefinition.FunctionConfiguration Timeout.Required (__changed__)
  * Old: true
  * New: false
* AWS::Greengrass::FunctionDefinitionVersion.FunctionConfiguration MemorySize.Required (__changed__)
  * Old: true
  * New: false
* AWS::Greengrass::FunctionDefinitionVersion.FunctionConfiguration Timeout.Required (__changed__)
  * Old: true
  * New: false


# CloudFormation Resource Specification v2.30.0

## New Resource Types


## Attribute Changes


## Property Changes


## Property Type Changes

* AWS::Batch::JobDefinition.ResourceRequirement (__added__)
* AWS::Batch::JobDefinition.ContainerProperties ResourceRequirements (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
* Tag Key.Required (__changed__)
  * Old: true
  * New: false
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
* Tag Value.Required (__changed__)
  * Old: true
  * New: false


# CloudFormation Resource Specification v2.29.0

## New Resource Types

* AWS::AppMesh::Mesh
* AWS::AppMesh::Route
* AWS::AppMesh::VirtualNode
* AWS::AppMesh::VirtualRouter
* AWS::AppMesh::VirtualService

## Attribute Changes


## Property Changes

* AWS::EKS::Cluster Version.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable

## Property Type Changes

* AWS::ServiceDiscovery::Service.DnsRecord TTL.PrimitiveType (__changed__)
  * Old: String
  * New: Double
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-key
* Tag Key.Required (__changed__)
  * Old: false
  * New: true
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-value
* Tag Value.Required (__changed__)
  * Old: false
  * New: true






# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Serverless::Api TracingEnabled (__added__)
* AWS::Serverless::Function PermissionsBoundary (__added__)

## Property Type Changes

* AWS::Serverless::Function.DynamoDBEvent Enabled (__added__)
* AWS::Serverless::Function.DynamoDBEvent BatchSize.Required (__changed__)
  * Old: true
  * New: false
* AWS::Serverless::Function.KinesisEvent Enabled (__added__)
* AWS::Serverless::Function.SQSEvent Enabled (__added__)









# CloudFormation Resource Specification v2.28.0

## New Resource Types

* AWS::Greengrass::ConnectorDefinition
* AWS::Greengrass::ConnectorDefinitionVersion
* AWS::Greengrass::CoreDefinition
* AWS::Greengrass::CoreDefinitionVersion
* AWS::Greengrass::DeviceDefinition
* AWS::Greengrass::DeviceDefinitionVersion
* AWS::Greengrass::FunctionDefinition
* AWS::Greengrass::FunctionDefinitionVersion
* AWS::Greengrass::Group
* AWS::Greengrass::GroupVersion
* AWS::Greengrass::LoggerDefinition
* AWS::Greengrass::LoggerDefinitionVersion
* AWS::Greengrass::ResourceDefinitionVersion
* AWS::Greengrass::SubscriptionDefinition
* AWS::Greengrass::SubscriptionDefinitionVersion

## Attribute Changes


## Property Changes

* AWS::AppStream::Fleet Tags (__added__)
* AWS::AppStream::ImageBuilder Tags (__added__)
* AWS::AppStream::Stack Tags (__added__)
* AWS::SageMaker::NotebookInstance RootAccess (__added__)

## Property Type Changes

* AWS::CodeBuild::Project.GitSubmodulesConfig (__added__)
* AWS::CodeBuild::Project.S3LogsConfig EncryptionDisabled (__added__)
* AWS::CodeBuild::Project.Source GitSubmodulesConfig (__added__)

# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::Serverless::Application Location.PrimitiveType (__deleted__)
* AWS::Serverless::Application Location.PrimitiveTypes (__added__)

## Property Type Changes

* AWS::Serverless::Api.Auth Authorizers.Type (__deleted__)
* AWS::Serverless::Api.Auth Authorizers.PrimitiveType (__added__)

# CloudFormation Resource Specification v2.26.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::SSM::PatchBaseline Tags (__added__)
* AWS::StepFunctions::Activity Tags (__added__)
* AWS::StepFunctions::StateMachine Tags (__added__)

## Property Type Changes

* AWS::StepFunctions::Activity.TagsEntry (__added__)
* AWS::StepFunctions::StateMachine.TagsEntry (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
* Tag Key.Required (__changed__)
  * Old: true
  * New: false
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
* Tag Value.Required (__changed__)
  * Old: true
  * New: false


# CloudFormation Resource Specification v2.25.0

## New Resource Types


## Attribute Changes


## Property Changes

* AWS::ApiGateway::Authorizer Type.Required (__changed__)
  * Old: false
  * New: true
* AWS::CloudWatch::Alarm Metrics (__added__)
* AWS::EC2::VPCEndpoint VPCEndpointType (__deleted__)
* AWS::EC2::VPCEndpoint VpcEndpointType (__added__)
* AWS::ECS::Cluster Tags (__deleted__)
* AWS::ECS::Service Tags (__deleted__)
* AWS::ECS::TaskDefinition Tags (__deleted__)
* AWS::ElasticLoadBalancingV2::TargetGroup HealthCheckEnabled (__added__)
* AWS::ElasticLoadBalancingV2::TargetGroup Port.Required (__changed__)
  * Old: true
  * New: false
* AWS::ElasticLoadBalancingV2::TargetGroup Protocol.Required (__changed__)
  * Old: true
  * New: false
* AWS::ElasticLoadBalancingV2::TargetGroup VpcId.Required (__changed__)
  * Old: true
  * New: false
* AWS::SNS::Subscription Protocol.Required (__changed__)
  * Old: false
  * New: true
* AWS::SNS::Subscription TopicArn.Required (__changed__)
  * Old: false
  * New: true
* AWS::SSM::MaintenanceWindow Tags (__added__)

## Property Type Changes

* AWS::CloudWatch::Alarm.Metric (__added__)
* AWS::CloudWatch::Alarm.MetricDataQuery (__added__)
* AWS::CloudWatch::Alarm.MetricStat (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value


# CloudFormation Resource Specification v2.24.0

## New Resource Types

* AWS::ApiGatewayV2::Api
* AWS::ApiGatewayV2::Authorizer
* AWS::ApiGatewayV2::Deployment
* AWS::ApiGatewayV2::Integration
* AWS::ApiGatewayV2::IntegrationResponse
* AWS::ApiGatewayV2::Model
* AWS::ApiGatewayV2::Route
* AWS::ApiGatewayV2::RouteResponse
* AWS::ApiGatewayV2::Stage
* AWS::FSx::FileSystem
* AWS::KinesisAnalyticsV2::Application
* AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption
* AWS::KinesisAnalyticsV2::ApplicationOutput
* AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource
* AWS::RAM::ResourceShare
* AWS::RoboMaker::Fleet
* AWS::RoboMaker::Robot
* AWS::RoboMaker::RobotApplication
* AWS::RoboMaker::RobotApplicationVersion
* AWS::RoboMaker::SimulationApplication
* AWS::RoboMaker::SimulationApplicationVersion

## Attribute Changes


## Property Changes

* AWS::OpsWorksCM::Server AssociatePublicIpAddress (__added__)

## Property Type Changes

* AWS::CodeBuild::Project.FilterGroup (__added__)
* AWS::CodeBuild::Project.WebhookFilter (__added__)
* AWS::EC2::LaunchTemplate.CapacityReservationPreference (__added__)
* AWS::EC2::LaunchTemplate.CapacityReservationSpecification (__added__)
* AWS::EC2::LaunchTemplate.CapacityReservationTarget (__added__)
* AWS::EC2::LaunchTemplate.CpuOptions (__added__)
* AWS::EC2::LaunchTemplate.HibernationOptions (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateElasticInferenceAccelerator (__added__)
* AWS::EC2::LaunchTemplate.LicenseSpecification (__added__)
* AWS::CodeBuild::Project.ProjectCache Modes (__added__)
* AWS::CodeBuild::Project.ProjectTriggers FilterGroups (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData CapacityReservationSpecification (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData CpuOptions (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData ElasticInferenceAccelerators (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData HibernationOptions (__added__)
* AWS::EC2::LaunchTemplate.LaunchTemplateData LicenseSpecifications (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-key
* Tag Key.Required (__changed__)
  * Old: false
  * New: true
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-tag.html#cfn-iotanalytics-datastore-tag-value
* Tag Value.Required (__changed__)
  * Old: false
  * New: true

# Serverless Application Model (SAM) Resource Specification v2016-10-31

## New Resource Types

* AWS::Serverless::Application
* AWS::Serverless::LayerVersion

## Attribute Changes


## Property Changes

* AWS::Serverless::Api Auth (__added__)
* AWS::Serverless::Api BinaryMediaTypes (__added__)
* AWS::Serverless::Api Cors (__added__)
* AWS::Serverless::Api EndpointConfiguration (__added__)
* AWS::Serverless::Function AutoPublishAlias (__added__)
* AWS::Serverless::Function DeploymentPreference (__added__)
* AWS::Serverless::Function Layers (__added__)
* AWS::Serverless::Function ReservedConcurrentExecutions (__added__)
* AWS::Serverless::SimpleTable SSESpecification (__added__)
* AWS::Serverless::SimpleTable TableName (__added__)
* AWS::Serverless::SimpleTable Tags (__added__)

## Property Type Changes

* AWS::Serverless::Api.Auth (__added__)
* AWS::Serverless::Function.DeploymentPreference (__added__)
* AWS::Serverless::SimpleTable.SSESpecification (__added__)



# CloudFormation Resource Specification v2.21.0

## New Resource Types

* AWS::DocDB::DBCluster
* AWS::DocDB::DBClusterParameterGroup
* AWS::DocDB::DBInstance
* AWS::DocDB::DBSubnetGroup
* AWS::Lambda::LayerVersion
* AWS::Lambda::LayerVersionPermission
* AWS::OpsWorksCM::Server
* AWS::Route53Resolver::ResolverRuleAssociation

## Attribute Changes

* AWS::Route53Resolver::ResolverRule Name (__added__)

## Property Changes

* AWS::AmazonMQ::Broker Tags (__added__)
* AWS::AmazonMQ::Configuration Tags (__added__)
* AWS::ApiGateway::ApiKey Value (__added__)
* AWS::DMS::Endpoint ElasticsearchSettings (__added__)
* AWS::DMS::Endpoint KinesisSettings (__added__)
* AWS::EC2::EC2Fleet ValidFrom.PrimitiveType (__changed__)
  * Old: Integer
  * New: String
* AWS::EC2::EC2Fleet ValidUntil.PrimitiveType (__changed__)
  * Old: Integer
  * New: String
* AWS::ECS::Cluster Tags (__added__)
* AWS::ECS::Service Tags (__added__)
* AWS::ECS::TaskDefinition Tags (__added__)
* AWS::Elasticsearch::Domain NodeToNodeEncryptionOptions (__added__)
* AWS::Inspector::AssessmentTarget ResourceGroupArn.Required (__changed__)
  * Old: true
  * New: false
* AWS::RDS::DBCluster SourceRegion (__added__)
* AWS::RDS::DBInstance UseDefaultProcessorFeatures (__added__)
* AWS::ServiceCatalog::CloudFormationProvisionedProduct ProductId.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::ServiceCatalog::CloudFormationProvisionedProduct ProductName.UpdateType (__changed__)
  * Old: Immutable
  * New: Mutable
* AWS::ServiceDiscovery::Service HealthCheckCustomConfig.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable

## Property Type Changes

* AWS::AmazonMQ::Broker.TagsEntry (__added__)
* AWS::AmazonMQ::Configuration.TagsEntry (__added__)
* AWS::CodeBuild::Project.RegistryCredential (__added__)
* AWS::DMS::Endpoint.ElasticsearchSettings (__added__)
* AWS::DMS::Endpoint.KinesisSettings (__added__)
* AWS::Elasticsearch::Domain.NodeToNodeEncryptionOptions (__added__)
* AWS::CodeBuild::Project.Environment ImagePullCredentialsType (__added__)
* AWS::CodeBuild::Project.Environment RegistryCredential (__added__)
* Tag Key.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-key
* Tag Key.Required (__changed__)
  * Old: true
  * New: false
* Tag Value.Documentation (__changed__)
  * Old: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
  * New: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-tag.html#cfn-dms-endpoint-tag-value
* Tag Value.Required (__changed__)
  * Old: true
  * New: false


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

