using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.ConfigRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html </remarks>
    [JsiiInterface(typeof(ISourceDetailProperty), "@aws-cdk/aws-config.cloudformation.ConfigRuleResource.SourceDetailProperty")]
    public interface ISourceDetailProperty
    {
        /// <summary>``ConfigRuleResource.SourceDetailProperty.EventSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-eventsource </remarks>
        [JsiiProperty("eventSource", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object EventSource
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.SourceDetailProperty.MaximumExecutionFrequency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-sourcedetail-maximumexecutionfrequency </remarks>
        [JsiiProperty("maximumExecutionFrequency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MaximumExecutionFrequency
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.SourceDetailProperty.MessageType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-messagetype </remarks>
        [JsiiProperty("messageType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MessageType
        {
            get;
            set;
        }
    }
}