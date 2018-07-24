using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html </remarks>
    [JsiiInterface(typeof(ICodeProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty")]
    public interface ICodeProperty
    {
        /// <summary>``FunctionResource.CodeProperty.S3Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3bucket </remarks>
        [JsiiProperty("s3Bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3Bucket
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.CodeProperty.S3Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3key </remarks>
        [JsiiProperty("s3Key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3Key
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.CodeProperty.S3ObjectVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3objectversion </remarks>
        [JsiiProperty("s3ObjectVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3ObjectVersion
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.CodeProperty.ZipFile``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-zipfile </remarks>
        [JsiiProperty("zipFile", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ZipFile
        {
            get;
            set;
        }
    }
}