using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Add a backend to the load balancer</summary>
    [JsiiInterfaceProxy(typeof(IClassicLoadBalancerListener), "@aws-cdk/aws-ec2.ClassicLoadBalancerListener")]
    internal class ClassicLoadBalancerListenerProxy : DeputyBase, IClassicLoadBalancerListener
    {
        private ClassicLoadBalancerListenerProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>External listening port</summary>
        [JsiiProperty("externalPort", "{\"primitive\":\"number\"}")]
        public virtual double ExternalPort
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What public protocol to use for load balancing
        /// 
        /// Either 'tcp', 'ssl', 'http' or 'https'.
        /// 
        /// May be omitted if the external port is either 80 or 443.
        /// </summary>
        [JsiiProperty("externalProtocol", "{\"fqn\":\"@aws-cdk/aws-ec2.LoadBalancingProtocol\",\"optional\":true}")]
        public virtual LoadBalancingProtocol ExternalProtocol
        {
            get => GetInstanceProperty<LoadBalancingProtocol>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Instance listening port
        /// 
        /// Same as the externalPort if not specified.
        /// </summary>
        /// <remarks>default: externalPort</remarks>
        [JsiiProperty("internalPort", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? InternalPort
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What public protocol to use for load balancing
        /// 
        /// Either 'tcp', 'ssl', 'http' or 'https'.
        /// 
        /// May be omitted if the internal port is either 80 or 443.
        /// 
        /// The instance protocol is 'tcp' if the front-end protocol
        /// is 'tcp' or 'ssl', the instance protocol is 'http' if the
        /// front-end protocol is 'https'.
        /// </summary>
        [JsiiProperty("internalProtocol", "{\"fqn\":\"@aws-cdk/aws-ec2.LoadBalancingProtocol\",\"optional\":true}")]
        public virtual LoadBalancingProtocol InternalProtocol
        {
            get => GetInstanceProperty<LoadBalancingProtocol>();
            set => SetInstanceProperty(value);
        }

        /// <summary>SSL policy names</summary>
        [JsiiProperty("policyNames", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        public virtual string[] PolicyNames
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>ID of SSL certificate</summary>
        [JsiiProperty("sslCertificateId", "{\"fqn\":\"@aws-cdk/cdk.Arn\",\"optional\":true}")]
        public virtual Arn SslCertificateId
        {
            get => GetInstanceProperty<Arn>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Allow connections to the load balancer from the given set of connection peers
        /// 
        /// By default, connections will be allowed from anywhere. Set this to an empty list
        /// to deny connections, or supply a custom list of peers to allow connections from
        /// (IP ranges or security groups).
        /// </summary>
        /// <remarks>default: Anywhere</remarks>
        [JsiiProperty("allowConnectionsFrom", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},\"optional\":true}")]
        public virtual IIConnectable[] AllowConnectionsFrom
        {
            get => GetInstanceProperty<IIConnectable[]>();
            set => SetInstanceProperty(value);
        }
    }
}