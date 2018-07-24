using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// To specify how AWS CloudFormation handles rolling updates for an Auto Scaling group, use the AutoScalingRollingUpdate
    /// policy. Rolling updates enable you to specify whether AWS CloudFormation updates instances that are in an Auto Scaling
    /// group in batches or all at once.
    /// </summary>
    [JsiiInterface(typeof(IAutoScalingRollingUpdate), "@aws-cdk/cdk.AutoScalingRollingUpdate")]
    public interface IAutoScalingRollingUpdate
    {
        /// <summary>Specifies the maximum number of instances that AWS CloudFormation updates.</summary>
        [JsiiProperty("maxBatchSize", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MaxBatchSize
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies the minimum number of instances that must be in service within the Auto Scaling group while AWS
        /// CloudFormation updates old instances.
        /// </summary>
        [JsiiProperty("minInstancesInService", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MinInstancesInService
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies the percentage of instances in an Auto Scaling rolling update that must signal success for an update to succeed.
        /// You can specify a value from 0 to 100. AWS CloudFormation rounds to the nearest tenth of a percent. For example, if you
        /// update five instances with a minimum successful percentage of 50, three instances must signal success.
        /// 
        /// If an instance doesn't send a signal within the time specified in the PauseTime property, AWS CloudFormation assumes
        /// that the instance wasn't updated.
        /// 
        /// If you specify this property, you must also enable the WaitOnResourceSignals and PauseTime properties.
        /// </summary>
        [JsiiProperty("minSuccessfulInstancesPercent", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MinSuccessfulInstancesPercent
        {
            get;
            set;
        }

        /// <summary>
        /// The amount of time that AWS CloudFormation pauses after making a change to a batch of instances to give those instances
        /// time to start software applications. For example, you might need to specify PauseTime when scaling up the number of
        /// instances in an Auto Scaling group.
        /// 
        /// If you enable the WaitOnResourceSignals property, PauseTime is the amount of time that AWS CloudFormation should wait
        /// for the Auto Scaling group to receive the required number of valid signals from added or replaced instances. If the
        /// PauseTime is exceeded before the Auto Scaling group receives the required number of signals, the update fails. For best
        /// results, specify a time period that gives your applications sufficient time to get started. If the update needs to be
        /// rolled back, a short PauseTime can cause the rollback to fail.
        /// 
        /// Specify PauseTime in the ISO8601 duration format (in the format PT#H#M#S, where each # is the number of hours, minutes,
        /// and seconds, respectively). The maximum PauseTime is one hour (PT1H).
        /// </summary>
        [JsiiProperty("pauseTime", "{\"primitive\":\"string\",\"optional\":true}")]
        string PauseTime
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies the Auto Scaling processes to suspend during a stack update. Suspending processes prevents Auto Scaling from
        /// interfering with a stack update. For example, you can suspend alarming so that Auto Scaling doesn't execute scaling
        /// policies associated with an alarm. For valid values, see the ScalingProcesses.member.N parameter for the SuspendProcesses
        /// action in the Auto Scaling API Reference.
        /// </summary>
        [JsiiProperty("suspendProcesses", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        string[] SuspendProcesses
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies whether the Auto Scaling group waits on signals from new instances during an update. Use this property to
        /// ensure that instances have completed installing and configuring applications before the Auto Scaling group update proceeds.
        /// AWS CloudFormation suspends the update of an Auto Scaling group after new EC2 instances are launched into the group.
        /// AWS CloudFormation must receive a signal from each new instance within the specified PauseTime before continuing the update.
        /// To signal the Auto Scaling group, use the cfn-signal helper script or SignalResource API.
        /// 
        /// To have instances wait for an Elastic Load Balancing health check before they signal success, add a health-check
        /// verification by using the cfn-init helper script. For an example, see the verify_instance_health command in the Auto Scaling
        /// rolling updates sample template.
        /// </summary>
        [JsiiProperty("waitOnResourceSignals", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? WaitOnResourceSignals
        {
            get;
            set;
        }
    }
}