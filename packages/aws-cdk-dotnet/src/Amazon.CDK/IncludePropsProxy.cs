using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    [JsiiInterfaceProxy(typeof(IIncludeProps), "@aws-cdk/cdk.IncludeProps")]
    internal class IncludePropsProxy : DeputyBase, IIncludeProps
    {
        private IncludePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The CloudFormation template to include in the stack (as is).</summary>
        [JsiiProperty("template", "{\"primitive\":\"json\"}")]
        public virtual JObject Template
        {
            get => GetInstanceProperty<JObject>();
            set => SetInstanceProperty(value);
        }
    }
}