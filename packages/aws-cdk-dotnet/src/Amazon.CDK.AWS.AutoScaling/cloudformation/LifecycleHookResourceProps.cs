using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html </remarks>
    public class LifecycleHookResourceProps : DeputyBase, ILifecycleHookResourceProps
    {
        /// <summary>``AWS::AutoScaling::LifecycleHook.AutoScalingGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-autoscalinggroupname </remarks>
        [JsiiProperty("autoScalingGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object AutoScalingGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.LifecycleTransition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-lifecycletransition </remarks>
        [JsiiProperty("lifecycleTransition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object LifecycleTransition
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.DefaultResult``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-defaultresult </remarks>
        [JsiiProperty("defaultResult", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DefaultResult
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.HeartbeatTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-heartbeattimeout </remarks>
        [JsiiProperty("heartbeatTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object HeartbeatTimeout
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.LifecycleHookName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecyclehookname </remarks>
        [JsiiProperty("lifecycleHookName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LifecycleHookName
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.NotificationMetadata``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-notificationmetadata </remarks>
        [JsiiProperty("notificationMetadata", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NotificationMetadata
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.NotificationTargetARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-notificationtargetarn </remarks>
        [JsiiProperty("notificationTargetArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NotificationTargetArn
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::LifecycleHook.RoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#cfn-as-lifecyclehook-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RoleArn
        {
            get;
            set;
        }
    }
}