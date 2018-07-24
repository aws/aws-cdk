using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html </remarks>
    [JsiiInterface(typeof(IQueryLoggingConfigProperty), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource.QueryLoggingConfigProperty")]
    public interface IQueryLoggingConfigProperty
    {
        /// <summary>``HostedZoneResource.QueryLoggingConfigProperty.CloudWatchLogsLogGroupArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html#cfn-route53-hostedzone-queryloggingconfig-cloudwatchlogsloggrouparn </remarks>
        [JsiiProperty("cloudWatchLogsLogGroupArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object CloudWatchLogsLogGroupArn
        {
            get;
            set;
        }
    }
}