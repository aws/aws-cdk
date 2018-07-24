using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Context provider that will read values from the SSM parameter store in the indicated account and region</summary>
    [JsiiClass(typeof(SSMParameterProvider), "@aws-cdk/cdk.SSMParameterProvider", "[{\"name\":\"context\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
    public class SSMParameterProvider : DeputyBase
    {
        public SSMParameterProvider(Construct context): base(new DeputyProps(new object[]{context}))
        {
        }

        protected SSMParameterProvider(ByRefValue reference): base(reference)
        {
        }

        protected SSMParameterProvider(DeputyProps props): base(props)
        {
        }

        /// <summary>Return the SSM parameter string with the indicated key</summary>
        [JsiiMethod("getString", "{\"primitive\":\"any\"}", "[{\"name\":\"parameterName\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual object GetString(string parameterName)
        {
            return InvokeInstanceMethod<object>(new object[]{parameterName});
        }
    }
}