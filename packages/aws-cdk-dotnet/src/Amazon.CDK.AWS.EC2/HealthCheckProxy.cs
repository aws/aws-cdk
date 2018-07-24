using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Describe the health check to a load balancer</summary>
    [JsiiInterfaceProxy(typeof(IHealthCheck), "@aws-cdk/aws-ec2.HealthCheck")]
    internal class HealthCheckProxy : DeputyBase, IHealthCheck
    {
        private HealthCheckProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>What port number to health check on</summary>
        [JsiiProperty("port", "{\"primitive\":\"number\"}")]
        public virtual double Port
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What protocol to use for health checking
        /// 
        /// The protocol is automatically determined from the port if it's not supplied.
        /// </summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("protocol", "{\"fqn\":\"@aws-cdk/aws-ec2.LoadBalancingProtocol\",\"optional\":true}")]
        public virtual LoadBalancingProtocol Protocol
        {
            get => GetInstanceProperty<LoadBalancingProtocol>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What path to use for HTTP or HTTPS health check (must return 200)
        /// 
        /// For SSL and TCP health checks, accepting connections is enough to be considered
        /// healthy.
        /// </summary>
        /// <remarks>default: "/"</remarks>
        [JsiiProperty("path", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>After how many successful checks is an instance considered healthy</summary>
        /// <remarks>default: 2</remarks>
        [JsiiProperty("healthyThreshold", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? HealthyThreshold
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>After how many unsuccessful checks is an instance considered unhealthy</summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("unhealthyThreshold", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? UnhealthyThreshold
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Number of seconds between health checks</summary>
        /// <remarks>default: 30</remarks>
        [JsiiProperty("interval", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Interval
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Health check timeout</summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("timeout", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Timeout
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}