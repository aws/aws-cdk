using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html </remarks>
    [JsiiInterface(typeof(IAutoScalingPolicyProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.AutoScalingPolicyProperty")]
    public interface IAutoScalingPolicyProperty
    {
        /// <summary>``InstanceGroupConfigResource.AutoScalingPolicyProperty.Constraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-constraints </remarks>
        [JsiiProperty("constraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingConstraintsProperty\"}]}}")]
        object Constraints
        {
            get;
            set;
        }

        /// <summary>``InstanceGroupConfigResource.AutoScalingPolicyProperty.Rules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-rules </remarks>
        [JsiiProperty("rules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingRuleProperty\"}]}}}}]}}")]
        object Rules
        {
            get;
            set;
        }
    }
}