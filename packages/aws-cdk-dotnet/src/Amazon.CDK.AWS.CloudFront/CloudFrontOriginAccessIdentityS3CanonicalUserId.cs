using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiClass(typeof(CloudFrontOriginAccessIdentityS3CanonicalUserId), "@aws-cdk/aws-cloudfront.CloudFrontOriginAccessIdentityS3CanonicalUserId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFrontOriginAccessIdentityS3CanonicalUserId : Token
    {
        public CloudFrontOriginAccessIdentityS3CanonicalUserId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFrontOriginAccessIdentityS3CanonicalUserId(ByRefValue reference): base(reference)
        {
        }

        protected CloudFrontOriginAccessIdentityS3CanonicalUserId(DeputyProps props): base(props)
        {
        }
    }
}