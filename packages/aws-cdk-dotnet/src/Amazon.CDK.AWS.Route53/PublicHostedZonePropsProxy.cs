using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Properties of a new hosted zone</summary>
    [JsiiInterfaceProxy(typeof(IPublicHostedZoneProps), "@aws-cdk/aws-route53.PublicHostedZoneProps")]
    internal class PublicHostedZonePropsProxy : DeputyBase, IPublicHostedZoneProps
    {
        private PublicHostedZonePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The fully qualified domain name for the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public virtual string ZoneName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Any comments that you want to include about the hosted zone.</summary>
        /// <remarks>default: no comment</remarks>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Comment
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.</summary>
        /// <remarks>default: no DNS query logging</remarks>
        [JsiiProperty("queryLogsLogGroupArn", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroupArn\",\"optional\":true}")]
        public virtual LogGroupArn QueryLogsLogGroupArn
        {
            get => GetInstanceProperty<LogGroupArn>();
            set => SetInstanceProperty(value);
        }
    }
}