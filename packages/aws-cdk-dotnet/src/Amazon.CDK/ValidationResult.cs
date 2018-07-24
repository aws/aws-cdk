using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Representation of validation results
    /// 
    /// Models a tree of validation errors so that we have as much information as possible
    /// about the failure that occurred.
    /// </summary>
    [JsiiClass(typeof(ValidationResult), "@aws-cdk/cdk.ValidationResult", "[{\"name\":\"errorMessage\",\"type\":{\"primitive\":\"string\",\"optional\":true}},{\"name\":\"results\",\"type\":{\"fqn\":\"@aws-cdk/cdk.ValidationResults\",\"optional\":true}}]")]
    public class ValidationResult : DeputyBase
    {
        public ValidationResult(string errorMessage, ValidationResults results): base(new DeputyProps(new object[]{errorMessage, results}))
        {
        }

        protected ValidationResult(ByRefValue reference): base(reference)
        {
        }

        protected ValidationResult(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("errorMessage", "{\"primitive\":\"string\"}")]
        public virtual string ErrorMessage
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("results", "{\"fqn\":\"@aws-cdk/cdk.ValidationResults\"}")]
        public virtual ValidationResults Results
        {
            get => GetInstanceProperty<ValidationResults>();
        }

        [JsiiProperty("isSuccess", "{\"primitive\":\"boolean\"}")]
        public virtual bool IsSuccess
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Turn a failed validation into an exception</summary>
        [JsiiMethod("assertSuccess", null, "[]")]
        public virtual void AssertSuccess()
        {
            InvokeInstanceVoidMethod(new object[]{});
        }

        /// <summary>Return a string rendering of the tree of validation failures</summary>
        [JsiiMethod("errorTree", "{\"primitive\":\"string\"}", "[]")]
        public virtual string ErrorTree()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }

        /// <summary>Wrap this result with an error message, if it concerns an error</summary>
        [JsiiMethod("prefix", "{\"fqn\":\"@aws-cdk/cdk.ValidationResult\"}", "[{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual ValidationResult Prefix(string message)
        {
            return InvokeInstanceMethod<ValidationResult>(new object[]{message});
        }
    }
}