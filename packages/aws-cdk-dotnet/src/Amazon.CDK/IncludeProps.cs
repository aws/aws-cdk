using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    public class IncludeProps : DeputyBase, IIncludeProps
    {
        /// <summary>The CloudFormation template to include in the stack (as is).</summary>
        [JsiiProperty("template", "{\"primitive\":\"json\"}", true)]
        public JObject Template
        {
            get;
            set;
        }
    }
}