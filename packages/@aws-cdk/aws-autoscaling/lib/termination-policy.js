"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminationPolicy = void 0;
/**
 * Specifies the termination criteria to apply before Amazon EC2 Auto Scaling
 * chooses an instance for termination.
 */
var TerminationPolicy;
(function (TerminationPolicy) {
    /**
     * Terminate instances in the Auto Scaling group to align the remaining
     * instances to the allocation strategy for the type of instance that is
     * terminating (either a Spot Instance or an On-Demand Instance).
     */
    TerminationPolicy["ALLOCATION_STRATEGY"] = "AllocationStrategy";
    /**
     * Terminate instances that are closest to the next billing hour.
     */
    TerminationPolicy["CLOSEST_TO_NEXT_INSTANCE_HOUR"] = "ClosestToNextInstanceHour";
    /**
     * Terminate instances according to the default termination policy.
     */
    TerminationPolicy["DEFAULT"] = "Default";
    /**
     * Terminate the newest instance in the group.
     */
    TerminationPolicy["NEWEST_INSTANCE"] = "NewestInstance";
    /**
     * Terminate the oldest instance in the group.
     */
    TerminationPolicy["OLDEST_INSTANCE"] = "OldestInstance";
    /**
     * Terminate instances that have the oldest launch configuration.
     */
    TerminationPolicy["OLDEST_LAUNCH_CONFIGURATION"] = "OldestLaunchConfiguration";
    /**
     * Terminate instances that have the oldest launch template.
     */
    TerminationPolicy["OLDEST_LAUNCH_TEMPLATE"] = "OldestLaunchTemplate";
})(TerminationPolicy = exports.TerminationPolicy || (exports.TerminationPolicy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYXRpb24tcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVybWluYXRpb24tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILElBQVksaUJBcUNYO0FBckNELFdBQVksaUJBQWlCO0lBQzNCOzs7O09BSUc7SUFDSCwrREFBMEMsQ0FBQTtJQUUxQzs7T0FFRztJQUNILGdGQUEyRCxDQUFBO0lBRTNEOztPQUVHO0lBQ0gsd0NBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCx1REFBa0MsQ0FBQTtJQUVsQzs7T0FFRztJQUNILHVEQUFrQyxDQUFBO0lBRWxDOztPQUVHO0lBQ0gsOEVBQXlELENBQUE7SUFFekQ7O09BRUc7SUFDSCxvRUFBK0MsQ0FBQTtBQUNqRCxDQUFDLEVBckNXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBcUM1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3BlY2lmaWVzIHRoZSB0ZXJtaW5hdGlvbiBjcml0ZXJpYSB0byBhcHBseSBiZWZvcmUgQW1hem9uIEVDMiBBdXRvIFNjYWxpbmdcbiAqIGNob29zZXMgYW4gaW5zdGFuY2UgZm9yIHRlcm1pbmF0aW9uLlxuICovXG5leHBvcnQgZW51bSBUZXJtaW5hdGlvblBvbGljeSB7XG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgaW5zdGFuY2VzIGluIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgdG8gYWxpZ24gdGhlIHJlbWFpbmluZ1xuICAgKiBpbnN0YW5jZXMgdG8gdGhlIGFsbG9jYXRpb24gc3RyYXRlZ3kgZm9yIHRoZSB0eXBlIG9mIGluc3RhbmNlIHRoYXQgaXNcbiAgICogdGVybWluYXRpbmcgKGVpdGhlciBhIFNwb3QgSW5zdGFuY2Ugb3IgYW4gT24tRGVtYW5kIEluc3RhbmNlKS5cbiAgICovXG4gIEFMTE9DQVRJT05fU1RSQVRFR1kgPSAnQWxsb2NhdGlvblN0cmF0ZWd5JyxcblxuICAvKipcbiAgICogVGVybWluYXRlIGluc3RhbmNlcyB0aGF0IGFyZSBjbG9zZXN0IHRvIHRoZSBuZXh0IGJpbGxpbmcgaG91ci5cbiAgICovXG4gIENMT1NFU1RfVE9fTkVYVF9JTlNUQU5DRV9IT1VSID0gJ0Nsb3Nlc3RUb05leHRJbnN0YW5jZUhvdXInLFxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgaW5zdGFuY2VzIGFjY29yZGluZyB0byB0aGUgZGVmYXVsdCB0ZXJtaW5hdGlvbiBwb2xpY3kuXG4gICAqL1xuICBERUZBVUxUID0gJ0RlZmF1bHQnLFxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgdGhlIG5ld2VzdCBpbnN0YW5jZSBpbiB0aGUgZ3JvdXAuXG4gICAqL1xuICBORVdFU1RfSU5TVEFOQ0UgPSAnTmV3ZXN0SW5zdGFuY2UnLFxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgdGhlIG9sZGVzdCBpbnN0YW5jZSBpbiB0aGUgZ3JvdXAuXG4gICAqL1xuICBPTERFU1RfSU5TVEFOQ0UgPSAnT2xkZXN0SW5zdGFuY2UnLFxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgaW5zdGFuY2VzIHRoYXQgaGF2ZSB0aGUgb2xkZXN0IGxhdW5jaCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgT0xERVNUX0xBVU5DSF9DT05GSUdVUkFUSU9OID0gJ09sZGVzdExhdW5jaENvbmZpZ3VyYXRpb24nLFxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgaW5zdGFuY2VzIHRoYXQgaGF2ZSB0aGUgb2xkZXN0IGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICovXG4gIE9MREVTVF9MQVVOQ0hfVEVNUExBVEUgPSAnT2xkZXN0TGF1bmNoVGVtcGxhdGUnLFxufVxuIl19