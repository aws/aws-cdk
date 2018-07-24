using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito
{
    [JsiiClass(typeof(UserPoolArn), "@aws-cdk/aws-cognito.UserPoolArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserPoolArn : Arn
    {
        public UserPoolArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserPoolArn(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolArn(DeputyProps props): base(props)
        {
        }
    }
}