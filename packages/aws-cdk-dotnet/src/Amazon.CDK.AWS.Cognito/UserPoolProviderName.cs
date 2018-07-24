using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(UserPoolProviderName), "@aws-cdk/aws-cognito.UserPoolProviderName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserPoolProviderName : Token
    {
        public UserPoolProviderName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserPoolProviderName(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolProviderName(DeputyProps props): base(props)
        {
        }
    }
}