using Amazon.CDK;
using Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalingPlanResourceProps), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResourceProps")]
    internal class ScalingPlanResourcePropsProxy : DeputyBase, IScalingPlanResourceProps
    {
        private ScalingPlanResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::AutoScalingPlans::ScalingPlan.ApplicationSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html#cfn-autoscalingplans-scalingplan-applicationsource </remarks>
        [JsiiProperty("applicationSource", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ApplicationSourceProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ApplicationSource
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AutoScalingPlans::ScalingPlan.ScalingInstructions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html#cfn-autoscalingplans-scalingplan-scalinginstructions </remarks>
        [JsiiProperty("scalingInstructions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ScalingInstructionProperty\"}]}}}}]}}")]
        public virtual object ScalingInstructions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}