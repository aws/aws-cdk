using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.AutoScalingGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html </remarks>
    [JsiiInterface(typeof(ILifecycleHookSpecificationProperty), "@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.LifecycleHookSpecificationProperty")]
    public interface ILifecycleHookSpecificationProperty
    {
        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.DefaultResult``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-defaultresult </remarks>
        [JsiiProperty("defaultResult", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DefaultResult
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.HeartbeatTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-heartbeattimeout </remarks>
        [JsiiProperty("heartbeatTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HeartbeatTimeout
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.LifecycleHookName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecyclehookname </remarks>
        [JsiiProperty("lifecycleHookName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LifecycleHookName
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.LifecycleTransition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecycletransition </remarks>
        [JsiiProperty("lifecycleTransition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LifecycleTransition
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.NotificationMetadata``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationmetadata </remarks>
        [JsiiProperty("notificationMetadata", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NotificationMetadata
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.NotificationTargetARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationtargetarn </remarks>
        [JsiiProperty("notificationTargetArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NotificationTargetArn
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.LifecycleHookSpecificationProperty.RoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RoleArn
        {
            get;
            set;
        }
    }
}