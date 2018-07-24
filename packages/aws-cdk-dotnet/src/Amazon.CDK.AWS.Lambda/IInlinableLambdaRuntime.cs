using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// A ``LambdaRuntime`` that can be used in conjunction with the ``ZipFile``
    /// property of the ``AWS::Lambda::Function`` resource.
    /// </summary>
    [JsiiInterface(typeof(IInlinableLambdaRuntime), "@aws-cdk/aws-lambda.InlinableLambdaRuntime")]
    public interface IInlinableLambdaRuntime
    {
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        string Name
        {
            get;
        }

        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\"}")]
        bool SupportsInlineCode
        {
            get;
        }
    }
}