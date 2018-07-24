using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    [JsiiInterface(typeof(ITableProps), "@aws-cdk/aws-dynamodb.TableProps")]
    public interface ITableProps
    {
        /// <summary>
        /// The read capacity for the table. Careful if you add Global Secondary Indexes, as
        /// those will share the table's provisioned throughput.
        /// </summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("readCapacity", "{\"primitive\":\"number\",\"optional\":true}")]
        double? ReadCapacity
        {
            get;
            set;
        }

        /// <summary>
        /// The write capacity for the table. Careful if you add Global Secondary Indexes, as
        /// those will share the table's provisioned throughput.
        /// </summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("writeCapacity", "{\"primitive\":\"number\",\"optional\":true}")]
        double? WriteCapacity
        {
            get;
            set;
        }

        /// <summary>Enforces a particular physical table name.</summary>
        /// <remarks>default: &lt;generated&gt;</remarks>
        [JsiiProperty("tableName", "{\"primitive\":\"string\",\"optional\":true}")]
        string TableName
        {
            get;
            set;
        }
    }
}