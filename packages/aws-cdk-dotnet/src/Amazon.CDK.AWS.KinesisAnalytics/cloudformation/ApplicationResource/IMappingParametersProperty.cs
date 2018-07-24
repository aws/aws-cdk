using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html </remarks>
    [JsiiInterface(typeof(IMappingParametersProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.MappingParametersProperty")]
    public interface IMappingParametersProperty
    {
        /// <summary>``ApplicationResource.MappingParametersProperty.CSVMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-csvmappingparameters </remarks>
        [JsiiProperty("csvMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.CSVMappingParametersProperty\"}]},\"optional\":true}")]
        object CsvMappingParameters
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.MappingParametersProperty.JSONMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-jsonmappingparameters </remarks>
        [JsiiProperty("jsonMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.JSONMappingParametersProperty\"}]},\"optional\":true}")]
        object JsonMappingParameters
        {
            get;
            set;
        }
    }
}