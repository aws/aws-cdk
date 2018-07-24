using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(UserPoolClientName), "@aws-cdk/aws-cognito.UserPoolClientName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserPoolClientName : Token
    {
        public UserPoolClientName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserPoolClientName(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolClientName(DeputyProps props): base(props)
        {
        }
    }
}