using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SQS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-policy.html </remarks>
    [JsiiInterfaceProxy(typeof(IQueuePolicyResourceProps), "@aws-cdk/aws-sqs.cloudformation.QueuePolicyResourceProps")]
    internal class QueuePolicyResourcePropsProxy : DeputyBase, IQueuePolicyResourceProps
    {
        private QueuePolicyResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SQS::QueuePolicy.PolicyDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-policy.html#cfn-sqs-queuepolicy-policydoc </remarks>
        [JsiiProperty("policyDocument", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::SQS::QueuePolicy.Queues``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-policy.html#cfn-sqs-queuepolicy-queues </remarks>
        [JsiiProperty("queues", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Queues
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}