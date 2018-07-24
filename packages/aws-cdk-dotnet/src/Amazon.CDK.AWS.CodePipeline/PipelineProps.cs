using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    public class PipelineProps : DeputyBase, IPipelineProps
    {
        /// <summary>
        /// The S3 bucket used by this Pipeline to store artifacts.
        /// If not specified, a new S3 bucket will be created.
        /// </summary>
        [JsiiProperty("artifactBucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}", true)]
        public BucketRef ArtifactBucket
        {
            get;
            set;
        }

        /// <summary>Indicates whether to rerun the AWS CodePipeline pipeline after you update it.</summary>
        [JsiiProperty("restartExecutionOnUpdate", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? RestartExecutionOnUpdate
        {
            get;
            set;
        }

        /// <summary>
        /// Name of the pipeline. If you don't specify a name,  AWS CloudFormation generates an ID
        /// and uses that for the pipeline name.
        /// </summary>
        [JsiiProperty("pipelineName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string PipelineName
        {
            get;
            set;
        }
    }
}