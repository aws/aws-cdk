using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html </remarks>
    [JsiiInterface(typeof(ISchemaChangePolicyProperty), "@aws-cdk/aws-glue.cloudformation.CrawlerResource.SchemaChangePolicyProperty")]
    public interface ISchemaChangePolicyProperty
    {
        /// <summary>``CrawlerResource.SchemaChangePolicyProperty.DeleteBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-deletebehavior </remarks>
        [JsiiProperty("deleteBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeleteBehavior
        {
            get;
            set;
        }

        /// <summary>``CrawlerResource.SchemaChangePolicyProperty.UpdateBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-updatebehavior </remarks>
        [JsiiProperty("updateBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object UpdateBehavior
        {
            get;
            set;
        }
    }
}