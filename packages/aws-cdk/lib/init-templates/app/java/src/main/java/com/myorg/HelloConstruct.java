package com.myorg;

import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.services.iam.IGrantable;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.BucketProps;

import java.util.ArrayList;
import java.util.List;

/**
 * Example of a reusable construct. This one defines N buckets.
 */
public class HelloConstruct extends Construct {
    private final List<Bucket> buckets = new ArrayList<>();

    public HelloConstruct(final Construct parent, final String name, final HelloConstructProps props) {
        super(parent, name);

        for (int i = 0; i < props.getBucketCount(); ++i) {
            buckets.add(new Bucket(this, "Bucket" + String.valueOf(i), BucketProps.builder().build()));
        }
    }

    /**
     * Given an principal, grants it READ access on all buckets.
     * @param grantee The principal (User, Group, Role)
     */
    public void grantRead(final IGrantable grantee) {
        buckets.forEach(b -> b.grantRead(grantee, "*"));
    }
}
