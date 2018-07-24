using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Renders a hashed ID for a resource.
    /// 
    /// In order to make sure logical IDs are unique and stable, we hash the resource
    /// construct tree path (i.e. toplevel/secondlevel/.../myresource) and add it as
    /// a suffix to the path components joined without a separator (CloudFormation
    /// IDs only allow alphanumeric characters).
    /// 
    /// The result will be:
    /// 
    ///      &lt;path.join('')&gt;&lt;md5(path.join('/')&gt;
    ///          "human"          "hash"
    /// 
    /// If the "human" part of the ID exceeds 240 characters, we simply trim it so
    /// the total ID doesn't exceed CloudFormation's 255 character limit.
    /// 
    /// We only take 8 characters from the md5 hash (0.000005 chance of collision).
    /// 
    /// Special cases:
    /// 
    /// - If the path only contains a single component (i.e. it's a top-level
    ///    resource), we won't add the hash to it. The hash is not needed for
    ///    disamiguation and also, it allows for a more straightforward migration an
    ///    existing CloudFormation template to a CDK stack without logical ID changes
    ///    (or renames).
    /// - For aesthetic reasons, if the last components of the path are the same
    ///    (i.e. `L1/L2/Pipeline/Pipeline`), they will be de-duplicated to make the
    ///    resulting human portion of the ID more pleasing: `L1L2Pipeline&lt;HASH&gt;`
    ///    instead of `L1L2PipelinePipeline&lt;HASH&gt;`
    /// - If a component is named "Resource" it will be omitted from the path. This
    ///    allows L2 construct to use this convention to "hide" the wrapped L1 from
    ///    the logical ID.
    /// </summary>
    [JsiiClass(typeof(HashedAddressingScheme), "@aws-cdk/cdk.HashedAddressingScheme", "[]")]
    public class HashedAddressingScheme : DeputyBase, IIAddressingScheme
    {
        public HashedAddressingScheme(): base(new DeputyProps(new object[]{}))
        {
        }

        protected HashedAddressingScheme(ByRefValue reference): base(reference)
        {
        }

        protected HashedAddressingScheme(DeputyProps props): base(props)
        {
        }

        /// <summary>Return the logical ID for the given list of Construct names on the path.</summary>
        [JsiiMethod("allocateAddress", "{\"primitive\":\"string\"}", "[{\"name\":\"addressComponents\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public virtual string AllocateAddress(string[] addressComponents)
        {
            return InvokeInstanceMethod<string>(new object[]{addressComponents});
        }
    }
}