using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Identifier for a VPC</summary>
    [JsiiClass(typeof(VpcNetworkId), "@aws-cdk/aws-ec2.VpcNetworkId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class VpcNetworkId : Token
    {
        public VpcNetworkId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected VpcNetworkId(ByRefValue reference): base(reference)
        {
        }

        protected VpcNetworkId(DeputyProps props): base(props)
        {
        }
    }
}