using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Lambda code from an S3 archive.</summary>
    [JsiiClass(typeof(LambdaS3Code), "@aws-cdk/aws-lambda.LambdaS3Code", "[{\"name\":\"bucket\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}},{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"objectVersion\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
    public class LambdaS3Code : LambdaCode
    {
        public LambdaS3Code(BucketRef bucket, string key, string objectVersion): base(new DeputyProps(new object[]{bucket, key, objectVersion}))
        {
        }

        protected LambdaS3Code(ByRefValue reference): base(reference)
        {
        }

        protected LambdaS3Code(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Called during stack synthesis to render the CodePropery for the
        /// Lambda function.
        /// </summary>
        [JsiiMethod("toJSON", "{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}", "[]")]
        public override ICodeProperty ToJSON()
        {
            return InvokeInstanceMethod<ICodeProperty>(new object[]{});
        }
    }
}