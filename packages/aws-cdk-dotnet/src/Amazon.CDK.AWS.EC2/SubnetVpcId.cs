using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SubnetVpcId), "@aws-cdk/aws-ec2.SubnetVpcId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SubnetVpcId : Token
    {
        public SubnetVpcId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SubnetVpcId(ByRefValue reference): base(reference)
        {
        }

        protected SubnetVpcId(DeputyProps props): base(props)
        {
        }
    }
}