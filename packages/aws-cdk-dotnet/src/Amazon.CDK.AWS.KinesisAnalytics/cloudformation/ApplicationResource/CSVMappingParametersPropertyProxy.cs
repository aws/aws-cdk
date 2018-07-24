using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(ICSVMappingParametersProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.CSVMappingParametersProperty")]
    internal class CSVMappingParametersPropertyProxy : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.ICSVMappingParametersProperty
    {
        private CSVMappingParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.CSVMappingParametersProperty.RecordColumnDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordcolumndelimiter </remarks>
        [JsiiProperty("recordColumnDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordColumnDelimiter
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationResource.CSVMappingParametersProperty.RecordRowDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordrowdelimiter </remarks>
        [JsiiProperty("recordRowDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordRowDelimiter
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}