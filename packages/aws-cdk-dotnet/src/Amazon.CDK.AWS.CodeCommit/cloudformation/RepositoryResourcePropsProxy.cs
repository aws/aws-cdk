using Amazon.CDK;
using Amazon.CDK.AWS.CodeCommit.cloudformation.RepositoryResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html </remarks>
    [JsiiInterfaceProxy(typeof(IRepositoryResourceProps), "@aws-cdk/aws-codecommit.cloudformation.RepositoryResourceProps")]
    internal class RepositoryResourcePropsProxy : DeputyBase, IRepositoryResourceProps
    {
        private RepositoryResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CodeCommit::Repository.RepositoryName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositoryname </remarks>
        [JsiiProperty("repositoryName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RepositoryName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CodeCommit::Repository.RepositoryDescription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositorydescription </remarks>
        [JsiiProperty("repositoryDescription", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RepositoryDescription
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CodeCommit::Repository.Triggers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-triggers </remarks>
        [JsiiProperty("triggers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codecommit.cloudformation.RepositoryResource.RepositoryTriggerProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Triggers
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}