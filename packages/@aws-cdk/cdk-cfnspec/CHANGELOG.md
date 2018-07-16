
# CloudFormation Resource Specification v2.5.0

## New Resource Types

* AWS::AmazonMQ::Broker
* AWS::AmazonMQ::Configuration
* AWS::CodePipeline::Webhook
* AWS::Config::AggregationAuthorization
* AWS::Config::ConfigurationAggregator
* AWS::EC2::VPCEndpointConnectionNotification
* AWS::SSM::ResourceDataSync
* AWS::SageMaker::Endpoint
* AWS::SageMaker::EndpointConfig
* AWS::SageMaker::Model
* AWS::SageMaker::NotebookInstance
* AWS::SageMaker::NotebookInstanceLifecycleConfig

## Property Changes

* AWS::AppSync::DataSource HttpConfig (__added__)
* AWS::EC2::VPCEndpoint IsPrivateDnsEnabled (__added__)
* AWS::EC2::VPCEndpoint SecurityGroupIds (__added__)
* AWS::EC2::VPCEndpoint SubnetIds (__added__)
* AWS::EC2::VPCEndpoint VPCEndpointType (__added__)
* AWS::EC2::VPCEndpoint RouteTableIds.DuplicatesAllowed (__deleted__)
* AWS::Neptune::DBInstance DBSubnetGroupName.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::ServiceDiscovery::Service HealthCheckCustomConfig (__added__)

## Property Type Changes

* AWS::AppSync::DataSource.HttpConfig (__added__)
* AWS::ServiceDiscovery::Service.HealthCheckCustomConfig (__added__)
* AWS::CloudFront::Distribution.CacheBehavior FieldLevelEncryptionId (__added__)
* AWS::CloudFront::Distribution.DefaultCacheBehavior FieldLevelEncryptionId (__added__)
* AWS::CodeBuild::Project.Environment Certificate (__added__)
* AWS::CodeBuild::Project.Source ReportBuildStatus (__added__)
* AWS::ServiceDiscovery::Service.DnsConfig RoutingPolicy (__added__)
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


# CloudFormation Resource Specification v2.5.0

## New Resource Types

* AWS::AmazonMQ::Broker
* AWS::AmazonMQ::Configuration
* AWS::CodePipeline::Webhook
* AWS::Config::AggregationAuthorization
* AWS::Config::ConfigurationAggregator
* AWS::EC2::VPCEndpointConnectionNotification
* AWS::SSM::ResourceDataSync
* AWS::SageMaker::Endpoint
* AWS::SageMaker::EndpointConfig
* AWS::SageMaker::Model
* AWS::SageMaker::NotebookInstance
* AWS::SageMaker::NotebookInstanceLifecycleConfig

## Property Changes

* AWS::AppSync::DataSource HttpConfig (__added__)
* AWS::EC2::VPCEndpoint IsPrivateDnsEnabled (__added__)
* AWS::EC2::VPCEndpoint SecurityGroupIds (__added__)
* AWS::EC2::VPCEndpoint SubnetIds (__added__)
* AWS::EC2::VPCEndpoint VPCEndpointType (__added__)
* AWS::EC2::VPCEndpoint RouteTableIds.DuplicatesAllowed (__deleted__)
* AWS::Neptune::DBInstance DBSubnetGroupName.UpdateType (__changed__)
  * Old: Mutable
  * New: Immutable
* AWS::ServiceDiscovery::Service HealthCheckCustomConfig (__added__)

## Property Type Changes

* AWS::AppSync::DataSource.HttpConfig (__added__)
* AWS::ServiceDiscovery::Service.HealthCheckCustomConfig (__added__)
* AWS::CloudFront::Distribution.CacheBehavior FieldLevelEncryptionId (__added__)
* AWS::CloudFront::Distribution.DefaultCacheBehavior FieldLevelEncryptionId (__added__)
* AWS::CodeBuild::Project.Environment Certificate (__added__)
* AWS::CodeBuild::Project.Source ReportBuildStatus (__added__)
* AWS::ServiceDiscovery::Service.DnsConfig RoutingPolicy (__added__)
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

