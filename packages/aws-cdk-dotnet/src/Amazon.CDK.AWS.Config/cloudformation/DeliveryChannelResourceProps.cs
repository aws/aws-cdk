using Amazon.CDK;
using Amazon.CDK.AWS.Config.cloudformation.DeliveryChannelResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html </remarks>
    public class DeliveryChannelResourceProps : DeputyBase, IDeliveryChannelResourceProps
    {
        /// <summary>``AWS::Config::DeliveryChannel.S3BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3bucketname </remarks>
        [JsiiProperty("s3BucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object S3BucketName
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::DeliveryChannel.ConfigSnapshotDeliveryProperties``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties </remarks>
        [JsiiProperty("configSnapshotDeliveryProperties", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-config.cloudformation.DeliveryChannelResource.ConfigSnapshotDeliveryPropertiesProperty\"}]},\"optional\":true}", true)]
        public object ConfigSnapshotDeliveryProperties
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::DeliveryChannel.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-name </remarks>
        [JsiiProperty("deliveryChannelName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DeliveryChannelName
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::DeliveryChannel.S3KeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3keyprefix </remarks>
        [JsiiProperty("s3KeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object S3KeyPrefix
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::DeliveryChannel.SnsTopicARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-snstopicarn </remarks>
        [JsiiProperty("snsTopicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SnsTopicArn
        {
            get;
            set;
        }
    }
}