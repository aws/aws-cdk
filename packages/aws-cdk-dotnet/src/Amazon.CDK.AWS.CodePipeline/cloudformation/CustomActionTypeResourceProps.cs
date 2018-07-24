using Amazon.CDK;
using Amazon.CDK.AWS.CodePipeline.cloudformation.CustomActionTypeResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html </remarks>
    public class CustomActionTypeResourceProps : DeputyBase, ICustomActionTypeResourceProps
    {
        /// <summary>``AWS::CodePipeline::CustomActionType.Category``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category </remarks>
        [JsiiProperty("category", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Category
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.InputArtifactDetails``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails </remarks>
        [JsiiProperty("inputArtifactDetails", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.ArtifactDetailsProperty\"}]}}", true)]
        public object InputArtifactDetails
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.OutputArtifactDetails``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails </remarks>
        [JsiiProperty("outputArtifactDetails", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.ArtifactDetailsProperty\"}]}}", true)]
        public object OutputArtifactDetails
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.Provider``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider </remarks>
        [JsiiProperty("provider", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Provider
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.ConfigurationProperties``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties </remarks>
        [JsiiProperty("configurationProperties", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.ConfigurationPropertiesProperty\"}]}}}}]},\"optional\":true}", true)]
        public object ConfigurationProperties
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.Settings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings </remarks>
        [JsiiProperty("settings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource.SettingsProperty\"}]},\"optional\":true}", true)]
        public object Settings
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::CustomActionType.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Version
        {
            get;
            set;
        }
    }
}