using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the {@link AmazonS3Source S3 source action}</summary>
    public class AmazonS3SourceProps : DeputyBase, IAmazonS3SourceProps
    {
        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}", true)]
        public string ArtifactName
        {
            get;
            set;
        }

        /// <summary>The Amazon S3 bucket that stores the source code</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}", true)]
        public BucketRef Bucket
        {
            get;
            set;
        }

        /// <summary>The key within the S3 bucket that stores the source code</summary>
        [JsiiProperty("bucketKey", "{\"primitive\":\"string\"}", true)]
        public string BucketKey
        {
            get;
            set;
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? PollForSourceChanges
        {
            get;
            set;
        }
    }
}