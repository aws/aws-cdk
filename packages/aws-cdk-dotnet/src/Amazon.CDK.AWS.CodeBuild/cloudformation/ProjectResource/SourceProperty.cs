using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html </remarks>
    public class SourceProperty : DeputyBase, ISourceProperty
    {
        /// <summary>``ProjectResource.SourceProperty.Auth``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-auth </remarks>
        [JsiiProperty("auth", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceAuthProperty\"}]},\"optional\":true}", true)]
        public object Auth
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.SourceProperty.BuildSpec``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-buildspec </remarks>
        [JsiiProperty("buildSpec", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BuildSpec
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.SourceProperty.GitCloneDepth``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-gitclonedepth </remarks>
        [JsiiProperty("gitCloneDepth", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object GitCloneDepth
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.SourceProperty.InsecureSsl``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-insecuressl </remarks>
        [JsiiProperty("insecureSsl", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InsecureSsl
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.SourceProperty.Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-location </remarks>
        [JsiiProperty("location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Location
        {
            get;
            set;
        }

        /// <summary>``ProjectResource.SourceProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Type
        {
            get;
            set;
        }
    }
}