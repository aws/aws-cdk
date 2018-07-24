using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(PolicyDocument), "@aws-cdk/cdk.PolicyDocument", "[{\"name\":\"baseDocument\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PolicyDocument : Token
    {
        public PolicyDocument(object baseDocument): base(new DeputyProps(new object[]{baseDocument}))
        {
        }

        protected PolicyDocument(ByRefValue reference): base(reference)
        {
        }

        protected PolicyDocument(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("isEmpty", "{\"primitive\":\"boolean\"}")]
        public virtual bool IsEmpty
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>
        /// The number of statements already added to this policy.
        /// Can be used, for example, to generate uniuqe "sid"s within the policy.
        /// </summary>
        [JsiiProperty("statementCount", "{\"primitive\":\"number\"}")]
        public virtual double StatementCount
        {
            get => GetInstanceProperty<double>();
        }

        [JsiiMethod("resolve", "{\"primitive\":\"any\"}", "[]")]
        public override object Resolve()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }

        [JsiiMethod("addStatement", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\"}", "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual PolicyDocument AddStatement(PolicyStatement statement)
        {
            return InvokeInstanceMethod<PolicyDocument>(new object[]{statement});
        }
    }
}