using Amazon.CDK;
using Amazon.CDK.AWS.Kinesis.cloudformation.StreamResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html </remarks>
    public class StreamResourceProps : DeputyBase, IStreamResourceProps
    {
        /// <summary>``AWS::Kinesis::Stream.ShardCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-shardcount </remarks>
        [JsiiProperty("shardCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ShardCount
        {
            get;
            set;
        }

        /// <summary>``AWS::Kinesis::Stream.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-name </remarks>
        [JsiiProperty("streamName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object StreamName
        {
            get;
            set;
        }

        /// <summary>``AWS::Kinesis::Stream.RetentionPeriodHours``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-retentionperiodhours </remarks>
        [JsiiProperty("retentionPeriodHours", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RetentionPeriodHours
        {
            get;
            set;
        }

        /// <summary>``AWS::Kinesis::Stream.StreamEncryption``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streamencryption </remarks>
        [JsiiProperty("streamEncryption", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesis.cloudformation.StreamResource.StreamEncryptionProperty\"}]},\"optional\":true}", true)]
        public object StreamEncryption
        {
            get;
            set;
        }

        /// <summary>``AWS::Kinesis::Stream.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }
    }
}