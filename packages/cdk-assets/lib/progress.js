"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
/**
 * A single event for an asset
 */
var EventType;
(function (EventType) {
    /**
     * Just starting on an asset
     */
    EventType["START"] = "start";
    /**
     * When an asset is successfully finished
     */
    EventType["SUCCESS"] = "success";
    /**
     * When an asset failed
     */
    EventType["FAIL"] = "fail";
    /**
     * Checking whether an asset has already been published
     */
    EventType["CHECK"] = "check";
    /**
     * The asset was already published
     */
    EventType["FOUND"] = "found";
    /**
     * The asset was reused locally from a cached version
     */
    EventType["CACHED"] = "cached";
    /**
     * The asset will be built
     */
    EventType["BUILD"] = "build";
    /**
     * The asset will be uploaded
     */
    EventType["UPLOAD"] = "upload";
    /**
     * Another type of detail message
     */
    EventType["DEBUG"] = "debug";
})(EventType || (exports.EventType = EventType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9ncmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFZQTs7R0FFRztBQUNILElBQVksU0E2Q1g7QUE3Q0QsV0FBWSxTQUFTO0lBQ25COztPQUVHO0lBQ0gsNEJBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsZ0NBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCwwQkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCw0QkFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCw0QkFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCw4QkFBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILDRCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILDhCQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsNEJBQWUsQ0FBQTtBQUNqQixDQUFDLEVBN0NXLFNBQVMseUJBQVQsU0FBUyxRQTZDcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTWFuaWZlc3RFbnRyeSB9IGZyb20gJy4vYXNzZXQtbWFuaWZlc3QnO1xuXG4vKipcbiAqIEEgbGlzdGVuZXIgZm9yIHByb2dyZXNzIGV2ZW50cyBmcm9tIHRoZSBwdWJsaXNoZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUHVibGlzaFByb2dyZXNzTGlzdGVuZXIge1xuICAvKipcbiAgICogQXNzZXQgYnVpbGQgZXZlbnRcbiAgICovXG4gIG9uUHVibGlzaEV2ZW50KHR5cGU6IEV2ZW50VHlwZSwgZXZlbnQ6IElQdWJsaXNoUHJvZ3Jlc3MpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgc2luZ2xlIGV2ZW50IGZvciBhbiBhc3NldFxuICovXG5leHBvcnQgZW51bSBFdmVudFR5cGUge1xuICAvKipcbiAgICogSnVzdCBzdGFydGluZyBvbiBhbiBhc3NldFxuICAgKi9cbiAgU1RBUlQgPSAnc3RhcnQnLFxuXG4gIC8qKlxuICAgKiBXaGVuIGFuIGFzc2V0IGlzIHN1Y2Nlc3NmdWxseSBmaW5pc2hlZFxuICAgKi9cbiAgU1VDQ0VTUyA9ICdzdWNjZXNzJyxcblxuICAvKipcbiAgICogV2hlbiBhbiBhc3NldCBmYWlsZWRcbiAgICovXG4gIEZBSUwgPSAnZmFpbCcsXG5cbiAgLyoqXG4gICAqIENoZWNraW5nIHdoZXRoZXIgYW4gYXNzZXQgaGFzIGFscmVhZHkgYmVlbiBwdWJsaXNoZWRcbiAgICovXG4gIENIRUNLID0gJ2NoZWNrJyxcblxuICAvKipcbiAgICogVGhlIGFzc2V0IHdhcyBhbHJlYWR5IHB1Ymxpc2hlZFxuICAgKi9cbiAgRk9VTkQgPSAnZm91bmQnLFxuXG4gIC8qKlxuICAgKiBUaGUgYXNzZXQgd2FzIHJldXNlZCBsb2NhbGx5IGZyb20gYSBjYWNoZWQgdmVyc2lvblxuICAgKi9cbiAgQ0FDSEVEID0gJ2NhY2hlZCcsXG5cbiAgLyoqXG4gICAqIFRoZSBhc3NldCB3aWxsIGJlIGJ1aWx0XG4gICAqL1xuICBCVUlMRCA9ICdidWlsZCcsXG5cbiAgLyoqXG4gICAqIFRoZSBhc3NldCB3aWxsIGJlIHVwbG9hZGVkXG4gICAqL1xuICBVUExPQUQgPSAndXBsb2FkJyxcblxuICAvKipcbiAgICogQW5vdGhlciB0eXBlIG9mIGRldGFpbCBtZXNzYWdlXG4gICAqL1xuICBERUJVRyA9ICdkZWJ1ZycsXG59XG5cbi8qKlxuICogQ29udGV4dCBvYmplY3QgZm9yIHB1Ymxpc2hpbmcgcHJvZ3Jlc3NcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUHVibGlzaFByb2dyZXNzIHtcbiAgLyoqXG4gICAqIEN1cnJlbnQgZXZlbnQgbWVzc2FnZVxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBc3NldCBjdXJyZW50bHkgYmVpbmcgcGFja2FnZWQgKGlmIGFueSlcbiAgICovXG4gIHJlYWRvbmx5IGN1cnJlbnRBc3NldD86IElNYW5pZmVzdEVudHJ5O1xuXG4gIC8qKlxuICAgKiBIb3cgZmFyIGFsb25nIGFyZSB3ZT9cbiAgICovXG4gIHJlYWRvbmx5IHBlcmNlbnRDb21wbGV0ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBYm9ydCB0aGUgY3VycmVudCBwdWJsaXNoaW5nIG9wZXJhdGlvblxuICAgKi9cbiAgYWJvcnQoKTogdm9pZDtcbn1cbiJdfQ==