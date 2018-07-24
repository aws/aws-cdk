using Amazon.CDK;
using Amazon.CDK.AWS.DMS.cloudformation.EndpointResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html </remarks>
    public class EndpointResourceProps : DeputyBase, IEndpointResourceProps
    {
        /// <summary>``AWS::DMS::Endpoint.EndpointType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointtype </remarks>
        [JsiiProperty("endpointType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object EndpointType
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.EngineName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-enginename </remarks>
        [JsiiProperty("engineName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object EngineName
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.CertificateArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-certificatearn </remarks>
        [JsiiProperty("certificateArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CertificateArn
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.DatabaseName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-databasename </remarks>
        [JsiiProperty("databaseName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DatabaseName
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.DynamoDbSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-dynamodbsettings </remarks>
        [JsiiProperty("dynamoDbSettings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.EndpointResource.DynamoDbSettingsProperty\"}]},\"optional\":true}", true)]
        public object DynamoDbSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.EndpointIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointidentifier </remarks>
        [JsiiProperty("endpointIdentifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EndpointIdentifier
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.ExtraConnectionAttributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-extraconnectionattributes </remarks>
        [JsiiProperty("extraConnectionAttributes", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ExtraConnectionAttributes
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.KmsKeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kmskeyid </remarks>
        [JsiiProperty("kmsKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsKeyId
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.MongoDbSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-mongodbsettings </remarks>
        [JsiiProperty("mongoDbSettings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.EndpointResource.MongoDbSettingsProperty\"}]},\"optional\":true}", true)]
        public object MongoDbSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.Password``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-password </remarks>
        [JsiiProperty("password", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Password
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.Port``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-port </remarks>
        [JsiiProperty("port", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Port
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.S3Settings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-s3settings </remarks>
        [JsiiProperty("s3Settings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.EndpointResource.S3SettingsProperty\"}]},\"optional\":true}", true)]
        public object S3Settings
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.ServerName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-servername </remarks>
        [JsiiProperty("serverName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServerName
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.SslMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-sslmode </remarks>
        [JsiiProperty("sslMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SslMode
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::Endpoint.Username``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-username </remarks>
        [JsiiProperty("username", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Username
        {
            get;
            set;
        }
    }
}