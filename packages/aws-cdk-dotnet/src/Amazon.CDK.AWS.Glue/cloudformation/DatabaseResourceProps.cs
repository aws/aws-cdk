using Amazon.CDK;
using Amazon.CDK.AWS.Glue.cloudformation.DatabaseResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html </remarks>
    public class DatabaseResourceProps : DeputyBase, IDatabaseResourceProps
    {
        /// <summary>``AWS::Glue::Database.CatalogId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html#cfn-glue-database-catalogid </remarks>
        [JsiiProperty("catalogId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object CatalogId
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Database.DatabaseInput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html#cfn-glue-database-databaseinput </remarks>
        [JsiiProperty("databaseInput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.DatabaseResource.DatabaseInputProperty\"}]}}", true)]
        public object DatabaseInput
        {
            get;
            set;
        }
    }
}