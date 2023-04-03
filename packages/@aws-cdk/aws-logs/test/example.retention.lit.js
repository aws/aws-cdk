"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const stack = new core_1.Stack();
function shortLogGroup() {
    /// !show
    // Configure log group for short retention
    const logGroup = new lib_1.LogGroup(stack, 'LogGroup', {
        retention: lib_1.RetentionDays.ONE_WEEK,
    });
    /// !hide
    return logGroup;
}
function infiniteLogGroup() {
    /// !show
    // Configure log group for infinite retention
    const logGroup = new lib_1.LogGroup(stack, 'LogGroup', {
        retention: Infinity,
    });
    /// !hide
    return logGroup;
}
//
Array.isArray(shortLogGroup);
Array.isArray(infiniteLogGroup);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5yZXRlbnRpb24ubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbXBsZS5yZXRlbnRpb24ubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXNDO0FBQ3RDLGdDQUFpRDtBQUVqRCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0FBRTFCLFNBQVMsYUFBYTtJQUNwQixTQUFTO0lBQ1QsMENBQTBDO0lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDL0MsU0FBUyxFQUFFLG1CQUFhLENBQUMsUUFBUTtLQUNsQyxDQUFDLENBQUM7SUFDSCxTQUFTO0lBQ1QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsZ0JBQWdCO0lBQ3ZCLFNBQVM7SUFDVCw2Q0FBNkM7SUFDN0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUMvQyxTQUFTLEVBQUUsUUFBUTtLQUNwQixDQUFDLENBQUM7SUFDSCxTQUFTO0lBQ1QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELEVBQUU7QUFFRixLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzdCLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBMb2dHcm91cCwgUmV0ZW50aW9uRGF5cyB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbmZ1bmN0aW9uIHNob3J0TG9nR3JvdXAoKSB7XG4gIC8vLyAhc2hvd1xuICAvLyBDb25maWd1cmUgbG9nIGdyb3VwIGZvciBzaG9ydCByZXRlbnRpb25cbiAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gIH0pO1xuICAvLy8gIWhpZGVcbiAgcmV0dXJuIGxvZ0dyb3VwO1xufVxuXG5mdW5jdGlvbiBpbmZpbml0ZUxvZ0dyb3VwKCkge1xuICAvLy8gIXNob3dcbiAgLy8gQ29uZmlndXJlIGxvZyBncm91cCBmb3IgaW5maW5pdGUgcmV0ZW50aW9uXG4gIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gICAgcmV0ZW50aW9uOiBJbmZpbml0eSxcbiAgfSk7XG4gIC8vLyAhaGlkZVxuICByZXR1cm4gbG9nR3JvdXA7XG59XG5cbi8vXG5cbkFycmF5LmlzQXJyYXkoc2hvcnRMb2dHcm91cCk7XG5BcnJheS5pc0FycmF5KGluZmluaXRlTG9nR3JvdXApO1xuIl19