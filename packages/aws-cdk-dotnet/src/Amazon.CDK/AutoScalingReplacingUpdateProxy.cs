using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Specifies whether an Auto Scaling group and the instances it contains are replaced during an update. During replacement,
    /// AWS CloudFormation retains the old group until it finishes creating the new one. If the update fails, AWS CloudFormation
    /// can roll back to the old Auto Scaling group and delete the new Auto Scaling group.
    /// 
    /// While AWS CloudFormation creates the new group, it doesn't detach or attach any instances. After successfully creating
    /// the new Auto Scaling group, AWS CloudFormation deletes the old Auto Scaling group during the cleanup process.
    /// 
    /// When you set the WillReplace parameter, remember to specify a matching CreationPolicy. If the minimum number of
    /// instances (specified by the MinSuccessfulInstancesPercent property) don't signal success within the Timeout period
    /// (specified in the CreationPolicy policy), the replacement update fails and AWS CloudFormation rolls back to the old
    /// Auto Scaling group.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IAutoScalingReplacingUpdate), "@aws-cdk/cdk.AutoScalingReplacingUpdate")]
    internal class AutoScalingReplacingUpdateProxy : DeputyBase, IAutoScalingReplacingUpdate
    {
        private AutoScalingReplacingUpdateProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("willReplace", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? WillReplace
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}