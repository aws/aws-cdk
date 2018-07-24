using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties returned by a Subscription destination</summary>
    [JsiiInterfaceProxy(typeof(ILogSubscriptionDestination), "@aws-cdk/aws-logs.LogSubscriptionDestination")]
    internal class LogSubscriptionDestinationProxy : DeputyBase, ILogSubscriptionDestination
    {
        private LogSubscriptionDestinationProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The ARN of the subscription's destination</summary>
        [JsiiProperty("arn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn Arn
        {
            get => GetInstanceProperty<Arn>();
        }

        /// <summary>The role to assume to write log events to the destination</summary>
        /// <remarks>default: No role assumed</remarks>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
        }
    }
}