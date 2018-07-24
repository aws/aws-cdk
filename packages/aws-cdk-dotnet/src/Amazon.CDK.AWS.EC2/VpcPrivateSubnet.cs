using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Represents a private VPC subnet resource</summary>
    [JsiiClass(typeof(VpcPrivateSubnet), "@aws-cdk/aws-ec2.VpcPrivateSubnet", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetProps\"}}]")]
    public class VpcPrivateSubnet : VpcSubnet
    {
        public VpcPrivateSubnet(Construct parent, string name, IVpcSubnetProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected VpcPrivateSubnet(ByRefValue reference): base(reference)
        {
        }

        protected VpcPrivateSubnet(DeputyProps props): base(props)
        {
        }

        /// <summary>Adds an entry to this subnets route table that points to the passed NATGatwayId</summary>
        [JsiiMethod("addDefaultNatRouteEntry", null, "[{\"name\":\"natGatewayId\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}]")]
        public virtual void AddDefaultNatRouteEntry(Token natGatewayId)
        {
            InvokeInstanceVoidMethod(new object[]{natGatewayId});
        }
    }
}