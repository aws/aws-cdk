using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterface(typeof(IResourceProps), "@aws-cdk/cdk.ResourceProps")]
    public interface IResourceProps
    {
        /// <summary>CloudFormation resource type.</summary>
        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        string Type
        {
            get;
            set;
        }

        /// <summary>CloudFormation properties.</summary>
        [JsiiProperty("properties", "{\"primitive\":\"any\",\"optional\":true}")]
        object Properties
        {
            get;
            set;
        }
    }
}