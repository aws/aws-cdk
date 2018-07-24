using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>A ``LambdaRuntime`` that can be used for inlining JavaScript.</summary>
    [JsiiInterfaceProxy(typeof(IInlinableJavascriptLambdaRuntime), "@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime")]
    internal class InlinableJavascriptLambdaRuntimeProxy : DeputyBase, IInlinableJavascriptLambdaRuntime
    {
        private InlinableJavascriptLambdaRuntimeProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\"}")]
        public virtual bool SupportsInlineCode
        {
            get => GetInstanceProperty<bool>();
        }
    }
}