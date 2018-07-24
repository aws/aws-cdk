using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html </remarks>
    public class CSVMappingParametersProperty : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.ICSVMappingParametersProperty
    {
        /// <summary>``ApplicationResource.CSVMappingParametersProperty.RecordColumnDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordcolumndelimiter </remarks>
        [JsiiProperty("recordColumnDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RecordColumnDelimiter
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.CSVMappingParametersProperty.RecordRowDelimiter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordrowdelimiter </remarks>
        [JsiiProperty("recordRowDelimiter", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RecordRowDelimiter
        {
            get;
            set;
        }
    }
}