using Amazon.CDK;
using Amazon.CDK.AWS.IAM.cloudformation.RoleResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html </remarks>
    [JsiiInterface(typeof(IRoleResourceProps), "@aws-cdk/aws-iam.cloudformation.RoleResourceProps")]
    public interface IRoleResourceProps
    {
        /// <summary>``AWS::IAM::Role.AssumeRolePolicyDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-assumerolepolicydocument </remarks>
        [JsiiProperty("assumeRolePolicyDocument", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AssumeRolePolicyDocument
        {
            get;
            set;
        }

        /// <summary>``AWS::IAM::Role.ManagedPolicyArns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-managepolicyarns </remarks>
        [JsiiProperty("managedPolicyArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object ManagedPolicyArns
        {
            get;
            set;
        }

        /// <summary>``AWS::IAM::Role.MaxSessionDuration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-maxsessionduration </remarks>
        [JsiiProperty("maxSessionDuration", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MaxSessionDuration
        {
            get;
            set;
        }

        /// <summary>``AWS::IAM::Role.Path``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-path </remarks>
        [JsiiProperty("path", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Path
        {
            get;
            set;
        }

        /// <summary>``AWS::IAM::Role.Policies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-policies </remarks>
        [JsiiProperty("policies", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.RoleResource.PolicyProperty\"}]}}}}]},\"optional\":true}")]
        object Policies
        {
            get;
            set;
        }

        /// <summary>``AWS::IAM::Role.RoleName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-rolename </remarks>
        [JsiiProperty("roleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RoleName
        {
            get;
            set;
        }
    }
}