using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(LambdaCode), "@aws-cdk/aws-lambda.LambdaCode", "[]")]
    public abstract class LambdaCode : DeputyBase
    {
        protected LambdaCode(): base(new DeputyProps(new object[]{}))
        {
        }

        protected LambdaCode(ByRefValue reference): base(reference)
        {
        }

        protected LambdaCode(DeputyProps props): base(props)
        {
        }

        /// <param name = "bucket">The S3 bucket</param>
        /// <param name = "key">The object key</param>
        /// <param name = "objectVersion">Optional S3 object version</param>
        /// <returns>`LambdaS3Code` associated with the specified S3 object.</returns>
        [JsiiMethod("bucket", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaS3Code\"}", "[{\"name\":\"bucket\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}},{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"objectVersion\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
        public static LambdaS3Code Bucket(BucketRef bucket, string key, string objectVersion)
        {
            return InvokeStaticMethod<LambdaS3Code>(typeof(LambdaCode), new object[]{bucket, key, objectVersion});
        }

        /// <param name = "code">The actual handler code (limited to 4KiB)</param>
        /// <returns>`LambdaInlineCode` with inline code.</returns>
        [JsiiMethod("inline", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaInlineCode\"}", "[{\"name\":\"code\",\"type\":{\"primitive\":\"string\"}}]")]
        public static LambdaInlineCode Inline(string code)
        {
            return InvokeStaticMethod<LambdaInlineCode>(typeof(LambdaCode), new object[]{code});
        }

        /// <param name = "directoryToZip">The directory to zip</param>
        /// <returns>
        /// Zip archives the contents of a directory on disk and uses this
        /// as the lambda handler's code.
        /// </returns>
        [JsiiMethod("directory", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaAssetCode\"}", "[{\"name\":\"directoryToZip\",\"type\":{\"primitive\":\"string\"}}]")]
        public static LambdaAssetCode Directory(string directoryToZip)
        {
            return InvokeStaticMethod<LambdaAssetCode>(typeof(LambdaCode), new object[]{directoryToZip});
        }

        /// <param name = "filePath">The file path</param>
        /// <returns>Uses a file on disk as a lambda handler's code.</returns>
        [JsiiMethod("file", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaAssetCode\"}", "[{\"name\":\"filePath\",\"type\":{\"primitive\":\"string\"}}]")]
        public static LambdaAssetCode File(string filePath)
        {
            return InvokeStaticMethod<LambdaAssetCode>(typeof(LambdaCode), new object[]{filePath});
        }

        /// <summary>
        /// Called during stack synthesis to render the CodePropery for the
        /// Lambda function.
        /// </summary>
        [JsiiMethod("toJSON", "{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}", "[]")]
        public abstract ICodeProperty ToJSON();
        /// <summary>
        /// Called when the lambda is initialized to allow this object to
        /// bind to the stack, add resources and have fun.
        /// </summary>
        [JsiiMethod("bind", null, "[{\"name\":\"_lambda\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.Lambda\"}}]")]
        public virtual void Bind(Lambda_ _lambda)
        {
            InvokeInstanceVoidMethod(new object[]{_lambda});
        }
    }
}