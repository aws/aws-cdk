using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(UserPoolClientClientSecret), "@aws-cdk/aws-cognito.UserPoolClientClientSecret", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserPoolClientClientSecret : Token
    {
        public UserPoolClientClientSecret(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserPoolClientClientSecret(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolClientClientSecret(DeputyProps props): base(props)
        {
        }
    }
}