using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>The Fn::GetAtt intrinsic function returns the value of an attribute from a resource in the template.</summary>
    [JsiiClass(typeof(FnGetAtt), "@aws-cdk/cdk.FnGetAtt", "[{\"name\":\"logicalNameOfResource\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"attributeName\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnGetAtt : Fn
    {
        public FnGetAtt(string logicalNameOfResource, string attributeName): base(new DeputyProps(new object[]{logicalNameOfResource, attributeName}))
        {
        }

        protected FnGetAtt(ByRefValue reference): base(reference)
        {
        }

        protected FnGetAtt(DeputyProps props): base(props)
        {
        }
    }
}