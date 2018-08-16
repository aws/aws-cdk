using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using System.Collections.Generic;
using System.Linq;

namespace HelloCdk
{
    public class HelloConstruct : Construct
    {
        readonly IList<Bucket> _buckets = new List<Bucket>();

        public HelloConstruct(Construct parent, string id, HelloConstructProps props) : base(parent, id)
        {
            foreach (int i in Enumerable.Range(0, props.BucketCount))
            {
                _buckets.Add(new Bucket(this, $"Bucket{i}", new BucketProps()));
            }
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
