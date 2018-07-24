using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>
    /// Connection endpoint of a database cluster or instance
    /// 
    /// Consists of a combination of hostname and port.
    /// </summary>
    [JsiiClass(typeof(Endpoint), "@aws-cdk/aws-rds.Endpoint", "[{\"name\":\"address\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}},{\"name\":\"port\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.Port\"}}]")]
    public class Endpoint : DeputyBase
    {
        public Endpoint(DBClusterEndpointAddress address, Port port): base(new DeputyProps(new object[]{address, port}))
        {
        }

        protected Endpoint(ByRefValue reference): base(reference)
        {
        }

        protected Endpoint(DeputyProps props): base(props)
        {
        }

        /// <summary>The hostname of the endpoint</summary>
        [JsiiProperty("hostname", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        public virtual DBClusterEndpointAddress Hostname
        {
            get => GetInstanceProperty<DBClusterEndpointAddress>();
        }

        /// <summary>The port of the endpoint</summary>
        [JsiiProperty("port", "{\"fqn\":\"@aws-cdk/aws-rds.Port\"}")]
        public virtual Port Port
        {
            get => GetInstanceProperty<Port>();
        }

        /// <summary>The combination of "HOSTNAME:PORT" for this endpoint</summary>
        [JsiiProperty("socketAddress", "{\"fqn\":\"@aws-cdk/aws-rds.SocketAddress\"}")]
        public virtual SocketAddress SocketAddress
        {
            get => GetInstanceProperty<SocketAddress>();
        }
    }
}