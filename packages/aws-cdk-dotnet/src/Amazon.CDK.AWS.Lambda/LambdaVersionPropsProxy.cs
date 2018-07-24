using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Properties for a new Lambda version</summary>
    [JsiiInterfaceProxy(typeof(ILambdaVersionProps), "@aws-cdk/aws-lambda.LambdaVersionProps")]
    internal class LambdaVersionPropsProxy : DeputyBase, ILambdaVersionProps
    {
        private LambdaVersionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// SHA256 of the version of the Lambda source code
        /// 
        /// Specify to validate that you're deploying the right version.
        /// </summary>
        /// <remarks>default: No validation is performed</remarks>
        [JsiiProperty("codeSha256", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string CodeSha256
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Description of the version</summary>
        /// <remarks>default: Description of the Lambda</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Function to get the value of</summary>
        [JsiiProperty("lambda", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}")]
        public virtual LambdaRef Lambda
        {
            get => GetInstanceProperty<LambdaRef>();
            set => SetInstanceProperty(value);
        }
    }
}