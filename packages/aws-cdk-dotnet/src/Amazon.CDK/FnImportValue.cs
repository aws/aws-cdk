using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// The intrinsic function Fn::ImportValue returns the value of an output exported by another stack.
    /// You typically use this function to create cross-stack references. In the following example
    /// template snippets, Stack A exports VPC security group values and Stack B imports them.
    /// </summary>
    [JsiiClass(typeof(FnImportValue), "@aws-cdk/cdk.FnImportValue", "[{\"name\":\"sharedValueToImport\",\"type\":{\"primitive\":\"string\"}}]")]
    public class FnImportValue : Fn
    {
        public FnImportValue(string sharedValueToImport): base(new DeputyProps(new object[]{sharedValueToImport}))
        {
        }

        protected FnImportValue(ByRefValue reference): base(reference)
        {
        }

        protected FnImportValue(DeputyProps props): base(props)
        {
        }
    }
}