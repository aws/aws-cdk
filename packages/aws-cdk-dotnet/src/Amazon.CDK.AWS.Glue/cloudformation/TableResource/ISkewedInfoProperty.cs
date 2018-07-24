using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html </remarks>
    [JsiiInterface(typeof(ISkewedInfoProperty), "@aws-cdk/aws-glue.cloudformation.TableResource.SkewedInfoProperty")]
    public interface ISkewedInfoProperty
    {
        /// <summary>``TableResource.SkewedInfoProperty.SkewedColumnNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnnames </remarks>
        [JsiiProperty("skewedColumnNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object SkewedColumnNames
        {
            get;
            set;
        }

        /// <summary>``TableResource.SkewedInfoProperty.SkewedColumnValueLocationMaps``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnvaluelocationmaps </remarks>
        [JsiiProperty("skewedColumnValueLocationMaps", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SkewedColumnValueLocationMaps
        {
            get;
            set;
        }

        /// <summary>``TableResource.SkewedInfoProperty.SkewedColumnValues``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnvalues </remarks>
        [JsiiProperty("skewedColumnValues", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object SkewedColumnValues
        {
            get;
            set;
        }
    }
}