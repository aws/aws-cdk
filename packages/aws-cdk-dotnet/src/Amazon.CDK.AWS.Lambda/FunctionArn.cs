using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(FunctionArn), "@aws-cdk/aws-lambda.FunctionArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class FunctionArn : Arn
    {
        public FunctionArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected FunctionArn(ByRefValue reference): base(reference)
        {
        }

        protected FunctionArn(DeputyProps props): base(props)
        {
        }
    }
}