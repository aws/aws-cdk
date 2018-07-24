using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(ValidationError), "@aws-cdk/cdk.ValidationError", "[{\"name\":\"source\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
    public class ValidationError : DeputyBase
    {
        public ValidationError(Construct source, string message): base(new DeputyProps(new object[]{source, message}))
        {
        }

        protected ValidationError(ByRefValue reference): base(reference)
        {
        }

        protected ValidationError(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("source", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}")]
        public virtual Construct Source
        {
            get => GetInstanceProperty<Construct>();
        }

        [JsiiProperty("message", "{\"primitive\":\"string\"}")]
        public virtual string Message
        {
            get => GetInstanceProperty<string>();
        }
    }
}