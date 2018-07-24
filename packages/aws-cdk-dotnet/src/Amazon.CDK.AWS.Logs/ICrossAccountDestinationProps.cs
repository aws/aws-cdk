using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiInterface(typeof(ICrossAccountDestinationProps), "@aws-cdk/aws-logs.CrossAccountDestinationProps")]
    public interface ICrossAccountDestinationProps
    {
        /// <summary>The name of the log destination.</summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("destinationName", "{\"primitive\":\"string\",\"optional\":true}")]
        string DestinationName
        {
            get;
            set;
        }

        /// <summary>
        /// The role to assume that grants permissions to write to 'target'.
        /// 
        /// The role must be assumable by 'logs.{REGION}.amazonaws.com'.
        /// </summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\"}")]
        Role Role
        {
            get;
            set;
        }

        /// <summary>The log destination target's ARN</summary>
        [JsiiProperty("targetArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        Arn TargetArn
        {
            get;
            set;
        }
    }
}