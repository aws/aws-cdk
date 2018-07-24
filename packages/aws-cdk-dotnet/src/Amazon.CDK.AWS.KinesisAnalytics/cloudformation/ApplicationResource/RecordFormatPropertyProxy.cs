using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html </remarks>
    [JsiiInterfaceProxy(typeof(IRecordFormatProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.RecordFormatProperty")]
    internal class RecordFormatPropertyProxy : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.IRecordFormatProperty
    {
        private RecordFormatPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.RecordFormatProperty.MappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-mappingparameters </remarks>
        [JsiiProperty("mappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.MappingParametersProperty\"}]},\"optional\":true}")]
        public virtual object MappingParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationResource.RecordFormatProperty.RecordFormatType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-recordformattype </remarks>
        [JsiiProperty("recordFormatType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordFormatType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}