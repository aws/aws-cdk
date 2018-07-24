using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ApplicationVersionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-sourcebundle.html </remarks>
    [JsiiInterface(typeof(ISourceBundleProperty), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationVersionResource.SourceBundleProperty")]
    public interface ISourceBundleProperty
    {
        /// <summary>``ApplicationVersionResource.SourceBundleProperty.S3Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-sourcebundle.html#cfn-beanstalk-sourcebundle-s3bucket </remarks>
        [JsiiProperty("s3Bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object S3Bucket
        {
            get;
            set;
        }

        /// <summary>``ApplicationVersionResource.SourceBundleProperty.S3Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-sourcebundle.html#cfn-beanstalk-sourcebundle-s3key </remarks>
        [JsiiProperty("s3Key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object S3Key
        {
            get;
            set;
        }
    }
}