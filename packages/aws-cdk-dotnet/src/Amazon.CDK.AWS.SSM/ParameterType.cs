using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM
{
    [JsiiClass(typeof(ParameterType), "@aws-cdk/aws-ssm.ParameterType", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ParameterType : Token
    {
        public ParameterType(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ParameterType(ByRefValue reference): base(reference)
        {
        }

        protected ParameterType(DeputyProps props): base(props)
        {
        }
    }
}