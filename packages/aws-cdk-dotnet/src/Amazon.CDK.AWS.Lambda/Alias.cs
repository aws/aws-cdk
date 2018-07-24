using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>A new alias to a particular version of a Lambda function.</summary>
    [JsiiClass(typeof(Alias), "@aws-cdk/aws-lambda.Alias", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.AliasProps\"}}]")]
    public class Alias : LambdaRef
    {
        public Alias(Construct parent, string name, IAliasProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Alias(ByRefValue reference): base(reference)
        {
        }

        protected Alias(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// ARN of this alias
        /// 
        /// Used to be able to use Alias in place of a regular Lambda. Lambda accepts
        /// ARNs everywhere it accepts function names.
        /// </summary>
        [JsiiProperty("functionName", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionName\"}")]
        public override FunctionName FunctionName
        {
            get => GetInstanceProperty<FunctionName>();
        }

        /// <summary>
        /// ARN of this alias
        /// 
        /// Used to be able to use Alias in place of a regular Lambda. Lambda accepts
        /// ARNs everywhere it accepts function names.
        /// </summary>
        [JsiiProperty("functionArn", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionArn\"}")]
        public override FunctionArn FunctionArn
        {
            get => GetInstanceProperty<FunctionArn>();
        }

        /// <summary>Role associated with this alias</summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public override Role Role
        {
            get => GetInstanceProperty<Role>();
        }

        /// <summary>
        /// Whether the addPermission() call adds any permissions
        /// 
        /// True for new Lambdas, false for imported Lambdas (they might live in different accounts).
        /// </summary>
        [JsiiProperty("canCreatePermissions", "{\"primitive\":\"boolean\"}")]
        protected override bool CanCreatePermissions
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Adds a permission to the Lambda resource policy.</summary>
        [JsiiMethod("addPermission", null, "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"permission\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaPermission\"}}]")]
        public override void AddPermission(string name, ILambdaPermission permission)
        {
            InvokeInstanceVoidMethod(new object[]{name, permission});
        }
    }
}