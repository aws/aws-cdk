using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    [JsiiInterfaceProxy(typeof(IPipelineProps), "@aws-cdk/aws-codepipeline.PipelineProps")]
    internal class PipelinePropsProxy : DeputyBase, IPipelineProps
    {
        private PipelinePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The S3 bucket used by this Pipeline to store artifacts.
        /// If not specified, a new S3 bucket will be created.
        /// </summary>
        [JsiiProperty("artifactBucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}")]
        public virtual BucketRef ArtifactBucket
        {
            get => GetInstanceProperty<BucketRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Indicates whether to rerun the AWS CodePipeline pipeline after you update it.</summary>
        [JsiiProperty("restartExecutionOnUpdate", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? RestartExecutionOnUpdate
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Name of the pipeline. If you don't specify a name,  AWS CloudFormation generates an ID
        /// and uses that for the pipeline name.
        /// </summary>
        [JsiiProperty("pipelineName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string PipelineName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}