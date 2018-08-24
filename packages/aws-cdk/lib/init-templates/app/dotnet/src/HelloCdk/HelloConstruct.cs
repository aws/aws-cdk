using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using System.Collections.Generic;
using System.Linq;

namespace HelloCdk
{
    public class HelloConstruct : Construct
    {
        private readonly IEnumerable<Bucket> _buckets;

        public HelloConstruct(Construct parent, string id, HelloConstructProps props) : base(parent, id)
        {
            _buckets = Enumerable.Range(0, props.BucketCount)
                .Select(i => new Bucket(this, $"Bucket{i}", new BucketProps()))
                .ToList();
        }

        public void GrantRead(IIIdentityResource principal)
        {
            foreach (Bucket bucket in _buckets)
            {
                bucket.GrantRead(principal, null);
            }
        }
    }
}
