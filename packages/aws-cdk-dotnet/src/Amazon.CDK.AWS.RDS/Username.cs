using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>An RDS username</summary>
    [JsiiClass(typeof(Username), "@aws-cdk/aws-rds.Username", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Username : Token
    {
        public Username(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Username(ByRefValue reference): base(reference)
        {
        }

        protected Username(DeputyProps props): base(props)
        {
        }
    }
}