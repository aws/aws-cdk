using Amazon.CDK;
using Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html </remarks>
    public class ScalingPlanResourceProps : DeputyBase, IScalingPlanResourceProps
    {
        /// <summary>``AWS::AutoScalingPlans::ScalingPlan.ApplicationSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html#cfn-autoscalingplans-scalingplan-applicationsource </remarks>
        [JsiiProperty("applicationSource", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ApplicationSourceProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ApplicationSource
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScalingPlans::ScalingPlan.ScalingInstructions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html#cfn-autoscalingplans-scalingplan-scalinginstructions </remarks>
        [JsiiProperty("scalingInstructions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ScalingInstructionProperty\"}]}}}}]}}", true)]
        public object ScalingInstructions
        {
            get;
            set;
        }
    }
}