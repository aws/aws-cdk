using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiInterfaceProxy(typeof(ICrossAccountDestinationProps), "@aws-cdk/aws-logs.CrossAccountDestinationProps")]
    internal class CrossAccountDestinationPropsProxy : DeputyBase, ICrossAccountDestinationProps
    {
        private CrossAccountDestinationPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The name of the log destination.</summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("destinationName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string DestinationName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The role to assume that grants permissions to write to 'target'.
        /// 
        /// The role must be assumable by 'logs.{REGION}.amazonaws.com'.
        /// </summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\"}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The log destination target's ARN</summary>
        [JsiiProperty("targetArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn TargetArn
        {
            get => GetInstanceProperty<Arn>();
            set => SetInstanceProperty(value);
        }
    }
}