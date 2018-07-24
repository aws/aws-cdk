using Amazon.CDK;
using Amazon.CDK.AWS.Events.cloudformation.RuleResource;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    public class EventRuleTarget : DeputyBase, IEventRuleTarget
    {
        /// <summary>
        /// A unique, user-defined identifier for the target. Acceptable values
        /// include alphanumeric characters, periods (.), hyphens (-), and
        /// underscores (_).
        /// </summary>
        [JsiiProperty("id", "{\"primitive\":\"string\"}", true)]
        public string Id
        {
            get;
            set;
        }

        /// <summary>The Amazon Resource Name (ARN) of the target.</summary>
        [JsiiProperty("arn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}", true)]
        public Arn Arn
        {
            get;
            set;
        }

        /// <summary>
        /// The Amazon Resource Name (ARN) of the AWS Identity and Access Management
        /// (IAM) role to use for this target when the rule is triggered. If one rule
        /// triggers multiple targets, you can use a different IAM role for each
        /// target.
        /// </summary>
        [JsiiProperty("roleArn", "{\"fqn\":\"@aws-cdk/aws-iam.RoleArn\",\"optional\":true}", true)]
        public RoleArn RoleArn
        {
            get;
            set;
        }

        /// <summary>
        /// The Amazon ECS task definition and task count to use, if the event target
        /// is an Amazon ECS task.
        /// </summary>
        [JsiiProperty("ecsParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty\",\"optional\":true}", true)]
        public IEcsParametersProperty EcsParameters
        {
            get;
            set;
        }

        /// <summary>
        /// Settings that control shard assignment, when the target is a Kinesis
        /// stream. If you don't include this parameter, eventId is used as the
        /// partition key.
        /// </summary>
        [JsiiProperty("kinesisParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.KinesisParametersProperty\",\"optional\":true}", true)]
        public IKinesisParametersProperty KinesisParameters
        {
            get;
            set;
        }

        /// <summary>
        /// Parameters used when the rule invokes Amazon EC2 Systems Manager Run
        /// Command.
        /// </summary>
        [JsiiProperty("runCommandParameters", "{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty\",\"optional\":true}", true)]
        public IRunCommandParametersProperty RunCommandParameters
        {
            get;
            set;
        }
    }
}