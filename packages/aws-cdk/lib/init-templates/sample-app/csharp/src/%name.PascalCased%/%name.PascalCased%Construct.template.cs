using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using System.Collections.Generic;
using System.Linq;

namespace %name.PascalCased%
{
    public class %name.PascalCased%ConstructProps
    {
        public int BucketCount { get; set; }
    }

    public class %name.PascalCased%Construct : Construct
    {
        private readonly IEnumerable<Bucket> _buckets;
        
        // A simple construct that contains a collection of AWS S3 buckets.
        public %name.PascalCased%Construct(Construct parent, string id, %name.PascalCased%ConstructProps props) : base(parent, id)
        {
            _buckets = Enumerable.Range(0, props.BucketCount)
                .Select(i => new Bucket(this, $"Bucket{i}", new BucketProps()))
                .ToList();

        }

        // Give the specified principal read access to the buckets in this construct.
        public void GrantRead(IPrincipal principal)
        {
            foreach (Bucket bucket in _buckets)
            {
                bucket.GrantRead(principal, "*");
            }
        }
    }
}
