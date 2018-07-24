using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterface(typeof(IListStacksRequest), "@aws-cdk/cx-api.ListStacksRequest")]
    public interface IListStacksRequest
    {
        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        string Type
        {
            get;
            set;
        }

        [JsiiProperty("context", "{\"primitive\":\"any\",\"optional\":true}")]
        object Context
        {
            get;
            set;
        }
    }
}