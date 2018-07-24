using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Properties of a new hosted zone</summary>
    public class PublicHostedZoneProps : DeputyBase, IPublicHostedZoneProps
    {
        /// <summary>The fully qualified domain name for the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}", true)]
        public string ZoneName
        {
            get;
            set;
        }

        /// <summary>Any comments that you want to include about the hosted zone.</summary>
        /// <remarks>default: no comment</remarks>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Comment
        {
            get;
            set;
        }

        /// <summary>The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.</summary>
        /// <remarks>default: no DNS query logging</remarks>
        [JsiiProperty("queryLogsLogGroupArn", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroupArn\",\"optional\":true}", true)]
        public LogGroupArn QueryLogsLogGroupArn
        {
            get;
            set;
        }
    }
}