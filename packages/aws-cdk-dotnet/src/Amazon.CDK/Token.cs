using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Represents a lazy-evaluated value. Can be used to delay evaluation of a certain value
    /// in case, for example, that it requires some context or late-bound data.
    /// </summary>
    [JsiiClass(typeof(Token), "@aws-cdk/cdk.Token", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Token : DeputyBase
    {
        public Token(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Token(ByRefValue reference): base(reference)
        {
        }

        protected Token(DeputyProps props): base(props)
        {
        }

        /// <returns>The resolved value for this token.</returns>
        [JsiiMethod("resolve", "{\"primitive\":\"any\"}", "[]")]
        public virtual object Resolve()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}