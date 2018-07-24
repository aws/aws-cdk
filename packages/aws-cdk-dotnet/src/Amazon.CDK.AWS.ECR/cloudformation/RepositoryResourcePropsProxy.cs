using Amazon.CDK;
using Amazon.CDK.AWS.ECR.cloudformation.RepositoryResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.ECR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html </remarks>
    [JsiiInterfaceProxy(typeof(IRepositoryResourceProps), "@aws-cdk/aws-ecr.cloudformation.RepositoryResourceProps")]
    internal class RepositoryResourcePropsProxy : DeputyBase, IRepositoryResourceProps
    {
        private RepositoryResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ECR::Repository.LifecyclePolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-lifecyclepolicy </remarks>
        [JsiiProperty("lifecyclePolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-ecr.cloudformation.RepositoryResource.LifecyclePolicyProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object LifecyclePolicy
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ECR::Repository.RepositoryName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositoryname </remarks>
        [JsiiProperty("repositoryName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RepositoryName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ECR::Repository.RepositoryPolicyText``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositorypolicytext </remarks>
        [JsiiProperty("repositoryPolicyText", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RepositoryPolicyText
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}