using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GameLift.cloudformation.BuildResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html </remarks>
    [JsiiInterface(typeof(IS3LocationProperty), "@aws-cdk/aws-gamelift.cloudformation.BuildResource.S3LocationProperty")]
    public interface IS3LocationProperty
    {
        /// <summary>``BuildResource.S3LocationProperty.Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storage-bucket </remarks>
        [JsiiProperty("bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Bucket
        {
            get;
            set;
        }

        /// <summary>``BuildResource.S3LocationProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storage-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Key
        {
            get;
            set;
        }

        /// <summary>``BuildResource.S3LocationProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storage-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RoleArn
        {
            get;
            set;
        }
    }
}