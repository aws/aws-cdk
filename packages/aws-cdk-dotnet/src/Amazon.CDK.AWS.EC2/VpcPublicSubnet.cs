using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Represents a public VPC subnet resource</summary>
    [JsiiClass(typeof(VpcPublicSubnet), "@aws-cdk/aws-ec2.VpcPublicSubnet", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetProps\"}}]")]
    public class VpcPublicSubnet : VpcSubnet
    {
        public VpcPublicSubnet(Construct parent, string name, IVpcSubnetProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected VpcPublicSubnet(ByRefValue reference): base(reference)
        {
        }

        protected VpcPublicSubnet(DeputyProps props): base(props)
        {
        }

        /// <summary>Create a default route that points to a passed IGW</summary>
        [JsiiMethod("addDefaultIGWRouteEntry", null, "[{\"name\":\"gatewayId\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}]")]
        public virtual void AddDefaultIGWRouteEntry(Token gatewayId)
        {
            InvokeInstanceVoidMethod(new object[]{gatewayId});
        }

        /// <summary>
        /// Creates a new managed NAT gateway attached to this public subnet.
        /// Also adds the EIP for the managed NAT.
        /// Returns the NAT Gateway ref
        /// </summary>
        [JsiiMethod("addNatGateway", "{\"fqn\":\"@aws-cdk/cdk.Token\"}", "[]")]
        public virtual Token AddNatGateway()
        {
            return InvokeInstanceMethod<Token>(new object[]{});
        }
    }
}