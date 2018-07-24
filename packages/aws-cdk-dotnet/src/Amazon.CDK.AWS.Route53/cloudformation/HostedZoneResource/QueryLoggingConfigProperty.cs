using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html </remarks>
    public class QueryLoggingConfigProperty : DeputyBase, IQueryLoggingConfigProperty
    {
        /// <summary>``HostedZoneResource.QueryLoggingConfigProperty.CloudWatchLogsLogGroupArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html#cfn-route53-hostedzone-queryloggingconfig-cloudwatchlogsloggrouparn </remarks>
        [JsiiProperty("cloudWatchLogsLogGroupArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object CloudWatchLogsLogGroupArn
        {
            get;
            set;
        }
    }
}