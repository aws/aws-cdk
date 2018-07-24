using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SubnetIpv6CidrBlocks), "@aws-cdk/aws-ec2.SubnetIpv6CidrBlocks", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SubnetIpv6CidrBlocks : Token
    {
        public SubnetIpv6CidrBlocks(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SubnetIpv6CidrBlocks(ByRefValue reference): base(reference)
        {
        }

        protected SubnetIpv6CidrBlocks(DeputyProps props): base(props)
        {
        }
    }
}