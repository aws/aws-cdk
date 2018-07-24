using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalableTargetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html </remarks>
    [JsiiInterfaceProxy(typeof(IScheduledActionProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResource.ScheduledActionProperty")]
    internal class ScheduledActionPropertyProxy : DeputyBase, IScheduledActionProperty
    {
        private ScheduledActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalableTargetResource.ScheduledActionProperty.EndTime``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-endtime </remarks>
        [JsiiProperty("endTime", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"primitive\":\"date\"}]},\"optional\":true}")]
        public virtual object EndTime
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalableTargetResource.ScheduledActionProperty.ScalableTargetAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scalabletargetaction </remarks>
        [JsiiProperty("scalableTargetAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResource.ScalableTargetActionProperty\"}]},\"optional\":true}")]
        public virtual object ScalableTargetAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalableTargetResource.ScheduledActionProperty.Schedule``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-schedule </remarks>
        [JsiiProperty("schedule", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Schedule
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalableTargetResource.ScheduledActionProperty.ScheduledActionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scheduledactionname </remarks>
        [JsiiProperty("scheduledActionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ScheduledActionName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalableTargetResource.ScheduledActionProperty.StartTime``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-starttime </remarks>
        [JsiiProperty("startTime", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"primitive\":\"date\"}]},\"optional\":true}")]
        public virtual object StartTime
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}