using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Reference to a hosted zone</summary>
    public class HostedZoneRefProps : DeputyBase, IHostedZoneRefProps
    {
        /// <summary>Identifier of the hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}", true)]
        public HostedZoneId HostedZoneId
        {
            get;
            set;
        }

        /// <summary>Name of the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}", true)]
        public string ZoneName
        {
            get;
            set;
        }
    }
}