using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation.CustomActionTypeResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html </remarks>
    [JsiiInterfaceProxy(typeof(IArtifactDetailsProperty), "@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.ArtifactDetailsProperty")]
    internal class ArtifactDetailsPropertyProxy : DeputyBase, IArtifactDetailsProperty
    {
        private ArtifactDetailsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CustomActionTypeResource.ArtifactDetailsProperty.MaximumCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-maximumcount </remarks>
        [JsiiProperty("maximumCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MaximumCount
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CustomActionTypeResource.ArtifactDetailsProperty.MinimumCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-minimumcount </remarks>
        [JsiiProperty("minimumCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MinimumCount
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}