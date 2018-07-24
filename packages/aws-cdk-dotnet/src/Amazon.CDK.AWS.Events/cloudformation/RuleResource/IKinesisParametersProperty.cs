using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-kinesisparameters.html </remarks>
    [JsiiInterface(typeof(IKinesisParametersProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.KinesisParametersProperty")]
    public interface IKinesisParametersProperty
    {
        /// <summary>``RuleResource.KinesisParametersProperty.PartitionKeyPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-kinesisparameters.html#cfn-events-rule-kinesisparameters-partitionkeypath </remarks>
        [JsiiProperty("partitionKeyPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PartitionKeyPath
        {
            get;
            set;
        }
    }
}