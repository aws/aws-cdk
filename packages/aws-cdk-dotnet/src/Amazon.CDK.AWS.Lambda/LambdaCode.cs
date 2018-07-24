using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(LambdaCode), "@aws-cdk/aws-lambda.LambdaCode", "[]")]
    public abstract class LambdaCode : DeputyBase
    {
        protected LambdaCode(): base(new DeputyProps(new object[]{}))
        {
        }

        protected LambdaCode(ByRefValue reference): base(reference)
        {
        }

        protected LambdaCode(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toJSON", "{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}", "[{\"name\":\"runtime\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}}]")]
        public abstract ICodeProperty ToJSON(LambdaRuntime runtime);
    }
}