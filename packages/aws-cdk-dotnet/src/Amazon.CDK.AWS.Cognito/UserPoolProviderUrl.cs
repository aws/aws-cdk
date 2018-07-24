using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(UserPoolProviderUrl), "@aws-cdk/aws-cognito.UserPoolProviderUrl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserPoolProviderUrl : Token
    {
        public UserPoolProviderUrl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserPoolProviderUrl(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolProviderUrl(DeputyProps props): base(props)
        {
        }
    }
}