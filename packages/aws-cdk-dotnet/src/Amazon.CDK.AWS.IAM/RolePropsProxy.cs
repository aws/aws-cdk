using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiInterfaceProxy(typeof(IRoleProps), "@aws-cdk/aws-iam.RoleProps")]
    internal class RolePropsProxy : DeputyBase, IRoleProps
    {
        private RolePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`)
        /// which can assume this role.
        /// 
        /// You can later modify the assume role policy document by accessing it via
        /// the `assumeRolePolicy` property.
        /// </summary>
        [JsiiProperty("assumedBy", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        public virtual PolicyPrincipal AssumedBy
        {
            get => GetInstanceProperty<PolicyPrincipal>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A list of ARNs for managed policies associated with this role.
        /// You can add managed policies later using `addManagedPolicy(arn)`.
        /// </summary>
        /// <remarks>default: No managed policies.</remarks>
        [JsiiProperty("managedPolicyArns", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        public virtual object[] ManagedPolicyArns
        {
            get => GetInstanceProperty<object[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The path associated with this role. For information about IAM paths, see
        /// Friendly Names and Paths in IAM User Guide.
        /// </summary>
        [JsiiProperty("path", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A name for the IAM role. For valid values, see the RoleName parameter for
        /// the CreateRole action in the IAM API Reference. If you don't specify a
        /// name, AWS CloudFormation generates a unique physical ID and uses that ID
        /// for the group name.
        /// 
        /// IMPORTANT: If you specify a name, you cannot perform updates that require
        /// replacement of this resource. You can perform updates that require no or
        /// some interruption. If you must replace the resource, specify a new name.
        /// 
        /// If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
        /// acknowledge your template's capabilities. For more information, see
        /// Acknowledging IAM Resources in AWS CloudFormation Templates.
        /// </summary>
        [JsiiProperty("roleName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string RoleName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}