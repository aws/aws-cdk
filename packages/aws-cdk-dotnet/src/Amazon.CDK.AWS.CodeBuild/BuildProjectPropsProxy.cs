using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.KMS;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterfaceProxy(typeof(IBuildProjectProps), "@aws-cdk/aws-codebuild.BuildProjectProps")]
    internal class BuildProjectPropsProxy : DeputyBase, IBuildProjectProps
    {
        private BuildProjectPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The source of the build.</summary>
        [JsiiProperty("source", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildSource\"}")]
        public virtual BuildSource Source
        {
            get => GetInstanceProperty<BuildSource>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A description of the project. Use the description to identify the purpose
        /// of the project.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Filename or contents of buildspec in JSON format.</summary>
        /// <remarks>see: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-example</remarks>
        [JsiiProperty("buildSpec", "{\"primitive\":\"json\",\"optional\":true}")]
        public virtual JObject BuildSpec
        {
            get => GetInstanceProperty<JObject>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Service Role to assume while running the build.
        /// If not specified, a role will be created.
        /// </summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Encryption key to use to read and write artifacts
        /// If not specified, a role will be created.
        /// </summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public virtual EncryptionKeyRef EncryptionKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Bucket to store cached source artifacts
        /// If not specified, source artifacts will not be cached.
        /// </summary>
        [JsiiProperty("cacheBucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}")]
        public virtual BucketRef CacheBucket
        {
            get => GetInstanceProperty<BucketRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Subdirectory to store cached artifacts</summary>
        [JsiiProperty("cacheDir", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string CacheDir
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Build environment to use for the build.</summary>
        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildEnvironment\",\"optional\":true}")]
        public virtual IBuildEnvironment Environment
        {
            get => GetInstanceProperty<IBuildEnvironment>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Indicates whether AWS CodeBuild generates a publicly accessible URL for
        /// your project's build badge. For more information, see Build Badges Sample
        /// in the AWS CodeBuild User Guide.
        /// </summary>
        [JsiiProperty("badge", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Badge
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The number of minutes after which AWS CodeBuild stops the build if it's
        /// not complete. For valid values, see the timeoutInMinutes field in the AWS
        /// CodeBuild User Guide.
        /// </summary>
        [JsiiProperty("timeout", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Timeout
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Defines where build artifacts will be stored.
        /// Could be: PipelineBuildArtifacts, NoBuildArtifacts and S3BucketBuildArtifacts.
        /// </summary>
        /// <remarks>default: NoBuildArtifacts</remarks>
        [JsiiProperty("artifacts", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildArtifacts\",\"optional\":true}")]
        public virtual BuildArtifacts Artifacts
        {
            get => GetInstanceProperty<BuildArtifacts>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Additional environment variables to add to the build environment.</summary>
        [JsiiProperty("environmentVariables", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildEnvironmentVariable\"}},\"optional\":true}")]
        public virtual IDictionary<string, IBuildEnvironmentVariable> EnvironmentVariables
        {
            get => GetInstanceProperty<IDictionary<string, IBuildEnvironmentVariable>>();
            set => SetInstanceProperty(value);
        }
    }
}