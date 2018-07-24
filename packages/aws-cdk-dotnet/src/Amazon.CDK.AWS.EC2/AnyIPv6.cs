using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Any IPv6 address</summary>
    [JsiiClass(typeof(AnyIPv6), "@aws-cdk/aws-ec2.AnyIPv6", "[]")]
    public class AnyIPv6 : CidrIpv6
    {
        public AnyIPv6(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AnyIPv6(ByRefValue reference): base(reference)
        {
        }

        protected AnyIPv6(DeputyProps props): base(props)
        {
        }
    }
}