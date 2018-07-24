using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    [JsiiInterfaceProxy(typeof(IZoneDelegationRecordProps), "@aws-cdk/aws-route53.ZoneDelegationRecordProps")]
    internal class ZoneDelegationRecordPropsProxy : DeputyBase, IZoneDelegationRecordProps
    {
        private ZoneDelegationRecordPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The name of the zone that delegation is made to.</summary>
        [JsiiProperty("delegatedZoneName", "{\"primitive\":\"string\"}")]
        public virtual string DelegatedZoneName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name servers to report in the delegation records.</summary>
        [JsiiProperty("nameServers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] NameServers
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The TTL of the zone delegation records.</summary>
        /// <remarks>default: 172800 seconds.</remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Ttl
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Any comments that you want to include about the zone delegation records.</summary>
        /// <remarks>default: no comment.</remarks>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Comment
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}