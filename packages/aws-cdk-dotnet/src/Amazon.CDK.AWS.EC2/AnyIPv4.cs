using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Any IPv4 address</summary>
    [JsiiClass(typeof(AnyIPv4), "@aws-cdk/aws-ec2.AnyIPv4", "[]")]
    public class AnyIPv4 : CidrIp
    {
        public AnyIPv4(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AnyIPv4(ByRefValue reference): base(reference)
        {
        }

        protected AnyIPv4(DeputyProps props): base(props)
        {
        }
    }
}