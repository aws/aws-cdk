using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    [JsiiInterface(typeof(IIncludeProps), "@aws-cdk/cdk.IncludeProps")]
    public interface IIncludeProps
    {
        /// <summary>The CloudFormation template to include in the stack (as is).</summary>
        [JsiiProperty("template", "{\"primitive\":\"json\"}")]
        JObject Template
        {
            get;
            set;
        }
    }
}