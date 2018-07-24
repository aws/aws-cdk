using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    /// <summary>
    /// Create a Route53 private hosted zone for use in one or more VPCs.
    /// 
    /// Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
    /// for the VPC you're configuring for private hosted zones.
    /// </summary>
    [JsiiClass(typeof(PrivateHostedZone), "@aws-cdk/aws-route53.PrivateHostedZone", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.PrivateHostedZoneProps\"}}]")]
    public class PrivateHostedZone : HostedZoneRef
    {
        public PrivateHostedZone(Construct parent, string name, IPrivateHostedZoneProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected PrivateHostedZone(ByRefValue reference): base(reference)
        {
        }

        protected PrivateHostedZone(DeputyProps props): base(props)
        {
        }

        /// <summary>Identifier of this hosted zone</summary>
        [JsiiProperty("hostedZoneId", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneId\"}")]
        public override HostedZoneId HostedZoneId
        {
            get => GetInstanceProperty<HostedZoneId>();
        }

        /// <summary>Fully qualified domain name for the hosted zone</summary>
        [JsiiProperty("zoneName", "{\"primitive\":\"string\"}")]
        public override string ZoneName
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Add another VPC to this private hosted zone.</summary>
        /// <param name = "vpc">the other VPC to add.</param>
        [JsiiMethod("addVpc", null, "[{\"name\":\"vpc\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}}]")]
        public virtual void AddVpc(VpcNetworkRef vpc)
        {
            InvokeInstanceVoidMethod(new object[]{vpc});
        }
    }
}