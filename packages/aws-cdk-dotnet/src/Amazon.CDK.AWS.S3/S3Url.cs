using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>The web URL (https://s3.us-west-1.amazonaws.com/bucket/key) of an S3 object.</summary>
    [JsiiClass(typeof(S3Url), "@aws-cdk/aws-s3.S3Url", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class S3Url : Token
    {
        public S3Url(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected S3Url(ByRefValue reference): base(reference)
        {
        }

        protected S3Url(DeputyProps props): base(props)
        {
        }
    }
}