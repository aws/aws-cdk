using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Interface for classes that implementation logical ID assignment strategies</summary>
    [JsiiInterface(typeof(IIAddressingScheme), "@aws-cdk/cdk.IAddressingScheme")]
    public interface IIAddressingScheme
    {
        /// <summary>Return the logical ID for the given list of Construct names on the path.</summary>
        [JsiiMethod("allocateAddress", "{\"primitive\":\"string\"}", "[{\"name\":\"addressComponents\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        string AllocateAddress(string[] addressComponents);
    }
}