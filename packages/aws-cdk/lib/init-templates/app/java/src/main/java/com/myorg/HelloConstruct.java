package com.myorg;

import com.amazonaws.cdk.Construct;
import com.amazonaws.cdk.iam.IIdentityResource;
import com.amazonaws.cdk.s3.Bucket;

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
            buckets.add(new Bucket(this, "Bucket" + String.valueOf(i)));
        }
    }

    /**
     * Given an principal, grants it READ access on all buckets.
     * @param principal The principal (User, Group, Role)
     */
    public void grantRead(final IIdentityResource principal) {
        buckets.forEach(b -> b.grantRead(principal));
    }
}
