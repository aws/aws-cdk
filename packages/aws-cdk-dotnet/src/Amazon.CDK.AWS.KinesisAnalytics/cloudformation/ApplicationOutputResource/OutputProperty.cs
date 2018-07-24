using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationOutputResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html </remarks>
    public class OutputProperty : DeputyBase, IOutputProperty
    {
        /// <summary>``ApplicationOutputResource.OutputProperty.DestinationSchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-destinationschema </remarks>
        [JsiiProperty("destinationSchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.DestinationSchemaProperty\"}]}}", true)]
        public object DestinationSchema
        {
            get;
            set;
        }

        /// <summary>``ApplicationOutputResource.OutputProperty.KinesisFirehoseOutput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisfirehoseoutput </remarks>
        [JsiiProperty("kinesisFirehoseOutput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.KinesisFirehoseOutputProperty\"}]},\"optional\":true}", true)]
        public object KinesisFirehoseOutput
        {
            get;
            set;
        }

        /// <summary>``ApplicationOutputResource.OutputProperty.KinesisStreamsOutput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisstreamsoutput </remarks>
        [JsiiProperty("kinesisStreamsOutput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.KinesisStreamsOutputProperty\"}]},\"optional\":true}", true)]
        public object KinesisStreamsOutput
        {
            get;
            set;
        }

        /// <summary>``ApplicationOutputResource.OutputProperty.LambdaOutput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-lambdaoutput </remarks>
        [JsiiProperty("lambdaOutput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.LambdaOutputProperty\"}]},\"optional\":true}", true)]
        public object LambdaOutput
        {
            get;
            set;
        }

        /// <summary>``ApplicationOutputResource.OutputProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Name
        {
            get;
            set;
        }
    }
}