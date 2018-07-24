using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.IAM.cloudformation.RoleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-policy.html </remarks>
    [JsiiInterfaceProxy(typeof(IPolicyProperty), "@aws-cdk/aws-iam.cloudformation.RoleResource.PolicyProperty")]
    internal class PolicyPropertyProxy : DeputyBase, Amazon.CDK.AWS.IAM.cloudformation.RoleResource.IPolicyProperty
    {
        private PolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RoleResource.PolicyProperty.PolicyDocument``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-policy.html#cfn-iam-policies-policydocument </remarks>
        [JsiiProperty("policyDocument", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyDocument
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RoleResource.PolicyProperty.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-policy.html#cfn-iam-policies-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}