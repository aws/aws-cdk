using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationOutputResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html </remarks>
    [JsiiInterfaceProxy(typeof(IDestinationSchemaProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.DestinationSchemaProperty")]
    internal class DestinationSchemaPropertyProxy : DeputyBase, IDestinationSchemaProperty
    {
        private DestinationSchemaPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationOutputResource.DestinationSchemaProperty.RecordFormatType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html#cfn-kinesisanalytics-applicationoutput-destinationschema-recordformattype </remarks>
        [JsiiProperty("recordFormatType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RecordFormatType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}