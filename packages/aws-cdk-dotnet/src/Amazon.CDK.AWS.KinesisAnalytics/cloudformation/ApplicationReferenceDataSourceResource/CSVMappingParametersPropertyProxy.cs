using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(ICSVMappingParametersProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.CSVMappingParametersProperty")]
    internal class CSVMappingParametersPropertyProxy : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource.ICSVMappingParametersProperty
    {
        private CSVMappingParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationReferenceDataSourceResource.CSVMappingParametersProperty.RecordColumnDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordcolumndelimiter </remarks>
        [JsiiProperty("recordColumnDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordColumnDelimiter
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationReferenceDataSourceResource.CSVMappingParametersProperty.RecordRowDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordrowdelimiter </remarks>
        [JsiiProperty("recordRowDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordRowDelimiter
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}