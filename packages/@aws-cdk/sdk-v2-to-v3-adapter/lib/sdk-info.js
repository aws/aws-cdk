"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeActionName = exports.normalizeServiceName = void 0;
/**
 * Normalize a service name from:
 *
 * - A full SDKv3 package name
 * - A partial SDKv3 package name
 * - An SDKv2 constructor name
 *
 * To a partial SDKv3 package name.
 */
function normalizeServiceName(service) {
    service = service.toLowerCase(); // Lowercase
    service = service.replace(/^@aws-sdk\/client-/, ''); // Strip the start of a V3 package name
    service = v2ToV3Mapping()?.[service] ?? service; // Optionally map v2 name -> v3 name
    return service;
}
exports.normalizeServiceName = normalizeServiceName;
/**
 * Normalize an action name from:
 *
 * - camelCase SDKv2 method name
 * - PascalCase API name
 * - SDKv3 command class name
 *
 * To a PascalCase API name.
 */
function normalizeActionName(v3Service, action) {
    if (action.charAt(0).toLowerCase() === action.charAt(0)) {
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
    // If the given word is in the APIs ending in 'Command' for this service,
    // return as is. Otherwise, return with a potential 'Command' suffix stripped.
    if (v3Metadata()[v3Service]?.commands?.includes(action)) {
        return action;
    }
    return action.replace(/Command$/, '');
}
exports.normalizeActionName = normalizeActionName;
function v2ToV3Mapping() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./sdk-v2-to-v3.json');
}
function v3Metadata() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./sdk-v3-metadata.json');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2RrLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZGstaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLE9BQWU7SUFDbEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFlBQVk7SUFDN0MsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyx1Q0FBdUM7SUFDNUYsT0FBTyxHQUFHLGFBQWEsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsb0NBQW9DO0lBQ3JGLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFMRCxvREFLQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxNQUFjO0lBQ25FLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSw4RUFBOEU7SUFDOUUsSUFBSSxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDeEQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQVpELGtEQVlDO0FBRUQsU0FBUyxhQUFhO0lBQ3BCLGlFQUFpRTtJQUNqRSxPQUFPLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxTQUFTLFVBQVU7SUFDakIsaUVBQWlFO0lBQ2pFLE9BQU8sT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDM0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTm9ybWFsaXplIGEgc2VydmljZSBuYW1lIGZyb206XG4gKlxuICogLSBBIGZ1bGwgU0RLdjMgcGFja2FnZSBuYW1lXG4gKiAtIEEgcGFydGlhbCBTREt2MyBwYWNrYWdlIG5hbWVcbiAqIC0gQW4gU0RLdjIgY29uc3RydWN0b3IgbmFtZVxuICpcbiAqIFRvIGEgcGFydGlhbCBTREt2MyBwYWNrYWdlIG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVTZXJ2aWNlTmFtZShzZXJ2aWNlOiBzdHJpbmcpIHtcbiAgc2VydmljZSA9IHNlcnZpY2UudG9Mb3dlckNhc2UoKTsgLy8gTG93ZXJjYXNlXG4gIHNlcnZpY2UgPSBzZXJ2aWNlLnJlcGxhY2UoL15AYXdzLXNka1xcL2NsaWVudC0vLCAnJyk7IC8vIFN0cmlwIHRoZSBzdGFydCBvZiBhIFYzIHBhY2thZ2UgbmFtZVxuICBzZXJ2aWNlID0gdjJUb1YzTWFwcGluZygpPy5bc2VydmljZV0gPz8gc2VydmljZTsgLy8gT3B0aW9uYWxseSBtYXAgdjIgbmFtZSAtPiB2MyBuYW1lXG4gIHJldHVybiBzZXJ2aWNlO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhbiBhY3Rpb24gbmFtZSBmcm9tOlxuICpcbiAqIC0gY2FtZWxDYXNlIFNES3YyIG1ldGhvZCBuYW1lXG4gKiAtIFBhc2NhbENhc2UgQVBJIG5hbWVcbiAqIC0gU0RLdjMgY29tbWFuZCBjbGFzcyBuYW1lXG4gKlxuICogVG8gYSBQYXNjYWxDYXNlIEFQSSBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQWN0aW9uTmFtZSh2M1NlcnZpY2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcpIHtcbiAgaWYgKGFjdGlvbi5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSA9PT0gYWN0aW9uLmNoYXJBdCgwKSkge1xuICAgIHJldHVybiBhY3Rpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBhY3Rpb24uc2xpY2UoMSk7XG4gIH1cblxuICAvLyBJZiB0aGUgZ2l2ZW4gd29yZCBpcyBpbiB0aGUgQVBJcyBlbmRpbmcgaW4gJ0NvbW1hbmQnIGZvciB0aGlzIHNlcnZpY2UsXG4gIC8vIHJldHVybiBhcyBpcy4gT3RoZXJ3aXNlLCByZXR1cm4gd2l0aCBhIHBvdGVudGlhbCAnQ29tbWFuZCcgc3VmZml4IHN0cmlwcGVkLlxuICBpZiAodjNNZXRhZGF0YSgpW3YzU2VydmljZV0/LmNvbW1hbmRzPy5pbmNsdWRlcyhhY3Rpb24pKSB7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIHJldHVybiBhY3Rpb24ucmVwbGFjZSgvQ29tbWFuZCQvLCAnJyk7XG59XG5cbmZ1bmN0aW9uIHYyVG9WM01hcHBpbmcoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gIHJldHVybiByZXF1aXJlKCcuL3Nkay12Mi10by12My5qc29uJyk7XG59XG5cbmZ1bmN0aW9uIHYzTWV0YWRhdGEoKTogUmVjb3JkPHN0cmluZywgeyBpYW1QcmVmaXg/OiBzdHJpbmc7IGNvbW1hbmRzPzogc3RyaW5nW10gfT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICByZXR1cm4gcmVxdWlyZSgnLi9zZGstdjMtbWV0YWRhdGEuanNvbicpO1xufVxuIl19