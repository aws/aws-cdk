using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalingInstructionProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ScalingInstructionProperty")]
    internal class ScalingInstructionPropertyProxy : DeputyBase, IScalingInstructionProperty
    {
        private ScalingInstructionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.MaxCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-maxcapacity </remarks>
        [JsiiProperty("maxCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MaxCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.MinCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-mincapacity </remarks>
        [JsiiProperty("minCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MinCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.ResourceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-resourceid </remarks>
        [JsiiProperty("resourceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ResourceId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.ScalableDimension``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-scalabledimension </remarks>
        [JsiiProperty("scalableDimension", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ScalableDimension
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.ServiceNamespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-servicenamespace </remarks>
        [JsiiProperty("serviceNamespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ServiceNamespace
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ScalingInstructionProperty.TargetTrackingConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-scalinginstruction.html#cfn-autoscalingplans-scalingplan-scalinginstruction-targettrackingconfigurations </remarks>
        [JsiiProperty("targetTrackingConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.TargetTrackingConfigurationProperty\"}]}}}}]}}")]
        public virtual object TargetTrackingConfigurations
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}