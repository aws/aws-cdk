using Amazon.CDK.Assets;
using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Lambda code from a local directory.</summary>
    [JsiiClass(typeof(LambdaAssetCode), "@aws-cdk/aws-lambda.LambdaAssetCode", "[{\"name\":\"path\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"packaging\",\"type\":{\"fqn\":\"@aws-cdk/assets.AssetPackaging\"}}]")]
    public class LambdaAssetCode : LambdaCode
    {
        public LambdaAssetCode(string path, AssetPackaging packaging): base(new DeputyProps(new object[]{path, packaging}))
        {
        }

        protected LambdaAssetCode(ByRefValue reference): base(reference)
        {
        }

        protected LambdaAssetCode(DeputyProps props): base(props)
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