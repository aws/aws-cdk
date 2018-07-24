using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>An RDS password</summary>
    [JsiiClass(typeof(Password), "@aws-cdk/aws-rds.Password", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Password : Token
    {
        public Password(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Password(ByRefValue reference): base(reference)
        {
        }

        protected Password(DeputyProps props): base(props)
        {
        }
    }
}