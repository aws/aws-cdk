using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html </remarks>
    [JsiiInterfaceProxy(typeof(ISchemaChangePolicyProperty), "@aws-cdk/aws-glue.cloudformation.CrawlerResource.SchemaChangePolicyProperty")]
    internal class SchemaChangePolicyPropertyProxy : DeputyBase, ISchemaChangePolicyProperty
    {
        private SchemaChangePolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CrawlerResource.SchemaChangePolicyProperty.DeleteBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-deletebehavior </remarks>
        [JsiiProperty("deleteBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DeleteBehavior
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CrawlerResource.SchemaChangePolicyProperty.UpdateBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-updatebehavior </remarks>
        [JsiiProperty("updateBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object UpdateBehavior
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}