using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECR.cloudformation.RepositoryResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html </remarks>
    [JsiiInterface(typeof(ILifecyclePolicyProperty), "@aws-cdk/aws-ecr.cloudformation.RepositoryResource.LifecyclePolicyProperty")]
    public interface ILifecyclePolicyProperty
    {
        /// <summary>``RepositoryResource.LifecyclePolicyProperty.LifecyclePolicyText``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-lifecyclepolicytext </remarks>
        [JsiiProperty("lifecyclePolicyText", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LifecyclePolicyText
        {
            get;
            set;
        }

        /// <summary>``RepositoryResource.LifecyclePolicyProperty.RegistryId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-registryid </remarks>
        [JsiiProperty("registryId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RegistryId
        {
            get;
            set;
        }
    }
}