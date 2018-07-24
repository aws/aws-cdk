using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-lambdaaction.html </remarks>
    [JsiiInterface(typeof(ILambdaActionProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.LambdaActionProperty")]
    public interface ILambdaActionProperty
    {
        /// <summary>``TopicRuleResource.LambdaActionProperty.FunctionArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-lambdaaction.html#cfn-iot-topicrule-lambdaaction-functionarn </remarks>
        [JsiiProperty("functionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object FunctionArn
        {
            get;
            set;
        }
    }
}