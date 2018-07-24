using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Reference to a hosted zone</summary>
    [JsiiInterface(typeof(IHostedZoneRefProps), "@aws-cdk/aws-route53.HostedZoneRefProps")]
    public interface IHostedZoneRefProps
    {
        /// <summary>Identifier of the hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        HostedZoneId HostedZoneId
        {
            get;
            set;
        }

        /// <summary>Name of the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        string ZoneName
        {
            get;
            set;
        }
    }
}