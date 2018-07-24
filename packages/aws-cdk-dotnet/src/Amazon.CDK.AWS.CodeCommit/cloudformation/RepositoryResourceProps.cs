using Amazon.CDK;
using Amazon.CDK.AWS.CodeCommit.cloudformation.RepositoryResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html </remarks>
    public class RepositoryResourceProps : DeputyBase, IRepositoryResourceProps
    {
        /// <summary>``AWS::CodeCommit::Repository.RepositoryName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositoryname </remarks>
        [JsiiProperty("repositoryName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RepositoryName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeCommit::Repository.RepositoryDescription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositorydescription </remarks>
        [JsiiProperty("repositoryDescription", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RepositoryDescription
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeCommit::Repository.Triggers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-triggers </remarks>
        [JsiiProperty("triggers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codecommit.cloudformation.RepositoryResource.RepositoryTriggerProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Triggers
        {
            get;
            set;
        }
    }
}