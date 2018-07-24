using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolRoleAttachmentResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html </remarks>
    [JsiiInterface(typeof(IRulesConfigurationTypeProperty), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResource.RulesConfigurationTypeProperty")]
    public interface IRulesConfigurationTypeProperty
    {
        /// <summary>``IdentityPoolRoleAttachmentResource.RulesConfigurationTypeProperty.Rules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html#cfn-cognito-identitypoolroleattachment-rulesconfigurationtype-rules </remarks>
        [JsiiProperty("rules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResource.MappingRuleProperty\"}]}}}}]}}")]
        object Rules
        {
            get;
            set;
        }
    }
}