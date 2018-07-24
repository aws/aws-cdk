using Amazon.CDK;
using Amazon.CDK.AWS.Events.cloudformation.RuleResource;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiInterfaceProxy(typeof(IEventRuleTarget), "@aws-cdk/aws-events.EventRuleTarget")]
    internal class EventRuleTargetProxy : DeputyBase, IEventRuleTarget
    {
        private EventRuleTargetProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// A unique, user-defined identifier for the target. Acceptable values
        /// include alphanumeric characters, periods (.), hyphens (-), and
        /// underscores (_).
        /// </summary>
        [JsiiProperty("id", "{\"primitive\":\"string\"}")]
        public virtual string Id
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The Amazon Resource Name (ARN) of the target.</summary>
        [JsiiProperty("arn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn Arn
        {
            get => GetInstanceProperty<Arn>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The Amazon Resource Name (ARN) of the AWS Identity and Access Management
        /// (IAM) role to use for this target when the rule is triggered. If one rule
        /// triggers multiple targets, you can use a different IAM role for each
        /// target.
        /// </summary>
        [JsiiProperty("roleArn", "{\"fqn\":\"@aws-cdk/aws-iam.RoleArn\",\"optional\":true}")]
        public virtual RoleArn RoleArn
        {
            get => GetInstanceProperty<RoleArn>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The Amazon ECS task definition and task count to use, if the event target
        /// is an Amazon ECS task.
        /// </summary>
        [JsiiProperty("ecsParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty\",\"optional\":true}")]
        public virtual IEcsParametersProperty EcsParameters
        {
            get => GetInstanceProperty<IEcsParametersProperty>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Settings that control shard assignment, when the target is a Kinesis
        /// stream. If you don't include this parameter, eventId is used as the
        /// partition key.
        /// </summary>
        [JsiiProperty("kinesisParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.KinesisParametersProperty\",\"optional\":true}")]
        public virtual IKinesisParametersProperty KinesisParameters
        {
            get => GetInstanceProperty<IKinesisParametersProperty>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Parameters used when the rule invokes Amazon EC2 Systems Manager Run
        /// Command.
        /// </summary>
        [JsiiProperty("runCommandParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty\",\"optional\":true}")]
        public virtual IRunCommandParametersProperty RunCommandParameters
        {
            get => GetInstanceProperty<IRunCommandParametersProperty>();
            set => SetInstanceProperty(value);
        }
    }
}