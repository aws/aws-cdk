using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html </remarks>
    [JsiiInterface(typeof(IIAMPolicyDocumentProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.IAMPolicyDocumentProperty")]
    public interface IIAMPolicyDocumentProperty
    {
        /// <summary>``FunctionResource.IAMPolicyDocumentProperty.Statement``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html </remarks>
        [JsiiProperty("statement", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Statement
        {
            get;
            set;
        }
    }
}