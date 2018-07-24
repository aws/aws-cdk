using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterfaceProxy(typeof(IConnectionRule), "@aws-cdk/aws-ec2.ConnectionRule")]
    internal class ConnectionRuleProxy : DeputyBase, IConnectionRule
    {
        private ConnectionRuleProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The IP protocol name (tcp, udp, icmp) or number (see Protocol Numbers).
        /// Use -1 to specify all protocols. If you specify -1, or a protocol number
        /// other than tcp, udp, icmp, or 58 (ICMPv6), traffic on all ports is
        /// allowed, regardless of any ports you specify. For tcp, udp, and icmp, you
        /// must specify a port range. For protocol 58 (ICMPv6), you can optionally
        /// specify a port range; if you don't, traffic for all types and codes is
        /// allowed.
        /// </summary>
        /// <remarks>default: tcp</remarks>
        [JsiiProperty("protocol", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Protocol
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Start of port range for the TCP and UDP protocols, or an ICMP type number.
        /// 
        /// If you specify icmp for the IpProtocol property, you can specify
        /// -1 as a wildcard (i.e., any ICMP type number).
        /// </summary>
        [JsiiProperty("fromPort", "{\"primitive\":\"number\"}")]
        public virtual double FromPort
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// End of port range for the TCP and UDP protocols, or an ICMP code.
        /// 
        /// If you specify icmp for the IpProtocol property, you can specify -1 as a
        /// wildcard (i.e., any ICMP code).
        /// </summary>
        /// <remarks>default: If toPort is not specified, it will be the same as fromPort.</remarks>
        [JsiiProperty("toPort", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? ToPort
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Description of this connection. It is applied to both the ingress rule
        /// and the egress rule.
        /// </summary>
        /// <remarks>default: No description</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}