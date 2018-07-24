using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html </remarks>
    [JsiiInterface(typeof(IAccessControlTranslationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.AccessControlTranslationProperty")]
    public interface IAccessControlTranslationProperty
    {
        /// <summary>``BucketResource.AccessControlTranslationProperty.Owner``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html#cfn-s3-bucket-accesscontroltranslation-owner </remarks>
        [JsiiProperty("owner", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Owner
        {
            get;
            set;
        }
    }
}