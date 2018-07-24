using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Represents a new VPC subnet resource</summary>
    [JsiiClass(typeof(VpcSubnet), "@aws-cdk/aws-ec2.VpcSubnet", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetProps\"}}]")]
    public class VpcSubnet : VpcSubnetRef
    {
        public VpcSubnet(Construct parent, string name, IVpcSubnetProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected VpcSubnet(ByRefValue reference): base(reference)
        {
        }

        protected VpcSubnet(DeputyProps props): base(props)
        {
        }

        /// <summary>The Availability Zone the subnet is located in</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        public override string AvailabilityZone
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>The subnetId for this particular subnet</summary>
        [JsiiProperty("subnetId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}")]
        public override VpcSubnetId SubnetId
        {
            get => GetInstanceProperty<VpcSubnetId>();
        }

        [JsiiMethod("addDefaultRouteToNAT", null, "[{\"name\":\"natGatewayId\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}]")]
        protected virtual void AddDefaultRouteToNAT(Token natGatewayId)
        {
            InvokeInstanceVoidMethod(new object[]{natGatewayId});
        }

        [JsiiMethod("addDefaultRouteToIGW", null, "[{\"name\":\"gatewayId\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}]")]
        protected virtual void AddDefaultRouteToIGW(Token gatewayId)
        {
            InvokeInstanceVoidMethod(new object[]{gatewayId});
        }
    }
}