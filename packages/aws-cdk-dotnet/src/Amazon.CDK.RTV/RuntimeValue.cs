using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.RTV
{
    /// <summary>
    /// Defines a value published from construction code which needs to be accessible
    /// by runtime code.
    /// </summary>
    [JsiiClass(typeof(RuntimeValue), "@aws-cdk/rtv.RuntimeValue", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/rtv.RuntimeValueProps\"}}]")]
    public class RuntimeValue : Construct
    {
        public RuntimeValue(Construct parent, string name, IRuntimeValueProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected RuntimeValue(ByRefValue reference): base(reference)
        {
        }

        protected RuntimeValue(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// The recommended name of the environment variable to use to set the stack name
        /// from which the runtime value is published.
        /// </summary>
        [JsiiProperty("ENV_NAME", "{\"primitive\":\"string\"}")]
        public static string ENV_NAME
        {
            get;
        }

        = GetStaticProperty<string>(typeof(RuntimeValue));
        /// <summary>The value to assign to the `RTV_STACK_NAME` environment variable.</summary>
        [JsiiProperty("ENV_VALUE", "{\"fqn\":\"@aws-cdk/cdk.AwsStackName\"}")]
        public static AwsStackName ENV_VALUE
        {
            get;
        }

        = GetStaticProperty<AwsStackName>(typeof(RuntimeValue));
        /// <summary>The name of the runtime parameter.</summary>
        [JsiiProperty("parameterName", "{\"fqn\":\"@aws-cdk/rtv.ParameterName\"}")]
        public virtual ParameterName ParameterName
        {
            get => GetInstanceProperty<ParameterName>();
        }

        /// <summary>The ARN fo the SSM parameter used for this runtime value.</summary>
        [JsiiProperty("parameterArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn ParameterArn
        {
            get => GetInstanceProperty<Arn>();
        }

        /// <summary>Grants a principal read permissions on this runtime value.</summary>
        /// <param name = "principal">The principal (e.g. Role, User, Group)</param>
        [JsiiMethod("grantRead", null, "[{\"name\":\"principal\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public virtual void GrantRead(IIIdentityResource principal)
        {
            InvokeInstanceVoidMethod(new object[]{principal});
        }
    }
}