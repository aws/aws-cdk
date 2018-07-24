using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html </remarks>
    public class InputProcessingConfigurationProperty : DeputyBase, IInputProcessingConfigurationProperty
    {
        /// <summary>``ApplicationResource.InputProcessingConfigurationProperty.InputLambdaProcessor``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html#cfn-kinesisanalytics-application-inputprocessingconfiguration-inputlambdaprocessor </remarks>
        [JsiiProperty("inputLambdaProcessor", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputLambdaProcessorProperty\"}]},\"optional\":true}", true)]
        public object InputLambdaProcessor
        {
            get;
            set;
        }
    }
}