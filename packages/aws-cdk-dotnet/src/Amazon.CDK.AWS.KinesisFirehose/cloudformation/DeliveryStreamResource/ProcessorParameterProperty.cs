using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html </remarks>
    public class ProcessorParameterProperty : DeputyBase, IProcessorParameterProperty
    {
        /// <summary>``DeliveryStreamResource.ProcessorParameterProperty.ParameterName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html#cfn-kinesisfirehose-deliverystream-processorparameter-parametername </remarks>
        [JsiiProperty("parameterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ParameterName
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ProcessorParameterProperty.ParameterValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html#cfn-kinesisfirehose-deliverystream-processorparameter-parametervalue </remarks>
        [JsiiProperty("parameterValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ParameterValue
        {
            get;
            set;
        }
    }
}