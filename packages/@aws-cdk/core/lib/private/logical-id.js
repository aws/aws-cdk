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
     * This is to assure that users didn't make typos when registering renames.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbC1pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2ljYWwtaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILE1BQWEsVUFBVTtJQUF2QjtRQUNFOztXQUVHO1FBQ2MsWUFBTyxHQUE0QixFQUFFLENBQUM7UUFFdkQ7Ozs7Ozs7V0FPRztRQUNjLFlBQU8sR0FBMkIsRUFBRSxDQUFDO0lBa0R4RCxDQUFDO0lBaERDOztPQUVHO0lBQ0ksU0FBUyxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQzNDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxLQUFhO1FBQzlCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3pCLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBRUQsNkVBQTZFO1FBQzdFLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDMUQsbUNBQW1DO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyx5QkFBeUIsS0FBSyxJQUFJLENBQUMsQ0FBQztTQUMvSTtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRTVCLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSx1QkFBdUI7UUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV2RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkg7SUFDSCxDQUFDO0NBQ0Y7QUFoRUQsZ0NBZ0VDO0FBRUQsTUFBTSxxQkFBcUIsR0FBRyw4QkFBOEIsQ0FBQztBQUU3RDs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsU0FBaUI7SUFDMUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQzlIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xhc3MgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgbG9naWNhbCBJRHMgdGhhdCBhcmUgYXNzaWduZWQgdG8gcmVzb3VyY2VzXG4gKlxuICogU3VwcG9ydHMgcmVuYW1pbmcgdGhlIGdlbmVyYXRlZCBJRHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dpY2FsSURzIHtcbiAgLyoqXG4gICAqIFRoZSByZW5hbWUgdGFibGUgKG9sZCB0byBuZXcpXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJlbmFtZXM6IHtbb2xkOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLyoqXG4gICAqIEFsbCBhc3NpZ25lZCBuYW1lcyAobmV3IHRvIG9sZCwgbWF5IGJlIGlkZW50aWNhbClcbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0OlxuICAgKlxuICAgKiAtIE5vIDIgcmVzb3VyY2VzIGVuZCB1cCB3aXRoIHRoZSBzYW1lIGZpbmFsIGxvZ2ljYWwgSUQsIHVubGVzcyB0aGV5IHdlcmUgdGhlIHNhbWUgdG8gYmVnaW4gd2l0aC5cbiAgICogLSBBbGwgcmVuYW1lcyBoYXZlIGJlZW4gdXNlZCBhdCB0aGUgZW5kIG9mIHJlbmFtaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSByZXZlcnNlOiB7W2lkOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLyoqXG4gICAqIFJlbmFtZSBhIGxvZ2ljYWwgSUQgZnJvbSBhbiBvbGQgSUQgdG8gYSBuZXcgSURcbiAgICovXG4gIHB1YmxpYyBhZGRSZW5hbWUob2xkSWQ6IHN0cmluZywgbmV3SWQ6IHN0cmluZykge1xuICAgIGlmIChvbGRJZCBpbiB0aGlzLnJlbmFtZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSByZW5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtvbGRJZH0nYCk7XG4gICAgfVxuICAgIHRoaXMucmVuYW1lc1tvbGRJZF0gPSBuZXdJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlbmFtZWQgdmVyc2lvbiBvZiBhbiBJRCBvciB0aGUgb3JpZ2luYWwgSUQuXG4gICAqL1xuICBwdWJsaWMgYXBwbHlSZW5hbWUob2xkSWQ6IHN0cmluZykge1xuICAgIGxldCBuZXdJZCA9IG9sZElkO1xuICAgIGlmIChvbGRJZCBpbiB0aGlzLnJlbmFtZXMpIHtcbiAgICAgIG5ld0lkID0gdGhpcy5yZW5hbWVzW29sZElkXTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIG5ld0lkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaXQgbXVzdCBoYXZlIGJlZW4gd2l0aCB0aGUgc2FtZSBvbGRJZFxuICAgIGlmIChuZXdJZCBpbiB0aGlzLnJldmVyc2UgJiYgdGhpcy5yZXZlcnNlW25ld0lkXSAhPT0gb2xkSWQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBvYmplY3RzIGhhdmUgYmVlbiBhc3NpZ25lZCB0aGUgc2FtZSBMb2dpY2FsIElEOiAnJHt0aGlzLnJldmVyc2VbbmV3SWRdfScgYW5kICcke29sZElkfScgYXJlIG5vdyBib3RoIG5hbWVkICcke25ld0lkfScuYCk7XG4gICAgfVxuICAgIHRoaXMucmV2ZXJzZVtuZXdJZF0gPSBvbGRJZDtcblxuICAgIHZhbGlkYXRlTG9naWNhbElkKG5ld0lkKTtcbiAgICByZXR1cm4gbmV3SWQ7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3cgYW4gZXJyb3IgaWYgbm90IGFsbCByZW5hbWVzIGhhdmUgYmVlbiB1c2VkXG4gICAqXG4gICAqIFRoaXMgaXMgdG8gYXNzdXJlIHRoYXQgdXNlcnMgZGlkbid0IG1ha2UgdHlwb3Mgd2hlbiByZWdpc3RlcmluZyByZW5hbWVzLlxuICAgKi9cbiAgcHVibGljIGFzc2VydEFsbFJlbmFtZXNBcHBsaWVkKCkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJlbmFtZXMpLmZvckVhY2goa2V5cy5hZGQuYmluZChrZXlzKSk7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnJldmVyc2UpLm1hcChuZXdJZCA9PiB7XG4gICAgICBrZXlzLmRlbGV0ZSh0aGlzLnJldmVyc2VbbmV3SWRdKTtcbiAgICB9KTtcblxuICAgIGlmIChrZXlzLnNpemUgIT09IDApIHtcbiAgICAgIGNvbnN0IHVudXNlZFJlbmFtZXMgPSBBcnJheS5mcm9tKGtleXMudmFsdWVzKCkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIExvZ2ljYWwgSURzIHdlcmUgYXR0ZW1wdGVkIHRvIGJlIHJlbmFtZWQsIGJ1dCBub3QgZm91bmQ6ICR7dW51c2VkUmVuYW1lcy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBWQUxJRF9MT0dJQ0FMSURfUkVHRVggPSAvXltBLVphLXpdW0EtWmEtejAtOV17MSwyNTR9JC87XG5cbi8qKlxuICogVmFsaWRhdGUgbG9naWNhbCBJRCBpcyB2YWxpZCBmb3IgQ2xvdWRGb3JtYXRpb25cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVMb2dpY2FsSWQobG9naWNhbElkOiBzdHJpbmcpIHtcbiAgaWYgKCFWQUxJRF9MT0dJQ0FMSURfUkVHRVgudGVzdChsb2dpY2FsSWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBMb2dpY2FsIElEIG11c3QgYWRoZXJlIHRvIHRoZSByZWd1bGFyIGV4cHJlc3Npb246ICR7VkFMSURfTE9HSUNBTElEX1JFR0VYLnRvU3RyaW5nKCl9LCBnb3QgJyR7bG9naWNhbElkfSdgKTtcbiAgfVxufVxuIl19