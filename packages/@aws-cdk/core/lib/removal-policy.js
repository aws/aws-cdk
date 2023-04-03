"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovalPolicy = void 0;
/**
 * Possible values for a resource's Removal Policy
 *
 * The removal policy controls what happens to the resource if it stops being
 * managed by CloudFormation. This can happen in one of three situations:
 *
 * - The resource is removed from the template, so CloudFormation stops managing it;
 * - A change to the resource is made that requires it to be replaced, so CloudFormation stops
 *   managing it;
 * - The stack is deleted, so CloudFormation stops managing all resources in it.
 *
 * The Removal Policy applies to all above cases.
 *
 * Many stateful resources in the AWS Construct Library will accept a
 * `removalPolicy` as a property, typically defaulting it to `RETAIN`.
 *
 * If the AWS Construct Library resource does not accept a `removalPolicy`
 * argument, you can always configure it by using the escape hatch mechanism,
 * as shown in the following example:
 *
 * ```ts
 * declare const bucket: s3.Bucket;
 *
 * const cfnBucket = bucket.node.findChild('Resource') as CfnResource;
 * cfnBucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
 * ```
 */
var RemovalPolicy;
(function (RemovalPolicy) {
    /**
     * This is the default removal policy. It means that when the resource is
     * removed from the app, it will be physically destroyed.
     */
    RemovalPolicy["DESTROY"] = "destroy";
    /**
     * This uses the 'Retain' DeletionPolicy, which will cause the resource to be retained
     * in the account, but orphaned from the stack.
     */
    RemovalPolicy["RETAIN"] = "retain";
    /**
     * This retention policy deletes the resource,
     * but saves a snapshot of its data before deleting,
     * so that it can be re-created later.
     * Only available for some stateful resources,
     * like databases, EC2 volumes, etc.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
     */
    RemovalPolicy["SNAPSHOT"] = "snapshot";
})(RemovalPolicy = exports.RemovalPolicy || (exports.RemovalPolicy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZhbC1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW1vdmFsLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDSCxJQUFZLGFBdUJYO0FBdkJELFdBQVksYUFBYTtJQUN2Qjs7O09BR0c7SUFDSCxvQ0FBbUIsQ0FBQTtJQUVuQjs7O09BR0c7SUFDSCxrQ0FBaUIsQ0FBQTtJQUVqQjs7Ozs7Ozs7T0FRRztJQUNILHNDQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUF2QlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUF1QnhCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIGEgcmVzb3VyY2UncyBSZW1vdmFsIFBvbGljeVxuICpcbiAqIFRoZSByZW1vdmFsIHBvbGljeSBjb250cm9scyB3aGF0IGhhcHBlbnMgdG8gdGhlIHJlc291cmNlIGlmIGl0IHN0b3BzIGJlaW5nXG4gKiBtYW5hZ2VkIGJ5IENsb3VkRm9ybWF0aW9uLiBUaGlzIGNhbiBoYXBwZW4gaW4gb25lIG9mIHRocmVlIHNpdHVhdGlvbnM6XG4gKlxuICogLSBUaGUgcmVzb3VyY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZSB0ZW1wbGF0ZSwgc28gQ2xvdWRGb3JtYXRpb24gc3RvcHMgbWFuYWdpbmcgaXQ7XG4gKiAtIEEgY2hhbmdlIHRvIHRoZSByZXNvdXJjZSBpcyBtYWRlIHRoYXQgcmVxdWlyZXMgaXQgdG8gYmUgcmVwbGFjZWQsIHNvIENsb3VkRm9ybWF0aW9uIHN0b3BzXG4gKiAgIG1hbmFnaW5nIGl0O1xuICogLSBUaGUgc3RhY2sgaXMgZGVsZXRlZCwgc28gQ2xvdWRGb3JtYXRpb24gc3RvcHMgbWFuYWdpbmcgYWxsIHJlc291cmNlcyBpbiBpdC5cbiAqXG4gKiBUaGUgUmVtb3ZhbCBQb2xpY3kgYXBwbGllcyB0byBhbGwgYWJvdmUgY2FzZXMuXG4gKlxuICogTWFueSBzdGF0ZWZ1bCByZXNvdXJjZXMgaW4gdGhlIEFXUyBDb25zdHJ1Y3QgTGlicmFyeSB3aWxsIGFjY2VwdCBhXG4gKiBgcmVtb3ZhbFBvbGljeWAgYXMgYSBwcm9wZXJ0eSwgdHlwaWNhbGx5IGRlZmF1bHRpbmcgaXQgdG8gYFJFVEFJTmAuXG4gKlxuICogSWYgdGhlIEFXUyBDb25zdHJ1Y3QgTGlicmFyeSByZXNvdXJjZSBkb2VzIG5vdCBhY2NlcHQgYSBgcmVtb3ZhbFBvbGljeWBcbiAqIGFyZ3VtZW50LCB5b3UgY2FuIGFsd2F5cyBjb25maWd1cmUgaXQgYnkgdXNpbmcgdGhlIGVzY2FwZSBoYXRjaCBtZWNoYW5pc20sXG4gKiBhcyBzaG93biBpbiB0aGUgZm9sbG93aW5nIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGRlY2xhcmUgY29uc3QgYnVja2V0OiBzMy5CdWNrZXQ7XG4gKlxuICogY29uc3QgY2ZuQnVja2V0ID0gYnVja2V0Lm5vZGUuZmluZENoaWxkKCdSZXNvdXJjZScpIGFzIENmblJlc291cmNlO1xuICogY2ZuQnVja2V0LmFwcGx5UmVtb3ZhbFBvbGljeShSZW1vdmFsUG9saWN5LkRFU1RST1kpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBlbnVtIFJlbW92YWxQb2xpY3kge1xuICAvKipcbiAgICogVGhpcyBpcyB0aGUgZGVmYXVsdCByZW1vdmFsIHBvbGljeS4gSXQgbWVhbnMgdGhhdCB3aGVuIHRoZSByZXNvdXJjZSBpc1xuICAgKiByZW1vdmVkIGZyb20gdGhlIGFwcCwgaXQgd2lsbCBiZSBwaHlzaWNhbGx5IGRlc3Ryb3llZC5cbiAgICovXG4gIERFU1RST1kgPSAnZGVzdHJveScsXG5cbiAgLyoqXG4gICAqIFRoaXMgdXNlcyB0aGUgJ1JldGFpbicgRGVsZXRpb25Qb2xpY3ksIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHJlc291cmNlIHRvIGJlIHJldGFpbmVkXG4gICAqIGluIHRoZSBhY2NvdW50LCBidXQgb3JwaGFuZWQgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICBSRVRBSU4gPSAncmV0YWluJyxcblxuICAvKipcbiAgICogVGhpcyByZXRlbnRpb24gcG9saWN5IGRlbGV0ZXMgdGhlIHJlc291cmNlLFxuICAgKiBidXQgc2F2ZXMgYSBzbmFwc2hvdCBvZiBpdHMgZGF0YSBiZWZvcmUgZGVsZXRpbmcsXG4gICAqIHNvIHRoYXQgaXQgY2FuIGJlIHJlLWNyZWF0ZWQgbGF0ZXIuXG4gICAqIE9ubHkgYXZhaWxhYmxlIGZvciBzb21lIHN0YXRlZnVsIHJlc291cmNlcyxcbiAgICogbGlrZSBkYXRhYmFzZXMsIEVDMiB2b2x1bWVzLCBldGMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLWF0dHJpYnV0ZS1kZWxldGlvbnBvbGljeS5odG1sI2F3cy1hdHRyaWJ1dGUtZGVsZXRpb25wb2xpY3ktb3B0aW9uc1xuICAgKi9cbiAgU05BUFNIT1QgPSAnc25hcHNob3QnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlbW92YWxQb2xpY3lPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHBvbGljeSB0byBhcHBseSBpbiBjYXNlIHRoZSByZW1vdmFsIHBvbGljeSBpcyBub3QgZGVmaW5lZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIGlzIHJlc291cmNlIHNwZWNpZmljLiBUbyBkZXRlcm1pbmUgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIGEgcmVzb3VyY2UsXG4gICAqIHBsZWFzZSBjb25zdWx0IHRoYXQgc3BlY2lmaWMgcmVzb3VyY2UncyBkb2N1bWVudGF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdD86IFJlbW92YWxQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBzYW1lIGRlbGV0aW9uIHBvbGljeSB0byB0aGUgcmVzb3VyY2UncyBcIlVwZGF0ZVJlcGxhY2VQb2xpY3lcIlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBhcHBseVRvVXBkYXRlUmVwbGFjZVBvbGljeT86IGJvb2xlYW47XG59XG4iXX0=