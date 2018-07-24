using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>Reference to a hosted zone</summary>
    [JsiiInterfaceProxy(typeof(IHostedZoneRefProps), "@aws-cdk/aws-route53.HostedZoneRefProps")]
    internal class HostedZoneRefPropsProxy : DeputyBase, IHostedZoneRefProps
    {
        private HostedZoneRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Identifier of the hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        public virtual HostedZoneId HostedZoneId
        {
            get => GetInstanceProperty<HostedZoneId>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Name of the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public virtual string ZoneName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}