using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(GroupArn), "@aws-cdk/aws-iam.GroupArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class GroupArn : Arn
    {
        public GroupArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected GroupArn(ByRefValue reference): base(reference)
        {
        }

        protected GroupArn(DeputyProps props): base(props)
        {
        }
    }
}