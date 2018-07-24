using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Describe the health check to a load balancer</summary>
    [JsiiInterface(typeof(IHealthCheck), "@aws-cdk/aws-ec2.HealthCheck")]
    public interface IHealthCheck
    {
        /// <summary>What port number to health check on</summary>
        [JsiiProperty("port", "{\"primitive\":\"number\"}")]
        double Port
        {
            get;
            set;
        }

        /// <summary>
        /// What protocol to use for health checking
        /// 
        /// The protocol is automatically determined from the port if it's not supplied.
        /// </summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("protocol", "{\"fqn\":\"@aws-cdk/aws-ec2.LoadBalancingProtocol\",\"optional\":true}")]
        LoadBalancingProtocol Protocol
        {
            get;
            set;
        }

        /// <summary>
        /// What path to use for HTTP or HTTPS health check (must return 200)
        /// 
        /// For SSL and TCP health checks, accepting connections is enough to be considered
        /// healthy.
        /// </summary>
        /// <remarks>default: "/"</remarks>
        [JsiiProperty("path", "{\"primitive\":\"string\",\"optional\":true}")]
        string Path
        {
            get;
            set;
        }

        /// <summary>After how many successful checks is an instance considered healthy</summary>
        /// <remarks>default: 2</remarks>
        [JsiiProperty("healthyThreshold", "{\"primitive\":\"number\",\"optional\":true}")]
        double? HealthyThreshold
        {
            get;
            set;
        }

        /// <summary>After how many unsuccessful checks is an instance considered unhealthy</summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("unhealthyThreshold", "{\"primitive\":\"number\",\"optional\":true}")]
        double? UnhealthyThreshold
        {
            get;
            set;
        }

        /// <summary>Number of seconds between health checks</summary>
        /// <remarks>default: 30</remarks>
        [JsiiProperty("interval", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Interval
        {
            get;
            set;
        }

        /// <summary>Health check timeout</summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("timeout", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Timeout
        {
            get;
            set;
        }
    }
}