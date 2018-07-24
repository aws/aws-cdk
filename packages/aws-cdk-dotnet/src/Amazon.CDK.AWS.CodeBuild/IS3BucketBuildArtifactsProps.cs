using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterface(typeof(IS3BucketBuildArtifactsProps), "@aws-cdk/aws-codebuild.S3BucketBuildArtifactsProps")]
    public interface IS3BucketBuildArtifactsProps
    {
        /// <summary>The name of the output bucket.</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        BucketRef Bucket
        {
            get;
            set;
        }

        /// <summary>
        /// The path inside of the bucket for the build output .zip file or folder.
        /// If a value is not specified, then build output will be stored at the root of the
        /// bucket (or under the &lt;build-id&gt; directory if `includeBuildId` is set to true).
        /// </summary>
        [JsiiProperty("path", "{\"primitive\":\"string\",\"optional\":true}")]
        string Path
        {
            get;
            set;
        }

        /// <summary>
        /// The name of the build output ZIP file or folder inside the bucket.
        /// 
        /// The full S3 object key will be "&lt;path&gt;/build-ID/&lt;name&gt;" or
        /// "&lt;path&gt;/&lt;artifactsName&gt;" depending on whether `includeBuildId` is set to true.
        /// </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        string Name
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates if the build ID should be included in the path. If this is set to true,
        /// then the build artifact will be stored in "&lt;path&gt;/&lt;build-id&gt;/&lt;name&gt;".
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("includeBuildID", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? IncludeBuildID
        {
            get;
            set;
        }

        /// <summary>
        /// If this is true, all build output will be packaged into a single .zip file.
        /// Otherwise, all files will be uploaded to &lt;path&gt;/&lt;name&gt;
        /// </summary>
        /// <remarks>default: true - files will be archived</remarks>
        [JsiiProperty("packageZip", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? PackageZip
        {
            get;
            set;
        }
    }
}