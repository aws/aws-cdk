using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html </remarks>
    public class InputProperty : DeputyBase, IInputProperty
    {
        /// <summary>``ApplicationResource.InputProperty.InputParallelism``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputparallelism </remarks>
        [JsiiProperty("inputParallelism", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputParallelismProperty\"}]},\"optional\":true}", true)]
        public object InputParallelism
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputProperty.InputProcessingConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputprocessingconfiguration </remarks>
        [JsiiProperty("inputProcessingConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputProcessingConfigurationProperty\"}]},\"optional\":true}", true)]
        public object InputProcessingConfiguration
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputProperty.InputSchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputschema </remarks>
        [JsiiProperty("inputSchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputSchemaProperty\"}]}}", true)]
        public object InputSchema
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputProperty.KinesisFirehoseInput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisfirehoseinput </remarks>
        [JsiiProperty("kinesisFirehoseInput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.KinesisFirehoseInputProperty\"}]},\"optional\":true}", true)]
        public object KinesisFirehoseInput
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputProperty.KinesisStreamsInput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisstreamsinput </remarks>
        [JsiiProperty("kinesisStreamsInput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.KinesisStreamsInputProperty\"}]},\"optional\":true}", true)]
        public object KinesisStreamsInput
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.InputProperty.NamePrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-nameprefix </remarks>
        [JsiiProperty("namePrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object NamePrefix
        {
            get;
            set;
        }
    }
}