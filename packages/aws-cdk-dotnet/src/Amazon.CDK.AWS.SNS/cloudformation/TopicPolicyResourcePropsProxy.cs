using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SNS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html </remarks>
    [JsiiInterfaceProxy(typeof(ITopicPolicyResourceProps), "@aws-cdk/aws-sns.cloudformation.TopicPolicyResourceProps")]
    internal class TopicPolicyResourcePropsProxy : DeputyBase, ITopicPolicyResourceProps
    {
        private TopicPolicyResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SNS::TopicPolicy.PolicyDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-policydocument </remarks>
        [JsiiProperty("policyDocument", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::SNS::TopicPolicy.Topics``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-topics </remarks>
        [JsiiProperty("topics", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Topics
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}