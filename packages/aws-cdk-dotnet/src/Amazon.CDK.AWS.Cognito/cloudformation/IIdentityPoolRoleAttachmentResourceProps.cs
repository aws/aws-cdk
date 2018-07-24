using Amazon.CDK;
using Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolRoleAttachmentResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html </remarks>
    [JsiiInterface(typeof(IIdentityPoolRoleAttachmentResourceProps), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResourceProps")]
    public interface IIdentityPoolRoleAttachmentResourceProps
    {
        /// <summary>``AWS::Cognito::IdentityPoolRoleAttachment.IdentityPoolId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-identitypoolid </remarks>
        [JsiiProperty("identityPoolId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IdentityPoolId
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPoolRoleAttachment.RoleMappings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-rolemappings </remarks>
        [JsiiProperty("roleMappings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolRoleAttachmentResource.RoleMappingProperty\"}]}}}}]},\"optional\":true}")]
        object RoleMappings
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPoolRoleAttachment.Roles``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-roles </remarks>
        [JsiiProperty("roles", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Roles
        {
            get;
            set;
        }
    }
}