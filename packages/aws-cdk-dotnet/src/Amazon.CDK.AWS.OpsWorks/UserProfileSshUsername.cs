using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks
{
    [JsiiClass(typeof(UserProfileSshUsername), "@aws-cdk/aws-opsworks.UserProfileSshUsername", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class UserProfileSshUsername : Token
    {
        public UserProfileSshUsername(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected UserProfileSshUsername(ByRefValue reference): base(reference)
        {
        }

        protected UserProfileSshUsername(DeputyProps props): base(props)
        {
        }
    }
}