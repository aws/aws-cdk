using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(IMappingParametersProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.MappingParametersProperty")]
    internal class MappingParametersPropertyProxy : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.IMappingParametersProperty
    {
        private MappingParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.MappingParametersProperty.CSVMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-csvmappingparameters </remarks>
        [JsiiProperty("csvMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.CSVMappingParametersProperty\"}]},\"optional\":true}")]
        public virtual object CsvMappingParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationResource.MappingParametersProperty.JSONMappingParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-jsonmappingparameters </remarks>
        [JsiiProperty("jsonMappingParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.JSONMappingParametersProperty\"}]},\"optional\":true}")]
        public virtual object JsonMappingParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}