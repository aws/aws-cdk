CDK Resource Interfaces
=======================

This module contains resource interfaces for all AWS service resources.

These are interfaces that look like this:

```
/**
 * Indicates that this resource can be referenced as a Bucket.
 */
interface IBucketRef {
  /**
   * A reference to a Bucket resource.
   */
  readonly bucketRef: BucketReference;
}

interface BucketReference {
  /**
   * The BucketName of the Bucket resource.
   */
  readonly bucketName: string;

  /**
   * The ARN of the Bucket resource.
   */
  readonly bucketArn: string;
}
```

These are in a separate submodule so that they can be referenced from all other
service submodules without introducing cyclic dependencies between them.