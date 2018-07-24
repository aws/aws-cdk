using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// A ``LambdaRuntime`` that can be used in conjunction with the ``ZipFile``
    /// property of the ``AWS::Lambda::Function`` resource.
    /// </summary>
    public class InlinableLambdaRuntime : DeputyBase, IInlinableLambdaRuntime
    {
        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
        }

        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\"}", true)]
        public bool SupportsInlineCode
        {
            get;
        }
    }
}