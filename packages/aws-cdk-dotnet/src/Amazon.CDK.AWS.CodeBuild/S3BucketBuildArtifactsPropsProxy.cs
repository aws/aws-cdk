using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterfaceProxy(typeof(IS3BucketBuildArtifactsProps), "@aws-cdk/aws-codebuild.S3BucketBuildArtifactsProps")]
    internal class S3BucketBuildArtifactsPropsProxy : DeputyBase, IS3BucketBuildArtifactsProps
    {
        private S3BucketBuildArtifactsPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The name of the output bucket.</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        public virtual BucketRef Bucket
        {
            get => GetInstanceProperty<BucketRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The path inside of the bucket for the build output .zip file or folder.
        /// If a value is not specified, then build output will be stored at the root of the
        /// bucket (or under the &lt;build-id&gt; directory if `includeBuildId` is set to true).
        /// </summary>
        [JsiiProperty("path", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The name of the build output ZIP file or folder inside the bucket.
        /// 
        /// The full S3 object key will be "&lt;path&gt;/build-ID/&lt;name&gt;" or
        /// "&lt;path&gt;/&lt;artifactsName&gt;" depending on whether `includeBuildId` is set to true.
        /// </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Indicates if the build ID should be included in the path. If this is set to true,
        /// then the build artifact will be stored in "&lt;path&gt;/&lt;build-id&gt;/&lt;name&gt;".
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("includeBuildID", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? IncludeBuildID
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// If this is true, all build output will be packaged into a single .zip file.
        /// Otherwise, all files will be uploaded to &lt;path&gt;/&lt;name&gt;
        /// </summary>
        /// <remarks>default: true - files will be archived</remarks>
        [JsiiProperty("packageZip", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? PackageZip
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}