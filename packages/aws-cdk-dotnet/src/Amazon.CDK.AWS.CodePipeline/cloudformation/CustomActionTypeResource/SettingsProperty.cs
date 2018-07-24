using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation.CustomActionTypeResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html </remarks>
    public class SettingsProperty : DeputyBase, ISettingsProperty
    {
        /// <summary>``CustomActionTypeResource.SettingsProperty.EntityUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-entityurltemplate </remarks>
        [JsiiProperty("entityUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EntityUrlTemplate
        {
            get;
            set;
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.ExecutionUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-executionurltemplate </remarks>
        [JsiiProperty("executionUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ExecutionUrlTemplate
        {
            get;
            set;
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.RevisionUrlTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-revisionurltemplate </remarks>
        [JsiiProperty("revisionUrlTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RevisionUrlTemplate
        {
            get;
            set;
        }

        /// <summary>``CustomActionTypeResource.SettingsProperty.ThirdPartyConfigurationUrl``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-thirdpartyconfigurationurl </remarks>
        [JsiiProperty("thirdPartyConfigurationUrl", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ThirdPartyConfigurationUrl
        {
            get;
            set;
        }
    }
}