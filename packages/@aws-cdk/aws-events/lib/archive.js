"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archive = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const events_generated_1 = require("./events.generated");
const util_1 = require("./util");
/**
 * Define an EventBridge Archive
 *
 * @resource AWS::Events::Archive
 */
class Archive extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, { physicalName: props.archiveName });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_ArchiveProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Archive);
            }
            throw error;
        }
        let archive = new events_generated_1.CfnArchive(this, 'Archive', {
            sourceArn: props.sourceEventBus.eventBusArn,
            description: props.description,
            eventPattern: (0, util_1.renderEventPattern)(props.eventPattern),
            retentionDays: props.retention?.toDays({ integral: true }) || 0,
            archiveName: this.physicalName,
        });
        this.archiveArn = archive.attrArn;
        this.archiveName = archive.ref;
        this.node.defaultChild = archive;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Archive[_a] = { fqn: "@aws-cdk/aws-events.Archive", version: "0.0.0" };
exports.Archive = Archive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFyY2hpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW1EO0FBSW5ELHlEQUFnRDtBQUNoRCxpQ0FBNEM7QUF3QzVDOzs7O0dBSUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxlQUFRO0lBYW5DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUI7UUFDM0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FkN0MsT0FBTzs7OztRQWdCaEIsSUFBSSxPQUFPLEdBQUcsSUFBSSw2QkFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsV0FBVztZQUMzQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsWUFBWSxFQUFFLElBQUEseUJBQWtCLEVBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUNwRCxhQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQy9ELFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUMvQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztLQUNsQzs7OztBQTNCVSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJRXZlbnRCdXMgfSBmcm9tICcuL2V2ZW50LWJ1cyc7XG5pbXBvcnQgeyBFdmVudFBhdHRlcm4gfSBmcm9tICcuL2V2ZW50LXBhdHRlcm4nO1xuaW1wb3J0IHsgQ2ZuQXJjaGl2ZSB9IGZyb20gJy4vZXZlbnRzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyByZW5kZXJFdmVudFBhdHRlcm4gfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFRoZSBldmVudCBhcmNoaXZlIGJhc2UgcHJvcGVydGllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VBcmNoaXZlUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGFyY2hpdmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdmVOYW1lPzogc3RyaW5nO1xuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBmb3IgdGhlIGFyY2hpdmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbiBldmVudCBwYXR0ZXJuIHRvIHVzZSB0byBmaWx0ZXIgZXZlbnRzIHNlbnQgdG8gdGhlIGFyY2hpdmUuXG4gICAqL1xuICByZWFkb25seSBldmVudFBhdHRlcm46IEV2ZW50UGF0dGVybjtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gZXZlbnRzIGZvci4gRGVmYXVsdCB2YWx1ZSBpcyAwLiBJZiBzZXQgdG8gMCwgZXZlbnRzIGFyZSByZXRhaW5lZCBpbmRlZmluaXRlbHkuXG4gICAqIEBkZWZhdWx0IC0gSW5maW5pdGVcbiAgICovXG4gIHJlYWRvbmx5IHJldGVudGlvbj86IER1cmF0aW9uO1xufVxuXG5cbi8qKlxuICogVGhlIGV2ZW50IGFyY2hpdmUgcHJvcGVydGllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFyY2hpdmVQcm9wcyBleHRlbmRzIEJhc2VBcmNoaXZlUHJvcHMge1xuICAvKipcbiAgICogVGhlIGV2ZW50IHNvdXJjZSBhc3NvY2lhdGVkIHdpdGggdGhlIGFyY2hpdmUuXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VFdmVudEJ1czogSUV2ZW50QnVzO1xufVxuXG4vKipcbiAqIERlZmluZSBhbiBFdmVudEJyaWRnZSBBcmNoaXZlXG4gKlxuICogQHJlc291cmNlIEFXUzo6RXZlbnRzOjpBcmNoaXZlXG4gKi9cbmV4cG9ydCBjbGFzcyBBcmNoaXZlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIGFyY2hpdmUgbmFtZS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFyY2hpdmVOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGFyY2hpdmUgY3JlYXRlZC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFyY2hpdmVBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXJjaGl2ZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHBoeXNpY2FsTmFtZTogcHJvcHMuYXJjaGl2ZU5hbWUgfSk7XG5cbiAgICBsZXQgYXJjaGl2ZSA9IG5ldyBDZm5BcmNoaXZlKHRoaXMsICdBcmNoaXZlJywge1xuICAgICAgc291cmNlQXJuOiBwcm9wcy5zb3VyY2VFdmVudEJ1cy5ldmVudEJ1c0FybixcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIGV2ZW50UGF0dGVybjogcmVuZGVyRXZlbnRQYXR0ZXJuKHByb3BzLmV2ZW50UGF0dGVybiksXG4gICAgICByZXRlbnRpb25EYXlzOiBwcm9wcy5yZXRlbnRpb24/LnRvRGF5cyh7IGludGVncmFsOiB0cnVlIH0pIHx8IDAsXG4gICAgICBhcmNoaXZlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFyY2hpdmVBcm4gPSBhcmNoaXZlLmF0dHJBcm47XG4gICAgdGhpcy5hcmNoaXZlTmFtZSA9IGFyY2hpdmUucmVmO1xuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBhcmNoaXZlO1xuICB9XG59XG4iXX0=