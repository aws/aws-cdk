using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cloud9.cloudformation.EnvironmentEC2Resource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html </remarks>
    [JsiiInterfaceProxy(typeof(IRepositoryProperty), "@aws-cdk/aws-cloud9.cloudformation.EnvironmentEC2Resource.RepositoryProperty")]
    internal class RepositoryPropertyProxy : DeputyBase, IRepositoryProperty
    {
        private RepositoryPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``EnvironmentEC2Resource.RepositoryProperty.PathComponent``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html#cfn-cloud9-environmentec2-repository-pathcomponent </remarks>
        [JsiiProperty("pathComponent", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PathComponent
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``EnvironmentEC2Resource.RepositoryProperty.RepositoryUrl``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html#cfn-cloud9-environmentec2-repository-repositoryurl </remarks>
        [JsiiProperty("repositoryUrl", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RepositoryUrl
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}