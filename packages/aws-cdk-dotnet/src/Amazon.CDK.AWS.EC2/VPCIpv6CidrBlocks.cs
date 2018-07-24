using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(VPCIpv6CidrBlocks), "@aws-cdk/aws-ec2.VPCIpv6CidrBlocks", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VPCIpv6CidrBlocks : Token
    {
        public VPCIpv6CidrBlocks(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VPCIpv6CidrBlocks(ByRefValue reference): base(reference)
        {
        }

        protected VPCIpv6CidrBlocks(DeputyProps props): base(props)
        {
        }
    }
}