using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Alias for Fn::Join('', [ values ]).</summary>
    [JsiiClass(typeof(FnConcat), "@aws-cdk/cdk.FnConcat", "[{\"name\":\"listOfValues\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnConcat : FnJoin
    {
        public FnConcat(object listOfValues): base(new DeputyProps(new object[]{listOfValues}))
        {
        }

        protected FnConcat(ByRefValue reference): base(reference)
        {
        }

        protected FnConcat(DeputyProps props): base(props)
        {
        }
    }
}