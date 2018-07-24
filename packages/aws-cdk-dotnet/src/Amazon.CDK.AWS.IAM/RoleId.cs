using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(RoleId), "@aws-cdk/aws-iam.RoleId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RoleId : Token
    {
        public RoleId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RoleId(ByRefValue reference): base(reference)
        {
        }

        protected RoleId(DeputyProps props): base(props)
        {
        }
    }
}