using Amazon.CDK;
using Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html </remarks>
    [JsiiInterface(typeof(IScalingPolicyResourceProps), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResourceProps")]
    public interface IScalingPolicyResourceProps
    {
        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PolicyName
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.PolicyType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policytype </remarks>
        [JsiiProperty("policyType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PolicyType
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.ResourceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-resourceid </remarks>
        [JsiiProperty("resourceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourceId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.ScalableDimension``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalabledimension </remarks>
        [JsiiProperty("scalableDimension", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScalableDimension
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.ScalingTargetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalingtargetid </remarks>
        [JsiiProperty("scalingTargetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScalingTargetId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.ServiceNamespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-servicenamespace </remarks>
        [JsiiProperty("serviceNamespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ServiceNamespace
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.StepScalingPolicyConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration </remarks>
        [JsiiProperty("stepScalingPolicyConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.StepScalingPolicyConfigurationProperty\"}]},\"optional\":true}")]
        object StepScalingPolicyConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::ApplicationAutoScaling::ScalingPolicy.TargetTrackingScalingPolicyConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration </remarks>
        [JsiiProperty("targetTrackingScalingPolicyConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty\"}]},\"optional\":true}")]
        object TargetTrackingScalingPolicyConfiguration
        {
            get;
            set;
        }
    }
}