using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECR.cloudformation.RepositoryResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html </remarks>
    [JsiiInterfaceProxy(typeof(ILifecyclePolicyProperty), "@aws-cdk/aws-ecr.cloudformation.RepositoryResource.LifecyclePolicyProperty")]
    internal class LifecyclePolicyPropertyProxy : DeputyBase, ILifecyclePolicyProperty
    {
        private LifecyclePolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RepositoryResource.LifecyclePolicyProperty.LifecyclePolicyText``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-lifecyclepolicytext </remarks>
        [JsiiProperty("lifecyclePolicyText", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object LifecyclePolicyText
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RepositoryResource.LifecyclePolicyProperty.RegistryId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-registryid </remarks>
        [JsiiProperty("registryId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RegistryId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}