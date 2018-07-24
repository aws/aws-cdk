using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterfaceProxy(typeof(IResourceProps), "@aws-cdk/cdk.ResourceProps")]
    internal class ResourcePropsProxy : DeputyBase, IResourceProps
    {
        private ResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>CloudFormation resource type.</summary>
        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        public virtual string Type
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>CloudFormation properties.</summary>
        [JsiiProperty("properties", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Properties
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}