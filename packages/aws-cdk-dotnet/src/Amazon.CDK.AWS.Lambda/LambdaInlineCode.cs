using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(LambdaInlineCode), "@aws-cdk/aws-lambda.LambdaInlineCode", "[{\"name\":\"code\",\"type\":{\"primitive\":\"string\"}}]")]
    public class LambdaInlineCode : LambdaCode
    {
        public LambdaInlineCode(string code): base(new DeputyProps(new object[]{code}))
        {
        }

        protected LambdaInlineCode(ByRefValue reference): base(reference)
        {
        }

        protected LambdaInlineCode(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toJSON", "{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}", "[{\"name\":\"runtime\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}}]")]
        public override ICodeProperty ToJSON(LambdaRuntime runtime)
        {
            return InvokeInstanceMethod<ICodeProperty>(new object[]{runtime});
        }
    }
}