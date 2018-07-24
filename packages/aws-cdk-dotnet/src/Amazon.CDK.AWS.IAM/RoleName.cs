using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(RoleName), "@aws-cdk/aws-iam.RoleName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RoleName : Token
    {
        public RoleName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RoleName(ByRefValue reference): base(reference)
        {
        }

        protected RoleName(DeputyProps props): base(props)
        {
        }
    }
}