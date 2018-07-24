using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    public class ResourceProps : DeputyBase, IResourceProps
    {
        /// <summary>CloudFormation resource type.</summary>
        [JsiiProperty("type", "{\"primitive\":\"string\"}", true)]
        public string Type
        {
            get;
            set;
        }

        /// <summary>CloudFormation properties.</summary>
        [JsiiProperty("properties", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Properties
        {
            get;
            set;
        }
    }
}