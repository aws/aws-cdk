using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SubnetNetworkAclAssociationAssociationId), "@aws-cdk/aws-ec2.SubnetNetworkAclAssociationAssociationId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SubnetNetworkAclAssociationAssociationId : Token
    {
        public SubnetNetworkAclAssociationAssociationId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SubnetNetworkAclAssociationAssociationId(ByRefValue reference): base(reference)
        {
        }

        protected SubnetNetworkAclAssociationAssociationId(DeputyProps props): base(props)
        {
        }
    }
}