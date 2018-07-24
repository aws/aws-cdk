using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(UserArn), "@aws-cdk/aws-iam.UserArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserArn : Arn
    {
        public UserArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserArn(ByRefValue reference): base(reference)
        {
        }

        protected UserArn(DeputyProps props): base(props)
        {
        }
    }
}