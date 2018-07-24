using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(FunctionName), "@aws-cdk/aws-lambda.FunctionName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class FunctionName : Token
    {
        public FunctionName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected FunctionName(ByRefValue reference): base(reference)
        {
        }

        protected FunctionName(DeputyProps props): base(props)
        {
        }
    }
}