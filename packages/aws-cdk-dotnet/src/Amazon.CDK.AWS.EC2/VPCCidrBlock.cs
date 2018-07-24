using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(VPCCidrBlock), "@aws-cdk/aws-ec2.VPCCidrBlock", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VPCCidrBlock : Token
    {
        public VPCCidrBlock(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VPCCidrBlock(ByRefValue reference): base(reference)
        {
        }

        protected VPCCidrBlock(DeputyProps props): base(props)
        {
        }
    }
}