using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM
{
    [JsiiClass(typeof(ParameterValue), "@aws-cdk/aws-ssm.ParameterValue", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ParameterValue : Token
    {
        public ParameterValue(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ParameterValue(ByRefValue reference): base(reference)
        {
        }

        protected ParameterValue(DeputyProps props): base(props)
        {
        }
    }
}