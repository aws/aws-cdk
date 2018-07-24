using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(UserName), "@aws-cdk/aws-iam.UserName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserName : Token
    {
        public UserName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserName(ByRefValue reference): base(reference)
        {
        }

        protected UserName(DeputyProps props): base(props)
        {
        }
    }
}