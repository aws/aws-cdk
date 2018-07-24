using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.ConfigRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html </remarks>
    public class SourceDetailProperty : DeputyBase, ISourceDetailProperty
    {
        /// <summary>``ConfigRuleResource.SourceDetailProperty.EventSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-eventsource </remarks>
        [JsiiProperty("eventSource", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object EventSource
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.SourceDetailProperty.MaximumExecutionFrequency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-sourcedetail-maximumexecutionfrequency </remarks>
        [JsiiProperty("maximumExecutionFrequency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaximumExecutionFrequency
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.SourceDetailProperty.MessageType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-messagetype </remarks>
        [JsiiProperty("messageType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object MessageType
        {
            get;
            set;
        }
    }
}