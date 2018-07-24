using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiClass(typeof(BucketArn), "@aws-cdk/aws-s3.BucketArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class BucketArn : Arn
    {
        public BucketArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected BucketArn(ByRefValue reference): base(reference)
        {
        }

        protected BucketArn(DeputyProps props): base(props)
        {
        }
    }
}