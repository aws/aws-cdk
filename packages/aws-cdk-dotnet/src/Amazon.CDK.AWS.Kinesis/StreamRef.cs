using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.KMS;
using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>
    /// Represents a Kinesis Stream.
    /// 
    /// Streams can be either defined within this stack:
    /// 
    ///      new Stream(this, 'MyStream', { props });
    /// 
    /// Or imported from an existing stream:
    /// 
    ///      StreamRef.import(this, 'MyImportedStream', { streamArn: ... });
    /// 
    /// You can also export a stream and import it into another stack:
    /// 
    ///      const ref = myStream.export();
    ///      StreamRef.import(this, 'MyImportedStream', ref);
    /// </summary>
    [JsiiClass(typeof(StreamRef), "@aws-cdk/aws-kinesis.StreamRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class StreamRef : Construct, IILogSubscriptionDestination
    {
        protected StreamRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected StreamRef(ByRefValue reference): base(reference)
        {
        }

        protected StreamRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the stream.</summary>
        [JsiiProperty("streamArn", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamArn\"}")]
        public virtual StreamArn StreamArn
        {
            get => GetInstanceProperty<StreamArn>();
        }

        /// <summary>The name of the stream</summary>
        [JsiiProperty("streamName", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamName\"}")]
        public virtual StreamName StreamName
        {
            get => GetInstanceProperty<StreamName>();
        }

        /// <summary>Optional KMS encryption key associated with this stream.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public virtual EncryptionKeyRef EncryptionKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
        }

        /// <summary>Creates a Stream construct that represents an external stream.</summary>
        /// <param name = "parent">The parent creating construct (usually `this`).</param>
        /// <param name = "name">The construct's name.</param>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-kinesis.StreamRefProps\"}}]")]
        public static StreamRef Import(Construct parent, string name, IStreamRefProps props)
        {
            return InvokeStaticMethod<StreamRef>(typeof(StreamRef), new object[]{parent, name, props});
        }

        /// <summary>Exports this stream from the stack.</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamRefProps\"}", "[]")]
        public virtual IStreamRefProps Export()
        {
            return InvokeInstanceMethod<IStreamRefProps>(new object[]{});
        }

        /// <summary>
        /// Grant write permissions for this stream and its contents to an IAM
        /// principal (Role/Group/User).
        /// 
        /// If an encryption key is used, permission to ues the key to decrypt the
        /// contents of the stream will also be granted.
        /// </summary>
        [JsiiMethod("grantRead", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public virtual void GrantRead(IIIdentityResource identity)
        {
            InvokeInstanceVoidMethod(new object[]{identity});
        }

        /// <summary>
        /// Grant read permissions for this stream and its contents to an IAM
        /// principal (Role/Group/User).
        /// 
        /// If an encryption key is used, permission to ues the key to decrypt the
        /// contents of the stream will also be granted.
        /// </summary>
        [JsiiMethod("grantWrite", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public virtual void GrantWrite(IIIdentityResource identity)
        {
            InvokeInstanceVoidMethod(new object[]{identity});
        }

        /// <summary>
        /// Grants read/write permissions for this stream and its contents to an IAM
        /// principal (Role/Group/User).
        /// 
        /// If an encryption key is used, permission to use the key for
        /// encrypt/decrypt will also be granted.
        /// </summary>
        [JsiiMethod("grantReadWrite", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public virtual void GrantReadWrite(IIIdentityResource identity)
        {
            InvokeInstanceVoidMethod(new object[]{identity});
        }

        /// <summary>
        /// Return the properties required to send subscription events to this destination.
        /// 
        /// If necessary, the destination can use the properties of the SubscriptionFilter
        /// object itself to configure its permissions to allow the subscription to write
        /// to it.
        /// 
        /// The destination may reconfigure its own permissions in response to this
        /// function call.
        /// </summary>
        [JsiiMethod("logSubscriptionDestination", "{\"fqn\":\"@aws-cdk/aws-logs.LogSubscriptionDestination\"}", "[{\"name\":\"sourceLogGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}}]")]
        public virtual ILogSubscriptionDestination LogSubscriptionDestination(LogGroup sourceLogGroup)
        {
            return InvokeInstanceMethod<ILogSubscriptionDestination>(new object[]{sourceLogGroup});
        }
    }
}