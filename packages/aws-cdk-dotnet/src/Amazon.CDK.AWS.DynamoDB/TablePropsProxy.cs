using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    [JsiiInterfaceProxy(typeof(ITableProps), "@aws-cdk/aws-dynamodb.TableProps")]
    internal class TablePropsProxy : DeputyBase, ITableProps
    {
        private TablePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The read capacity for the table. Careful if you add Global Secondary Indexes, as
        /// those will share the table's provisioned throughput.
        /// </summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("readCapacity", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? ReadCapacity
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The write capacity for the table. Careful if you add Global Secondary Indexes, as
        /// those will share the table's provisioned throughput.
        /// </summary>
        /// <remarks>default: 5</remarks>
        [JsiiProperty("writeCapacity", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? WriteCapacity
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Enforces a particular physical table name.</summary>
        /// <remarks>default: &lt;generated&gt;</remarks>
        [JsiiProperty("tableName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string TableName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}