"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBucketName = exports.parseBucketArn = void 0;
const cdk = require("@aws-cdk/core");
function parseBucketArn(construct, props) {
    // if we have an explicit bucket ARN, use it.
    if (props.bucketArn) {
        return props.bucketArn;
    }
    if (props.bucketName) {
        return cdk.Stack.of(construct).formatArn({
            // S3 Bucket names are globally unique in a partition,
            // and so their ARNs have empty region and account components
            region: '',
            account: '',
            service: 's3',
            resource: props.bucketName,
        });
    }
    throw new Error('Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed');
}
exports.parseBucketArn = parseBucketArn;
function parseBucketName(construct, props) {
    // if we have an explicit bucket name, use it.
    if (props.bucketName) {
        return props.bucketName;
    }
    // extract bucket name from bucket arn
    if (props.bucketArn) {
        return cdk.Stack.of(construct).splitArn(props.bucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resource;
    }
    // no bucket name is okay since it's optional.
    return undefined;
}
exports.parseBucketName = parseBucketName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBSXJDLFNBQWdCLGNBQWMsQ0FBQyxTQUFxQixFQUFFLEtBQXVCO0lBRTNFLDZDQUE2QztJQUM3QyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFDbkIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDO0tBQ3hCO0lBRUQsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ3BCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3ZDLHNEQUFzRDtZQUN0RCw2REFBNkQ7WUFDN0QsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQzNCLENBQUMsQ0FBQztLQUNKO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO0FBQ2pHLENBQUM7QUFuQkQsd0NBbUJDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLFNBQXFCLEVBQUUsS0FBdUI7SUFFNUUsOENBQThDO0lBQzlDLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtRQUNwQixPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDekI7SUFFRCxzQ0FBc0M7SUFDdEMsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ25CLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUN0RztJQUVELDhDQUE4QztJQUM5QyxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBZEQsMENBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCdWNrZXRBdHRyaWJ1dGVzIH0gZnJvbSAnLi9idWNrZXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCdWNrZXRBcm4oY29uc3RydWN0OiBJQ29uc3RydWN0LCBwcm9wczogQnVja2V0QXR0cmlidXRlcyk6IHN0cmluZyB7XG5cbiAgLy8gaWYgd2UgaGF2ZSBhbiBleHBsaWNpdCBidWNrZXQgQVJOLCB1c2UgaXQuXG4gIGlmIChwcm9wcy5idWNrZXRBcm4pIHtcbiAgICByZXR1cm4gcHJvcHMuYnVja2V0QXJuO1xuICB9XG5cbiAgaWYgKHByb3BzLmJ1Y2tldE5hbWUpIHtcbiAgICByZXR1cm4gY2RrLlN0YWNrLm9mKGNvbnN0cnVjdCkuZm9ybWF0QXJuKHtcbiAgICAgIC8vIFMzIEJ1Y2tldCBuYW1lcyBhcmUgZ2xvYmFsbHkgdW5pcXVlIGluIGEgcGFydGl0aW9uLFxuICAgICAgLy8gYW5kIHNvIHRoZWlyIEFSTnMgaGF2ZSBlbXB0eSByZWdpb24gYW5kIGFjY291bnQgY29tcG9uZW50c1xuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgc2VydmljZTogJ3MzJyxcbiAgICAgIHJlc291cmNlOiBwcm9wcy5idWNrZXROYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGJ1Y2tldCBBUk4uIEF0IGxlYXN0IGBidWNrZXRBcm5gIG9yIGBidWNrZXROYW1lYCBpcyBuZWVkZWQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQnVja2V0TmFtZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QsIHByb3BzOiBCdWNrZXRBdHRyaWJ1dGVzKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAvLyBpZiB3ZSBoYXZlIGFuIGV4cGxpY2l0IGJ1Y2tldCBuYW1lLCB1c2UgaXQuXG4gIGlmIChwcm9wcy5idWNrZXROYW1lKSB7XG4gICAgcmV0dXJuIHByb3BzLmJ1Y2tldE5hbWU7XG4gIH1cblxuICAvLyBleHRyYWN0IGJ1Y2tldCBuYW1lIGZyb20gYnVja2V0IGFyblxuICBpZiAocHJvcHMuYnVja2V0QXJuKSB7XG4gICAgcmV0dXJuIGNkay5TdGFjay5vZihjb25zdHJ1Y3QpLnNwbGl0QXJuKHByb3BzLmJ1Y2tldEFybiwgY2RrLkFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZTtcbiAgfVxuXG4gIC8vIG5vIGJ1Y2tldCBuYW1lIGlzIG9rYXkgc2luY2UgaXQncyBvcHRpb25hbC5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==