using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html </remarks>
    public class MappingParametersProperty : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.IMappingParametersProperty
    {
        /// <summary>``ApplicationResource.MappingParametersProperty.CSVMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-csvmappingparameters </remarks>
        [JsiiProperty("csvMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.CSVMappingParametersProperty\"}]},\"optional\":true}", true)]
        public object CsvMappingParameters
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.MappingParametersProperty.JSONMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-jsonmappingparameters </remarks>
        [JsiiProperty("jsonMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.JSONMappingParametersProperty\"}]},\"optional\":true}", true)]
        public object JsonMappingParameters
        {
            get;
            set;
        }
    }
}