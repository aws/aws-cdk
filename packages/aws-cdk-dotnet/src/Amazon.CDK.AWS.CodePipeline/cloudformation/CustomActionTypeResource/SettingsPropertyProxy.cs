using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation.CustomActionTypeResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html </remarks>
    [JsiiInterfaceProxy(typeof(ISettingsProperty), "@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.SettingsProperty")]
    internal class SettingsPropertyProxy : DeputyBase, ISettingsProperty
    {
        private SettingsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.EntityUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-entityurltemplate </remarks>
        [JsiiProperty("entityUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EntityUrlTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.ExecutionUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-executionurltemplate </remarks>
        [JsiiProperty("executionUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ExecutionUrlTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.RevisionUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-revisionurltemplate </remarks>
        [JsiiProperty("revisionUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RevisionUrlTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.ThirdPartyConfigurationUrl``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-thirdpartyconfigurationurl </remarks>
        [JsiiProperty("thirdPartyConfigurationUrl", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ThirdPartyConfigurationUrl
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}