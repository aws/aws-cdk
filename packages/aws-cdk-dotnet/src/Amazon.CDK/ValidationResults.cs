using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>A collection of validation results</summary>
    [JsiiClass(typeof(ValidationResults), "@aws-cdk/cdk.ValidationResults", "[{\"name\":\"results\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.ValidationResult\"}},\"optional\":true}}]")]
    public class ValidationResults : DeputyBase
    {
        public ValidationResults(ValidationResult[] results): base(new DeputyProps(new object[]{results}))
        {
        }

        protected ValidationResults(ByRefValue reference): base(reference)
        {
        }

        protected ValidationResults(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("results", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.ValidationResult\"}}}")]
        public virtual ValidationResult[] Results
        {
            get => GetInstanceProperty<ValidationResult[]>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("isSuccess", "{\"primitive\":\"boolean\"}")]
        public virtual bool IsSuccess
        {
            get => GetInstanceProperty<bool>();
        }

        [JsiiMethod("collect", null, "[{\"name\":\"result\",\"type\":{\"fqn\":\"@aws-cdk/cdk.ValidationResult\"}}]")]
        public virtual void Collect(ValidationResult result)
        {
            InvokeInstanceVoidMethod(new object[]{result});
        }

        [JsiiMethod("errorTreeList", "{\"primitive\":\"string\"}", "[]")]
        public virtual string ErrorTreeList()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }

        /// <summary>
        /// Wrap up all validation results into a single tree node
        /// 
        /// If there are failures in the collection, add a message, otherwise
        /// return a success.
        /// </summary>
        [JsiiMethod("wrap", "{\"fqn\":\"@aws-cdk/cdk.ValidationResult\"}", "[{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual ValidationResult Wrap(string message)
        {
            return InvokeInstanceMethod<ValidationResult>(new object[]{message});
        }
    }
}