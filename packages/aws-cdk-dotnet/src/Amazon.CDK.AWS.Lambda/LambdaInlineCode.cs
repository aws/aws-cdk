using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Lambda code from an inline string (limited to 4KiB).</summary>
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

        /// <summary>
        /// Called when the lambda is initialized to allow this object to
        /// bind to the stack, add resources and have fun.
        /// </summary>
        [JsiiMethod("bind", null, "[{\"name\":\"lambda\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.Lambda\"}}]")]
        public override void Bind(Lambda_ lambda)
        {
            InvokeInstanceVoidMethod(new object[]{lambda});
        }

        /// <summary>
        /// Called during stack synthesis to render the CodePropery for the
        /// Lambda function.
        /// </summary>
        [JsiiMethod("toJSON", "{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}", "[]")]
        public override ICodeProperty ToJSON()
        {
            return InvokeInstanceMethod<ICodeProperty>(new object[]{});
        }
    }
}