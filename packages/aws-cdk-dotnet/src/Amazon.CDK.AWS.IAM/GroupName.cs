using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(GroupName), "@aws-cdk/aws-iam.GroupName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class GroupName : Token
    {
        public GroupName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected GroupName(ByRefValue reference): base(reference)
        {
        }

        protected GroupName(DeputyProps props): base(props)
        {
        }
    }
}