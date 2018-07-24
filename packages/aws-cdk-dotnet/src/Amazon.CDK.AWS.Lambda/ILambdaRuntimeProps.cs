using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiInterface(typeof(ILambdaRuntimeProps), "@aws-cdk/aws-lambda.LambdaRuntimeProps")]
    public interface ILambdaRuntimeProps
    {
        /// <summary>Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.</summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? SupportsInlineCode
        {
            get;
        }
    }
}