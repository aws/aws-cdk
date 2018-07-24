using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the {@link AmazonS3Source S3 source action}</summary>
    [JsiiInterfaceProxy(typeof(IAmazonS3SourceProps), "@aws-cdk/aws-codepipeline.AmazonS3SourceProps")]
    internal class AmazonS3SourcePropsProxy : DeputyBase, IAmazonS3SourceProps
    {
        private AmazonS3SourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        public virtual string ArtifactName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The Amazon S3 bucket that stores the source code</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        public virtual BucketRef Bucket
        {
            get => GetInstanceProperty<BucketRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The key within the S3 bucket that stores the source code</summary>
        [JsiiProperty("bucketKey", "{\"primitive\":\"string\"}")]
        public virtual string BucketKey
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? PollForSourceChanges
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}