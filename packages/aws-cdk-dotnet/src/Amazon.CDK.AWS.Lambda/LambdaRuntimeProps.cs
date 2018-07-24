using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    public class LambdaRuntimeProps : DeputyBase, ILambdaRuntimeProps
    {
        /// <summary>Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.</summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? SupportsInlineCode
        {
            get;
        }
    }
}