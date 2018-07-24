using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html </remarks>
    public class AutoScalingPolicyProperty : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.IAutoScalingPolicyProperty
    {
        /// <summary>``ClusterResource.AutoScalingPolicyProperty.Constraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html#cfn-elasticmapreduce-cluster-autoscalingpolicy-constraints </remarks>
        [JsiiProperty("constraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ScalingConstraintsProperty\"}]}}", true)]
        public object Constraints
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.AutoScalingPolicyProperty.Rules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-autoscalingpolicy.html#cfn-elasticmapreduce-cluster-autoscalingpolicy-rules </remarks>
        [JsiiProperty("rules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ScalingRuleProperty\"}]}}}}]}}", true)]
        public object Rules
        {
            get;
            set;
        }
    }
}