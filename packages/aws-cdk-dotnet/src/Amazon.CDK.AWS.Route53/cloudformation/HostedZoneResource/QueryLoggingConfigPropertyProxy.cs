using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IQueryLoggingConfigProperty), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource.QueryLoggingConfigProperty")]
    internal class QueryLoggingConfigPropertyProxy : DeputyBase, IQueryLoggingConfigProperty
    {
        private QueryLoggingConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``HostedZoneResource.QueryLoggingConfigProperty.CloudWatchLogsLogGroupArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-queryloggingconfig.html#cfn-route53-hostedzone-queryloggingconfig-cloudwatchlogsloggrouparn </remarks>
        [JsiiProperty("cloudWatchLogsLogGroupArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object CloudWatchLogsLogGroupArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}