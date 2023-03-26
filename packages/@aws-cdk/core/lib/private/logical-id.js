"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalIDs = void 0;
/**
 * Class that keeps track of the logical IDs that are assigned to resources
 *
 * Supports renaming the generated IDs.
 */
class LogicalIDs {
    constructor() {
        /**
         * The rename table (old to new)
         */
        this.renames = {};
        /**
         * All assigned names (new to old, may be identical)
         *
         * This is used to ensure that:
         *
         * - No 2 resources end up with the same final logical ID, unless they were the same to begin with.
         * - All renames have been used at the end of renaming.
         */
        this.reverse = {};
    }
    /**
     * Rename a logical ID from an old ID to a new ID
     */
    addRename(oldId, newId) {
        if (oldId in this.renames) {
            throw new Error(`A rename has already been registered for '${oldId}'`);
        }
        this.renames[oldId] = newId;
    }
    /**
     * Return the renamed version of an ID or the original ID.
     */
    applyRename(oldId) {
        let newId = oldId;
        if (oldId in this.renames) {
            newId = this.renames[oldId];
        }
        // If this newId has already been used, it must have been with the same oldId
        if (newId in this.reverse && this.reverse[newId] !== oldId) {
            // eslint-disable-next-line max-len
            throw new Error(`Two objects have been assigned the same Logical ID: '${this.reverse[newId]}' and '${oldId}' are now both named '${newId}'.`);
        }
        this.reverse[newId] = oldId;
        validateLogicalId(newId);
        return newId;
    }
    /**
     * Throw an error if not all renames have been used
     *
     * This is to assure that users didn't make typoes when registering renames.
     */
    assertAllRenamesApplied() {
        const keys = new Set();
        Object.keys(this.renames).forEach(keys.add.bind(keys));
        Object.keys(this.reverse).map(newId => {
            keys.delete(this.reverse[newId]);
        });
        if (keys.size !== 0) {
            const unusedRenames = Array.from(keys.values());
            throw new Error(`The following Logical IDs were attempted to be renamed, but not found: ${unusedRenames.join(', ')}`);
        }
    }
}
exports.LogicalIDs = LogicalIDs;
const VALID_LOGICALID_REGEX = /^[A-Za-z][A-Za-z0-9]{1,254}$/;
/**
 * Validate logical ID is valid for CloudFormation
 */
function validateLogicalId(logicalId) {
    if (!VALID_LOGICALID_REGEX.test(logicalId)) {
        throw new Error(`Logical ID must adhere to the regular expression: ${VALID_LOGICALID_REGEX.toString()}, got '${logicalId}'`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbC1pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2ljYWwtaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILE1BQWEsVUFBVTtJQUF2QjtRQUNFOztXQUVHO1FBQ2MsWUFBTyxHQUE0QixFQUFFLENBQUM7UUFFdkQ7Ozs7Ozs7V0FPRztRQUNjLFlBQU8sR0FBMkIsRUFBRSxDQUFDO0lBa0R4RCxDQUFDO0lBaERDOztPQUVHO0lBQ0ksU0FBUyxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQzNDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxXQUFXLENBQUMsS0FBYTtRQUM5QixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUVELDZFQUE2RTtRQUM3RSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQzFELG1DQUFtQztZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUsseUJBQXlCLEtBQUssSUFBSSxDQUFDLENBQUM7U0FDL0k7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUU1QixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQ7Ozs7T0FJRztJQUNJLHVCQUF1QjtRQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXZELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNoRCxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2SDtLQUNGO0NBQ0Y7QUFoRUQsZ0NBZ0VDO0FBRUQsTUFBTSxxQkFBcUIsR0FBRyw4QkFBOEIsQ0FBQztBQUU3RDs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsU0FBaUI7SUFDMUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQzlIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xhc3MgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgbG9naWNhbCBJRHMgdGhhdCBhcmUgYXNzaWduZWQgdG8gcmVzb3VyY2VzXG4gKlxuICogU3VwcG9ydHMgcmVuYW1pbmcgdGhlIGdlbmVyYXRlZCBJRHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dpY2FsSURzIHtcbiAgLyoqXG4gICAqIFRoZSByZW5hbWUgdGFibGUgKG9sZCB0byBuZXcpXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJlbmFtZXM6IHtbb2xkOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLyoqXG4gICAqIEFsbCBhc3NpZ25lZCBuYW1lcyAobmV3IHRvIG9sZCwgbWF5IGJlIGlkZW50aWNhbClcbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0OlxuICAgKlxuICAgKiAtIE5vIDIgcmVzb3VyY2VzIGVuZCB1cCB3aXRoIHRoZSBzYW1lIGZpbmFsIGxvZ2ljYWwgSUQsIHVubGVzcyB0aGV5IHdlcmUgdGhlIHNhbWUgdG8gYmVnaW4gd2l0aC5cbiAgICogLSBBbGwgcmVuYW1lcyBoYXZlIGJlZW4gdXNlZCBhdCB0aGUgZW5kIG9mIHJlbmFtaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSByZXZlcnNlOiB7W2lkOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLyoqXG4gICAqIFJlbmFtZSBhIGxvZ2ljYWwgSUQgZnJvbSBhbiBvbGQgSUQgdG8gYSBuZXcgSURcbiAgICovXG4gIHB1YmxpYyBhZGRSZW5hbWUob2xkSWQ6IHN0cmluZywgbmV3SWQ6IHN0cmluZykge1xuICAgIGlmIChvbGRJZCBpbiB0aGlzLnJlbmFtZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSByZW5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtvbGRJZH0nYCk7XG4gICAgfVxuICAgIHRoaXMucmVuYW1lc1tvbGRJZF0gPSBuZXdJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlbmFtZWQgdmVyc2lvbiBvZiBhbiBJRCBvciB0aGUgb3JpZ2luYWwgSUQuXG4gICAqL1xuICBwdWJsaWMgYXBwbHlSZW5hbWUob2xkSWQ6IHN0cmluZykge1xuICAgIGxldCBuZXdJZCA9IG9sZElkO1xuICAgIGlmIChvbGRJZCBpbiB0aGlzLnJlbmFtZXMpIHtcbiAgICAgIG5ld0lkID0gdGhpcy5yZW5hbWVzW29sZElkXTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIG5ld0lkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaXQgbXVzdCBoYXZlIGJlZW4gd2l0aCB0aGUgc2FtZSBvbGRJZFxuICAgIGlmIChuZXdJZCBpbiB0aGlzLnJldmVyc2UgJiYgdGhpcy5yZXZlcnNlW25ld0lkXSAhPT0gb2xkSWQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBvYmplY3RzIGhhdmUgYmVlbiBhc3NpZ25lZCB0aGUgc2FtZSBMb2dpY2FsIElEOiAnJHt0aGlzLnJldmVyc2VbbmV3SWRdfScgYW5kICcke29sZElkfScgYXJlIG5vdyBib3RoIG5hbWVkICcke25ld0lkfScuYCk7XG4gICAgfVxuICAgIHRoaXMucmV2ZXJzZVtuZXdJZF0gPSBvbGRJZDtcblxuICAgIHZhbGlkYXRlTG9naWNhbElkKG5ld0lkKTtcbiAgICByZXR1cm4gbmV3SWQ7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3cgYW4gZXJyb3IgaWYgbm90IGFsbCByZW5hbWVzIGhhdmUgYmVlbiB1c2VkXG4gICAqXG4gICAqIFRoaXMgaXMgdG8gYXNzdXJlIHRoYXQgdXNlcnMgZGlkbid0IG1ha2UgdHlwb2VzIHdoZW4gcmVnaXN0ZXJpbmcgcmVuYW1lcy5cbiAgICovXG4gIHB1YmxpYyBhc3NlcnRBbGxSZW5hbWVzQXBwbGllZCgpIHtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgT2JqZWN0LmtleXModGhpcy5yZW5hbWVzKS5mb3JFYWNoKGtleXMuYWRkLmJpbmQoa2V5cykpO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5yZXZlcnNlKS5tYXAobmV3SWQgPT4ge1xuICAgICAga2V5cy5kZWxldGUodGhpcy5yZXZlcnNlW25ld0lkXSk7XG4gICAgfSk7XG5cbiAgICBpZiAoa2V5cy5zaXplICE9PSAwKSB7XG4gICAgICBjb25zdCB1bnVzZWRSZW5hbWVzID0gQXJyYXkuZnJvbShrZXlzLnZhbHVlcygpKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBMb2dpY2FsIElEcyB3ZXJlIGF0dGVtcHRlZCB0byBiZSByZW5hbWVkLCBidXQgbm90IGZvdW5kOiAke3VudXNlZFJlbmFtZXMuam9pbignLCAnKX1gKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgVkFMSURfTE9HSUNBTElEX1JFR0VYID0gL15bQS1aYS16XVtBLVphLXowLTldezEsMjU0fSQvO1xuXG4vKipcbiAqIFZhbGlkYXRlIGxvZ2ljYWwgSUQgaXMgdmFsaWQgZm9yIENsb3VkRm9ybWF0aW9uXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlTG9naWNhbElkKGxvZ2ljYWxJZDogc3RyaW5nKSB7XG4gIGlmICghVkFMSURfTE9HSUNBTElEX1JFR0VYLnRlc3QobG9naWNhbElkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTG9naWNhbCBJRCBtdXN0IGFkaGVyZSB0byB0aGUgcmVndWxhciBleHByZXNzaW9uOiAke1ZBTElEX0xPR0lDQUxJRF9SRUdFWC50b1N0cmluZygpfSwgZ290ICcke2xvZ2ljYWxJZH0nYCk7XG4gIH1cbn1cbiJdfQ==