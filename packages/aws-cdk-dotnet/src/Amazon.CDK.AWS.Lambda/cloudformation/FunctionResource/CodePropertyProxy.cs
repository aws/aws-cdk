using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html </remarks>
    [JsiiInterfaceProxy(typeof(ICodeProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty")]
    internal class CodePropertyProxy : DeputyBase, ICodeProperty
    {
        private CodePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.CodeProperty.S3Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3bucket </remarks>
        [JsiiProperty("s3Bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object S3Bucket
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.CodeProperty.S3Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3key </remarks>
        [JsiiProperty("s3Key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object S3Key
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.CodeProperty.S3ObjectVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3objectversion </remarks>
        [JsiiProperty("s3ObjectVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object S3ObjectVersion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.CodeProperty.ZipFile``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-zipfile </remarks>
        [JsiiProperty("zipFile", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ZipFile
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}