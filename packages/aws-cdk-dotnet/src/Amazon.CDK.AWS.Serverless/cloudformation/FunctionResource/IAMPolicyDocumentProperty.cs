using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html </remarks>
    public class IAMPolicyDocumentProperty : DeputyBase, IIAMPolicyDocumentProperty
    {
        /// <summary>``FunctionResource.IAMPolicyDocumentProperty.Statement``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html </remarks>
        [JsiiProperty("statement", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Statement
        {
            get;
            set;
        }
    }
}