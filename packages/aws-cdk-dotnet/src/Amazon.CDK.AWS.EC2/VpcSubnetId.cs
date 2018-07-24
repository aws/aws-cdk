using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Id of a VPC Subnet</summary>
    [JsiiClass(typeof(VpcSubnetId), "@aws-cdk/aws-ec2.VpcSubnetId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VpcSubnetId : Token
    {
        public VpcSubnetId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VpcSubnetId(ByRefValue reference): base(reference)
        {
        }

        protected VpcSubnetId(DeputyProps props): base(props)
        {
        }
    }
}