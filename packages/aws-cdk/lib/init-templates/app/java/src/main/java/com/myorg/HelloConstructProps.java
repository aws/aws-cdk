package com.myorg;

public class HelloConstructProps {
    private int bucketCount;

    public static HelloConstructPropsBuilder builder() {
        return new HelloConstructPropsBuilder();
    }

    public int getBucketCount() {
        return bucketCount;
    }

    public void setBucketCount(int bucketCount) {
        this.bucketCount = bucketCount;
    }


    public static final class HelloConstructPropsBuilder {
        private int bucketCount;

        private HelloConstructPropsBuilder() {
        }

        public static HelloConstructPropsBuilder aHelloConstructProps() {
            return new HelloConstructPropsBuilder();
        }

        public HelloConstructPropsBuilder withBucketCount(int bucketCount) {
            this.bucketCount = bucketCount;
            return this;
        }

        public HelloConstructProps build() {
            HelloConstructProps helloConstructProps = new HelloConstructProps();
            helloConstructProps.setBucketCount(bucketCount);
            return helloConstructProps;
        }
    }
}
