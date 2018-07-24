using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(VPCDefaultSecurityGroup), "@aws-cdk/aws-ec2.VPCDefaultSecurityGroup", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VPCDefaultSecurityGroup : Token
    {
        public VPCDefaultSecurityGroup(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VPCDefaultSecurityGroup(ByRefValue reference): base(reference)
        {
        }

        protected VPCDefaultSecurityGroup(DeputyProps props): base(props)
        {
        }
    }
}