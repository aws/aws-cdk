using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.S3.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html </remarks>
    [JsiiInterfaceProxy(typeof(IBucketPolicyResourceProps), "@aws-cdk/aws-s3.cloudformation.BucketPolicyResourceProps")]
    internal class BucketPolicyResourcePropsProxy : DeputyBase, IBucketPolicyResourceProps
    {
        private BucketPolicyResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::S3::BucketPolicy.Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-bucket </remarks>
        [JsiiProperty("bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Bucket
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::S3::BucketPolicy.PolicyDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-policydocument </remarks>
        [JsiiProperty("policyDocument", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}