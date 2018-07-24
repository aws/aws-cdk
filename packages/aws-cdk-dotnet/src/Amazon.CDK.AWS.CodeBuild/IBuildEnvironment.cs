using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterface(typeof(IBuildEnvironment), "@aws-cdk/aws-codebuild.BuildEnvironment")]
    public interface IBuildEnvironment
    {
        /// <summary>The type of build environment. The only allowed value is LINUX_CONTAINER.</summary>
        /// <remarks>default: LINUX_CONTAINER</remarks>
        [JsiiProperty("type", "{\"primitive\":\"string\",\"optional\":true}")]
        string Type
        {
            get;
            set;
        }

        /// <summary>The Docker image identifier that the build environment uses.</summary>
        /// <remarks>
        /// default: aws/codebuild/ubuntu-base:14.04
        /// see: https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
        /// </remarks>
        [JsiiProperty("image", "{\"primitive\":\"string\",\"optional\":true}")]
        string Image
        {
            get;
            set;
        }

        /// <summary>
        /// The type of compute to use for this build. See the
        /// ComputeType enum for options.
        /// </summary>
        /// <remarks>default: ComputeType.Small</remarks>
        [JsiiProperty("computeType", "{\"fqn\":\"@aws-cdk/aws-codebuild.ComputeType\",\"optional\":true}")]
        ComputeType ComputeType
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates how the project builds Docker images. Specify true to enable
        /// running the Docker daemon inside a Docker container. This value must be
        /// set to true only if this build project will be used to build Docker
        /// images, and the specified build environment image is not one provided by
        /// AWS CodeBuild with Docker support. Otherwise, all associated builds that
        /// attempt to interact with the Docker daemon will fail.
        /// </summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("priviledged", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? Priviledged
        {
            get;
            set;
        }

        /// <summary>The environment variables that your builds can use.</summary>
        [JsiiProperty("environmentVariables", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildEnvironmentVariable\"}},\"optional\":true}")]
        IDictionary<string, IBuildEnvironmentVariable> EnvironmentVariables
        {
            get;
            set;
        }
    }
}