"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAwsPlaceholders = void 0;
const cx_api_1 = require("@aws-cdk/cx-api");
/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 *
 * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
 * (they're nominally independent tools).
 */
async function replaceAwsPlaceholders(object, aws) {
    let partition = async () => {
        const p = await aws.discoverPartition();
        partition = () => Promise.resolve(p);
        return p;
    };
    let account = async () => {
        const a = await aws.discoverCurrentAccount();
        account = () => Promise.resolve(a);
        return a;
    };
    return cx_api_1.EnvironmentPlaceholders.replaceAsync(object, {
        async region() {
            return object.region ?? aws.discoverDefaultRegion();
        },
        async accountId() {
            return (await account()).accountId;
        },
        async partition() {
            return partition();
        },
    });
}
exports.replaceAwsPlaceholders = replaceAwsPlaceholders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxhY2Vob2xkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUEwRDtBQUcxRDs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxzQkFBc0IsQ0FBZ0MsTUFBUyxFQUFFLEdBQVM7SUFDOUYsSUFBSSxTQUFTLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDekIsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN4QyxTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQztJQUVGLElBQUksT0FBTyxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDN0MsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUM7SUFFRixPQUFPLGdDQUF1QixDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7UUFDbEQsS0FBSyxDQUFDLE1BQU07WUFDVixPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDdEQsQ0FBQztRQUNELEtBQUssQ0FBQyxTQUFTO1lBQ2IsT0FBTyxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDckMsQ0FBQztRQUNELEtBQUssQ0FBQyxTQUFTO1lBQ2IsT0FBTyxTQUFTLEVBQUUsQ0FBQztRQUNyQixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXhCRCx3REF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnZpcm9ubWVudFBsYWNlaG9sZGVycyB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQXdzIH0gZnJvbSAnLi4vYXdzJztcblxuLyoqXG4gKiBSZXBsYWNlIHRoZSB7QUNDT1VOVH0gYW5kIHtSRUdJT059IHBsYWNlaG9sZGVycyBpbiBhbGwgc3RyaW5ncyBmb3VuZCBpbiBhIGNvbXBsZXggb2JqZWN0LlxuICpcbiAqIER1cGxpY2F0ZWQgYmV0d2VlbiBjZGstYXNzZXRzIGFuZCBhd3MtY2RrIENMSSBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYSBnb29kIHNpbmdsZSBwbGFjZSB0byBwdXQgaXRcbiAqICh0aGV5J3JlIG5vbWluYWxseSBpbmRlcGVuZGVudCB0b29scykuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXBsYWNlQXdzUGxhY2Vob2xkZXJzPEEgZXh0ZW5kcyB7IHJlZ2lvbj86IHN0cmluZyB9PihvYmplY3Q6IEEsIGF3czogSUF3cyk6IFByb21pc2U8QT4ge1xuICBsZXQgcGFydGl0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHAgPSBhd2FpdCBhd3MuZGlzY292ZXJQYXJ0aXRpb24oKTtcbiAgICBwYXJ0aXRpb24gPSAoKSA9PiBQcm9taXNlLnJlc29sdmUocCk7XG4gICAgcmV0dXJuIHA7XG4gIH07XG5cbiAgbGV0IGFjY291bnQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IGF3YWl0IGF3cy5kaXNjb3ZlckN1cnJlbnRBY2NvdW50KCk7XG4gICAgYWNjb3VudCA9ICgpID0+IFByb21pc2UucmVzb2x2ZShhKTtcbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICByZXR1cm4gRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMucmVwbGFjZUFzeW5jKG9iamVjdCwge1xuICAgIGFzeW5jIHJlZ2lvbigpIHtcbiAgICAgIHJldHVybiBvYmplY3QucmVnaW9uID8/IGF3cy5kaXNjb3ZlckRlZmF1bHRSZWdpb24oKTtcbiAgICB9LFxuICAgIGFzeW5jIGFjY291bnRJZCgpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgYWNjb3VudCgpKS5hY2NvdW50SWQ7XG4gICAgfSxcbiAgICBhc3luYyBwYXJ0aXRpb24oKSB7XG4gICAgICByZXR1cm4gcGFydGl0aW9uKCk7XG4gICAgfSxcbiAgfSk7XG59Il19