using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolRoleAttachmentResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html </remarks>
    [JsiiInterface(typeof(IRoleMappingProperty), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResource.RoleMappingProperty")]
    public interface IRoleMappingProperty
    {
        /// <summary>``IdentityPoolRoleAttachmentResource.RoleMappingProperty.AmbiguousRoleResolution``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-ambiguousroleresolution </remarks>
        [JsiiProperty("ambiguousRoleResolution", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AmbiguousRoleResolution
        {
            get;
            set;
        }

        /// <summary>``IdentityPoolRoleAttachmentResource.RoleMappingProperty.RulesConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-rulesconfiguration </remarks>
        [JsiiProperty("rulesConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResource.RulesConfigurationTypeProperty\"}]},\"optional\":true}")]
        object RulesConfiguration
        {
            get;
            set;
        }

        /// <summary>``IdentityPoolRoleAttachmentResource.RoleMappingProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }
    }
}