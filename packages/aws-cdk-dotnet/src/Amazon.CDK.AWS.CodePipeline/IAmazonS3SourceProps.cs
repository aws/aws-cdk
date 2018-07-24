using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the {@link AmazonS3Source S3 source action}</summary>
    [JsiiInterface(typeof(IAmazonS3SourceProps), "@aws-cdk/aws-codepipeline.AmazonS3SourceProps")]
    public interface IAmazonS3SourceProps
    {
        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        string ArtifactName
        {
            get;
            set;
        }

        /// <summary>The Amazon S3 bucket that stores the source code</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        BucketRef Bucket
        {
            get;
            set;
        }

        /// <summary>The key within the S3 bucket that stores the source code</summary>
        [JsiiProperty("bucketKey", "{\"primitive\":\"string\"}")]
        string BucketKey
        {
            get;
            set;
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? PollForSourceChanges
        {
            get;
            set;
        }
    }
}