using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Use the UpdatePolicy attribute to specify how AWS CloudFormation handles updates to the AWS::AutoScaling::AutoScalingGroup
    /// resource. AWS CloudFormation invokes one of three update policies depending on the type of change you make or whether a
    /// scheduled action is associated with the Auto Scaling group.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IUpdatePolicy), "@aws-cdk/cdk.UpdatePolicy")]
    internal class UpdatePolicyProxy : DeputyBase, IUpdatePolicy
    {
        private UpdatePolicyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Specifies whether an Auto Scaling group and the instances it contains are replaced during an update. During replacement,
        /// AWS CloudFormation retains the old group until it finishes creating the new one. If the update fails, AWS CloudFormation
        /// can roll back to the old Auto Scaling group and delete the new Auto Scaling group.
        /// </summary>
        [JsiiProperty("autoScalingReplacingUpdate", "{\"fqn\":\"@aws-cdk/cdk.AutoScalingReplacingUpdate\",\"optional\":true}")]
        public virtual IAutoScalingReplacingUpdate AutoScalingReplacingUpdate
        {
            get => GetInstanceProperty<IAutoScalingReplacingUpdate>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// To specify how AWS CloudFormation handles rolling updates for an Auto Scaling group, use the AutoScalingRollingUpdate
        /// policy. Rolling updates enable you to specify whether AWS CloudFormation updates instances that are in an Auto Scaling
        /// group in batches or all at once.
        /// </summary>
        [JsiiProperty("autoScalingRollingUpdate", "{\"fqn\":\"@aws-cdk/cdk.AutoScalingRollingUpdate\",\"optional\":true}")]
        public virtual IAutoScalingRollingUpdate AutoScalingRollingUpdate
        {
            get => GetInstanceProperty<IAutoScalingRollingUpdate>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// To specify how AWS CloudFormation handles updates for the MinSize, MaxSize, and DesiredCapacity properties when
        /// the AWS::AutoScaling::AutoScalingGroup resource has an associated scheduled action, use the AutoScalingScheduledAction
        /// policy.
        /// </summary>
        [JsiiProperty("autoScalingScheduledAction", "{\"fqn\":\"@aws-cdk/cdk.AutoScalingScheduledAction\",\"optional\":true}")]
        public virtual IAutoScalingScheduledAction AutoScalingScheduledAction
        {
            get => GetInstanceProperty<IAutoScalingScheduledAction>();
            set => SetInstanceProperty(value);
        }
    }
}