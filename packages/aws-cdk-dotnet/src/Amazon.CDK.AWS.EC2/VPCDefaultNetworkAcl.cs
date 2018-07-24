using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(VPCDefaultNetworkAcl), "@aws-cdk/aws-ec2.VPCDefaultNetworkAcl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VPCDefaultNetworkAcl : Token
    {
        public VPCDefaultNetworkAcl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VPCDefaultNetworkAcl(ByRefValue reference): base(reference)
        {
        }

        protected VPCDefaultNetworkAcl(DeputyProps props): base(props)
        {
        }
    }
}