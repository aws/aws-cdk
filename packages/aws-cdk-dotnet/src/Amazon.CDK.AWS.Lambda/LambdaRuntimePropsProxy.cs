using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiInterfaceProxy(typeof(ILambdaRuntimeProps), "@aws-cdk/aws-lambda.LambdaRuntimeProps")]
    internal class LambdaRuntimePropsProxy : DeputyBase, ILambdaRuntimeProps
    {
        private LambdaRuntimePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.</summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? SupportsInlineCode
        {
            get => GetInstanceProperty<bool? >();
        }
    }
}