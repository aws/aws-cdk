using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(IdentityPoolName), "@aws-cdk/aws-cognito.IdentityPoolName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class IdentityPoolName : Token
    {
        public IdentityPoolName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected IdentityPoolName(ByRefValue reference): base(reference)
        {
        }

        protected IdentityPoolName(DeputyProps props): base(props)
        {
        }
    }
}