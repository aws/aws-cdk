using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using System.Collections.Generic;
using System.Linq;

namespace HelloCdk
{
    public class HelloConstructProps
    {
        public int BucketCount { get; set; }
    }

    public class HelloConstruct : Construct
    {
        private readonly IEnumerable<Bucket> _buckets;

        // A simple construct that contains a collection of AWS S3 buckets.
        public HelloConstruct(Construct parent, string id, HelloConstructProps props) : base(parent, id)
        {
            _buckets = Enumerable.Range(0, props.BucketCount)
                .Select(i => new Bucket(this, $"Bucket{i}", new BucketProps()))
                .ToList();
        }

        // Give the specified principal read access to the buckets in this construct.
        public void GrantRead(IIPrincipal principal)
        {
            foreach (Bucket bucket in _buckets)
            {
                bucket.GrantRead(principal, "*");
            }
        }
    }
}
