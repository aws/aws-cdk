using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html </remarks>
    [JsiiInterface(typeof(IEnvironmentProperty), "@aws-cdk/aws-codebuild.cloudformation.ProjectResource.EnvironmentProperty")]
    public interface IEnvironmentProperty
    {
        /// <summary>``ProjectResource.EnvironmentProperty.ComputeType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html#cfn-codebuild-project-environment-computetype </remarks>
        [JsiiProperty("computeType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ComputeType
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.EnvironmentProperty.EnvironmentVariables``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html#cfn-codebuild-project-environment-environmentvariables </remarks>
        [JsiiProperty("environmentVariables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.EnvironmentVariableProperty\"}]}}}}]},\"optional\":true}")]
        object EnvironmentVariables
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.EnvironmentProperty.Image``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html#cfn-codebuild-project-environment-image </remarks>
        [JsiiProperty("image", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Image
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.EnvironmentProperty.PrivilegedMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html#cfn-codebuild-project-environment-privilegedmode </remarks>
        [JsiiProperty("privilegedMode", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PrivilegedMode
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.EnvironmentProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-environment.html#cfn-codebuild-project-environment-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }
    }
}