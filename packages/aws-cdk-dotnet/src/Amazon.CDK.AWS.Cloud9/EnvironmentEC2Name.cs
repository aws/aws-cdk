using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cloud9
{
    [JsiiClass(typeof(EnvironmentEC2Name), "@aws-cdk/aws-cloud9.EnvironmentEC2Name", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class EnvironmentEC2Name : Token
    {
        public EnvironmentEC2Name(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected EnvironmentEC2Name(ByRefValue reference): base(reference)
        {
        }

        protected EnvironmentEC2Name(DeputyProps props): base(props)
        {
        }
    }
}