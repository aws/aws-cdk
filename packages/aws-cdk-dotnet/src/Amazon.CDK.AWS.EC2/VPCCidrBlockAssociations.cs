using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(VPCCidrBlockAssociations), "@aws-cdk/aws-ec2.VPCCidrBlockAssociations", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VPCCidrBlockAssociations : Token
    {
        public VPCCidrBlockAssociations(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VPCCidrBlockAssociations(ByRefValue reference): base(reference)
        {
        }

        protected VPCCidrBlockAssociations(DeputyProps props): base(props)
        {
        }
    }
}