using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IInputProcessingConfigurationProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputProcessingConfigurationProperty")]
    internal class InputProcessingConfigurationPropertyProxy : DeputyBase, IInputProcessingConfigurationProperty
    {
        private InputProcessingConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.InputProcessingConfigurationProperty.InputLambdaProcessor``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html#cfn-kinesisanalytics-application-inputprocessingconfiguration-inputlambdaprocessor </remarks>
        [JsiiProperty("inputLambdaProcessor", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputLambdaProcessorProperty\"}]},\"optional\":true}")]
        public virtual object InputLambdaProcessor
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}