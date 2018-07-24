using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// A ``LambdaRuntime`` that can be used in conjunction with the ``ZipFile``
    /// property of the ``AWS::Lambda::Function`` resource.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IInlinableLambdaRuntime), "@aws-cdk/aws-lambda.InlinableLambdaRuntime")]
    internal class InlinableLambdaRuntimeProxy : DeputyBase, IInlinableLambdaRuntime
    {
        private InlinableLambdaRuntimeProxy(ByRefValue reference): base(reference)
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