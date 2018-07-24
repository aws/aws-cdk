using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html </remarks>
    [JsiiInterface(typeof(ISerdeInfoProperty), "@aws-cdk/aws-glue.cloudformation.TableResource.SerdeInfoProperty")]
    public interface ISerdeInfoProperty
    {
        /// <summary>``TableResource.SerdeInfoProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Name
        {
            get;
            set;
        }

        /// <summary>``TableResource.SerdeInfoProperty.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Parameters
        {
            get;
            set;
        }

        /// <summary>``TableResource.SerdeInfoProperty.SerializationLibrary``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-serializationlibrary </remarks>
        [JsiiProperty("serializationLibrary", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SerializationLibrary
        {
            get;
            set;
        }
    }
}