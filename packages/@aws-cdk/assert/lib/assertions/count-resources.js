"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countResourcesLike = exports.countResources = void 0;
const have_resource_1 = require("./have-resource");
const assertion_1 = require("../assertion");
/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
function countResources(resourceType, count = 1) {
    return new CountResourcesAssertion(resourceType, count);
}
exports.countResources = countResources;
/**
 * An assertion to check whether a resource of a given type and with the given properties exists, considering properties
 */
function countResourcesLike(resourceType, count = 1, props) {
    return new CountResourcesAssertion(resourceType, count, props);
}
exports.countResourcesLike = countResourcesLike;
class CountResourcesAssertion extends assertion_1.JestFriendlyAssertion {
    constructor(resourceType, count, props = null) {
        super();
        this.resourceType = resourceType;
        this.count = count;
        this.inspected = 0;
        this.props = props;
    }
    assertUsing(inspector) {
        let counted = 0;
        for (const logicalId of Object.keys(inspector.value.Resources || {})) {
            const resource = inspector.value.Resources[logicalId];
            if (resource.Type === this.resourceType) {
                if (this.props) {
                    if (have_resource_1.isSuperObject(resource.Properties, this.props, [], true)) {
                        counted++;
                        this.inspected += 1;
                    }
                }
                else {
                    counted++;
                    this.inspected += 1;
                }
            }
        }
        return counted === this.count;
    }
    generateErrorMessage() {
        return this.description;
    }
    get description() {
        return `stack only has ${this.inspected} resource of type ${this.resourceType}${this.props ? ' with specified properties' : ''} but we expected to find ${this.count}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQtcmVzb3VyY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY291bnQtcmVzb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFnRDtBQUNoRCw0Q0FBZ0U7QUFHaEU7O0dBRUc7QUFDSCxTQUFnQixjQUFjLENBQUMsWUFBb0IsRUFBRSxLQUFLLEdBQUcsQ0FBQztJQUM1RCxPQUFPLElBQUksdUJBQXVCLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCx3Q0FFQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQVU7SUFDNUUsT0FBTyxJQUFJLHVCQUF1QixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUZELGdEQUVDO0FBRUQsTUFBTSx1QkFBd0IsU0FBUSxpQ0FBcUM7SUFJekUsWUFDbUIsWUFBb0IsRUFDcEIsS0FBYSxFQUM5QixRQUFhLElBQUk7UUFDakIsS0FBSyxFQUFFLENBQUM7UUFIUyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBTHhCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFRNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxTQUF5QjtRQUMxQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ3BFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSw2QkFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQzVELE9BQU8sRUFBRSxDQUFDO3dCQUNWLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO3FCQUNyQjtpQkFDRjtxQkFBTTtvQkFDTCxPQUFPLEVBQUUsQ0FBQztvQkFDVixJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztpQkFDckI7YUFDRjtTQUNGO1FBRUQsT0FBTyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNoQyxDQUFDO0lBRU0sb0JBQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sa0JBQWtCLElBQUksQ0FBQyxTQUFTLHFCQUFxQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxFQUFFLDRCQUE0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekssQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNTdXBlck9iamVjdCB9IGZyb20gJy4vaGF2ZS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBBc3NlcnRpb24sIEplc3RGcmllbmRseUFzc2VydGlvbiB9IGZyb20gJy4uL2Fzc2VydGlvbic7XG5pbXBvcnQgeyBTdGFja0luc3BlY3RvciB9IGZyb20gJy4uL2luc3BlY3Rvcic7XG5cbi8qKlxuICogQW4gYXNzZXJ0aW9uIHRvIGNoZWNrIHdoZXRoZXIgYSByZXNvdXJjZSBvZiBhIGdpdmVuIHR5cGUgYW5kIHdpdGggdGhlIGdpdmVuIHByb3BlcnRpZXMgZXhpc3RzLCBkaXNyZWdhcmRpbmcgcHJvcGVydGllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnRSZXNvdXJjZXMocmVzb3VyY2VUeXBlOiBzdHJpbmcsIGNvdW50ID0gMSk6IEplc3RGcmllbmRseUFzc2VydGlvbjxTdGFja0luc3BlY3Rvcj4ge1xuICByZXR1cm4gbmV3IENvdW50UmVzb3VyY2VzQXNzZXJ0aW9uKHJlc291cmNlVHlwZSwgY291bnQpO1xufVxuXG4vKipcbiAqIEFuIGFzc2VydGlvbiB0byBjaGVjayB3aGV0aGVyIGEgcmVzb3VyY2Ugb2YgYSBnaXZlbiB0eXBlIGFuZCB3aXRoIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIGV4aXN0cywgY29uc2lkZXJpbmcgcHJvcGVydGllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnRSZXNvdXJjZXNMaWtlKHJlc291cmNlVHlwZTogc3RyaW5nLCBjb3VudCA9IDEsIHByb3BzOiBhbnkpOiBBc3NlcnRpb248U3RhY2tJbnNwZWN0b3I+IHtcbiAgcmV0dXJuIG5ldyBDb3VudFJlc291cmNlc0Fzc2VydGlvbihyZXNvdXJjZVR5cGUsIGNvdW50LCBwcm9wcyk7XG59XG5cbmNsYXNzIENvdW50UmVzb3VyY2VzQXNzZXJ0aW9uIGV4dGVuZHMgSmVzdEZyaWVuZGx5QXNzZXJ0aW9uPFN0YWNrSW5zcGVjdG9yPiB7XG4gIHByaXZhdGUgaW5zcGVjdGVkOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZVR5cGU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvdW50OiBudW1iZXIsXG4gICAgcHJvcHM6IGFueSA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRVc2luZyhpbnNwZWN0b3I6IFN0YWNrSW5zcGVjdG9yKTogYm9vbGVhbiB7XG4gICAgbGV0IGNvdW50ZWQgPSAwO1xuICAgIGZvciAoY29uc3QgbG9naWNhbElkIG9mIE9iamVjdC5rZXlzKGluc3BlY3Rvci52YWx1ZS5SZXNvdXJjZXMgfHwge30pKSB7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGluc3BlY3Rvci52YWx1ZS5SZXNvdXJjZXNbbG9naWNhbElkXTtcbiAgICAgIGlmIChyZXNvdXJjZS5UeXBlID09PSB0aGlzLnJlc291cmNlVHlwZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcykge1xuICAgICAgICAgIGlmIChpc1N1cGVyT2JqZWN0KHJlc291cmNlLlByb3BlcnRpZXMsIHRoaXMucHJvcHMsIFtdLCB0cnVlKSkge1xuICAgICAgICAgICAgY291bnRlZCsrO1xuICAgICAgICAgICAgdGhpcy5pbnNwZWN0ZWQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnRlZCsrO1xuICAgICAgICAgIHRoaXMuaW5zcGVjdGVkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY291bnRlZCA9PT0gdGhpcy5jb3VudDtcbiAgfVxuXG4gIHB1YmxpYyBnZW5lcmF0ZUVycm9yTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xuICB9XG5cbiAgcHVibGljIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgc3RhY2sgb25seSBoYXMgJHt0aGlzLmluc3BlY3RlZH0gcmVzb3VyY2Ugb2YgdHlwZSAke3RoaXMucmVzb3VyY2VUeXBlfSR7dGhpcy5wcm9wcyA/ICcgd2l0aCBzcGVjaWZpZWQgcHJvcGVydGllcycgOiAnJ30gYnV0IHdlIGV4cGVjdGVkIHRvIGZpbmQgJHt0aGlzLmNvdW50fWA7XG4gIH1cbn1cbiJdfQ==