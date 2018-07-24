using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cloud9
{
    [JsiiClass(typeof(EnvironmentEC2Arn), "@aws-cdk/aws-cloud9.EnvironmentEC2Arn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class EnvironmentEC2Arn : Arn
    {
        public EnvironmentEC2Arn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected EnvironmentEC2Arn(ByRefValue reference): base(reference)
        {
        }

        protected EnvironmentEC2Arn(DeputyProps props): base(props)
        {
        }
    }
}