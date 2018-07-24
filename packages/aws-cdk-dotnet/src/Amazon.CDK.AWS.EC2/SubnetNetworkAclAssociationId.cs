using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SubnetNetworkAclAssociationId), "@aws-cdk/aws-ec2.SubnetNetworkAclAssociationId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SubnetNetworkAclAssociationId : Token
    {
        public SubnetNetworkAclAssociationId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SubnetNetworkAclAssociationId(ByRefValue reference): base(reference)
        {
        }

        protected SubnetNetworkAclAssociationId(DeputyProps props): base(props)
        {
        }
    }
}