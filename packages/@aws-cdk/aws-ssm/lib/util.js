"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arnForParameterName = exports.AUTOGEN_MARKER = void 0;
const core_1 = require("@aws-cdk/core");
exports.AUTOGEN_MARKER = '$$autogen$$';
/**
 * Renders an ARN for an SSM parameter given a parameter name.
 * @param scope definition scope
 * @param parameterName the parameter name to include in the ARN
 * @param physicalName optional physical name specified by the user (to auto-detect separator)
 */
function arnForParameterName(scope, parameterName, options = {}) {
    const physicalName = options.physicalName;
    const nameToValidate = physicalName || parameterName;
    if (!core_1.Token.isUnresolved(nameToValidate) && nameToValidate.includes('/') && !nameToValidate.startsWith('/')) {
        throw new Error(`Parameter names must be fully qualified (if they include "/" they must also begin with a "/"): ${nameToValidate}`);
    }
    if (isSimpleName()) {
        return core_1.Stack.of(scope).formatArn({
            service: 'ssm',
            resource: 'parameter',
            arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
            resourceName: parameterName,
        });
    }
    else {
        return core_1.Stack.of(scope).formatArn({
            service: 'ssm',
            resource: `parameter${parameterName}`,
        });
    }
    /**
     * Determines the ARN separator for this parameter: if we have a concrete
     * parameter name (or explicitly defined physical name), we will parse them
     * and decide whether a "/" is needed or not. Otherwise, users will have to
     * explicitly specify `simpleName` when they import the ARN.
     */
    function isSimpleName() {
        // look for a concrete name as a hint for determining the separator
        const concreteName = !core_1.Token.isUnresolved(parameterName) ? parameterName : physicalName;
        if (!concreteName || core_1.Token.isUnresolved(concreteName)) {
            if (options.simpleName === undefined) {
                throw new Error('Unable to determine ARN separator for SSM parameter since the parameter name is an unresolved token. Use "fromAttributes" and specify "simpleName" explicitly');
            }
            return options.simpleName;
        }
        const result = !concreteName.startsWith('/');
        // if users explicitly specify the separator and it conflicts with the one we need, it's an error.
        if (options.simpleName !== undefined && options.simpleName !== result) {
            if (concreteName === exports.AUTOGEN_MARKER) {
                throw new Error('If "parameterName" is not explicitly defined, "simpleName" must be "true" or undefined since auto-generated parameter names always have simple names');
            }
            throw new Error(`Parameter name "${concreteName}" is ${result ? 'a simple name' : 'not a simple name'}, but "simpleName" was explicitly set to ${options.simpleName}. Either omit it or set it to ${result}`);
        }
        return result;
    }
}
exports.arnForParameterName = arnForParameterName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdEO0FBRzNDLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztBQU81Qzs7Ozs7R0FLRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLEtBQWlCLEVBQUUsYUFBcUIsRUFBRSxVQUFzQyxFQUFHO0lBQ3JILE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7SUFDMUMsTUFBTSxjQUFjLEdBQUcsWUFBWSxJQUFJLGFBQWEsQ0FBQztJQUVyRCxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxRyxNQUFNLElBQUksS0FBSyxDQUFDLGtHQUFrRyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0tBQ3JJO0lBRUQsSUFBSSxZQUFZLEVBQUUsRUFBRTtRQUNsQixPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQy9CLE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLFdBQVc7WUFDckIsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1lBQ3hDLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUMsQ0FBQztLQUNKO1NBQU07UUFDTCxPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQy9CLE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLFlBQVksYUFBYSxFQUFFO1NBQ3RDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLFlBQVk7UUFDbkIsbUVBQW1FO1FBQ25FLE1BQU0sWUFBWSxHQUFHLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDdkYsSUFBSSxDQUFDLFlBQVksSUFBSSxZQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBRXJELElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0pBQStKLENBQUMsQ0FBQzthQUNsTDtZQUVELE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUMzQjtRQUVELE1BQU0sTUFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU3QyxrR0FBa0c7UUFDbEcsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBRTtZQUVyRSxJQUFJLFlBQVksS0FBSyxzQkFBYyxFQUFFO2dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHNKQUFzSixDQUFDLENBQUM7YUFDeks7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixZQUFZLFFBQVEsTUFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLG1CQUFtQiw0Q0FBNEMsT0FBTyxDQUFDLFVBQVUsaUNBQWlDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDL007UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0FBQ0gsQ0FBQztBQXRERCxrREFzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgY29uc3QgQVVUT0dFTl9NQVJLRVIgPSAnJCRhdXRvZ2VuJCQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFybkZvclBhcmFtZXRlck5hbWVPcHRpb25zIHtcbiAgcmVhZG9ubHkgcGh5c2ljYWxOYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBzaW1wbGVOYW1lPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIGFuIEFSTiBmb3IgYW4gU1NNIHBhcmFtZXRlciBnaXZlbiBhIHBhcmFtZXRlciBuYW1lLlxuICogQHBhcmFtIHNjb3BlIGRlZmluaXRpb24gc2NvcGVcbiAqIEBwYXJhbSBwYXJhbWV0ZXJOYW1lIHRoZSBwYXJhbWV0ZXIgbmFtZSB0byBpbmNsdWRlIGluIHRoZSBBUk5cbiAqIEBwYXJhbSBwaHlzaWNhbE5hbWUgb3B0aW9uYWwgcGh5c2ljYWwgbmFtZSBzcGVjaWZpZWQgYnkgdGhlIHVzZXIgKHRvIGF1dG8tZGV0ZWN0IHNlcGFyYXRvcilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFybkZvclBhcmFtZXRlck5hbWUoc2NvcGU6IElDb25zdHJ1Y3QsIHBhcmFtZXRlck5hbWU6IHN0cmluZywgb3B0aW9uczogQXJuRm9yUGFyYW1ldGVyTmFtZU9wdGlvbnMgPSB7IH0pOiBzdHJpbmcge1xuICBjb25zdCBwaHlzaWNhbE5hbWUgPSBvcHRpb25zLnBoeXNpY2FsTmFtZTtcbiAgY29uc3QgbmFtZVRvVmFsaWRhdGUgPSBwaHlzaWNhbE5hbWUgfHwgcGFyYW1ldGVyTmFtZTtcblxuICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChuYW1lVG9WYWxpZGF0ZSkgJiYgbmFtZVRvVmFsaWRhdGUuaW5jbHVkZXMoJy8nKSAmJiAhbmFtZVRvVmFsaWRhdGUuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgbmFtZXMgbXVzdCBiZSBmdWxseSBxdWFsaWZpZWQgKGlmIHRoZXkgaW5jbHVkZSBcIi9cIiB0aGV5IG11c3QgYWxzbyBiZWdpbiB3aXRoIGEgXCIvXCIpOiAke25hbWVUb1ZhbGlkYXRlfWApO1xuICB9XG5cbiAgaWYgKGlzU2ltcGxlTmFtZSgpKSB7XG4gICAgcmV0dXJuIFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NzbScsXG4gICAgICByZXNvdXJjZTogJ3BhcmFtZXRlcicsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgcmVzb3VyY2VOYW1lOiBwYXJhbWV0ZXJOYW1lLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdzc20nLFxuICAgICAgcmVzb3VyY2U6IGBwYXJhbWV0ZXIke3BhcmFtZXRlck5hbWV9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBBUk4gc2VwYXJhdG9yIGZvciB0aGlzIHBhcmFtZXRlcjogaWYgd2UgaGF2ZSBhIGNvbmNyZXRlXG4gICAqIHBhcmFtZXRlciBuYW1lIChvciBleHBsaWNpdGx5IGRlZmluZWQgcGh5c2ljYWwgbmFtZSksIHdlIHdpbGwgcGFyc2UgdGhlbVxuICAgKiBhbmQgZGVjaWRlIHdoZXRoZXIgYSBcIi9cIiBpcyBuZWVkZWQgb3Igbm90LiBPdGhlcndpc2UsIHVzZXJzIHdpbGwgaGF2ZSB0b1xuICAgKiBleHBsaWNpdGx5IHNwZWNpZnkgYHNpbXBsZU5hbWVgIHdoZW4gdGhleSBpbXBvcnQgdGhlIEFSTi5cbiAgICovXG4gIGZ1bmN0aW9uIGlzU2ltcGxlTmFtZSgpOiBib29sZWFuIHtcbiAgICAvLyBsb29rIGZvciBhIGNvbmNyZXRlIG5hbWUgYXMgYSBoaW50IGZvciBkZXRlcm1pbmluZyB0aGUgc2VwYXJhdG9yXG4gICAgY29uc3QgY29uY3JldGVOYW1lID0gIVRva2VuLmlzVW5yZXNvbHZlZChwYXJhbWV0ZXJOYW1lKSA/IHBhcmFtZXRlck5hbWUgOiBwaHlzaWNhbE5hbWU7XG4gICAgaWYgKCFjb25jcmV0ZU5hbWUgfHwgVG9rZW4uaXNVbnJlc29sdmVkKGNvbmNyZXRlTmFtZSkpIHtcblxuICAgICAgaWYgKG9wdGlvbnMuc2ltcGxlTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBBUk4gc2VwYXJhdG9yIGZvciBTU00gcGFyYW1ldGVyIHNpbmNlIHRoZSBwYXJhbWV0ZXIgbmFtZSBpcyBhbiB1bnJlc29sdmVkIHRva2VuLiBVc2UgXCJmcm9tQXR0cmlidXRlc1wiIGFuZCBzcGVjaWZ5IFwic2ltcGxlTmFtZVwiIGV4cGxpY2l0bHknKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9wdGlvbnMuc2ltcGxlTmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSAhY29uY3JldGVOYW1lLnN0YXJ0c1dpdGgoJy8nKTtcblxuICAgIC8vIGlmIHVzZXJzIGV4cGxpY2l0bHkgc3BlY2lmeSB0aGUgc2VwYXJhdG9yIGFuZCBpdCBjb25mbGljdHMgd2l0aCB0aGUgb25lIHdlIG5lZWQsIGl0J3MgYW4gZXJyb3IuXG4gICAgaWYgKG9wdGlvbnMuc2ltcGxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2ltcGxlTmFtZSAhPT0gcmVzdWx0KSB7XG5cbiAgICAgIGlmIChjb25jcmV0ZU5hbWUgPT09IEFVVE9HRU5fTUFSS0VSKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSWYgXCJwYXJhbWV0ZXJOYW1lXCIgaXMgbm90IGV4cGxpY2l0bHkgZGVmaW5lZCwgXCJzaW1wbGVOYW1lXCIgbXVzdCBiZSBcInRydWVcIiBvciB1bmRlZmluZWQgc2luY2UgYXV0by1nZW5lcmF0ZWQgcGFyYW1ldGVyIG5hbWVzIGFsd2F5cyBoYXZlIHNpbXBsZSBuYW1lcycpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhcmFtZXRlciBuYW1lIFwiJHtjb25jcmV0ZU5hbWV9XCIgaXMgJHtyZXN1bHQgPyAnYSBzaW1wbGUgbmFtZScgOiAnbm90IGEgc2ltcGxlIG5hbWUnfSwgYnV0IFwic2ltcGxlTmFtZVwiIHdhcyBleHBsaWNpdGx5IHNldCB0byAke29wdGlvbnMuc2ltcGxlTmFtZX0uIEVpdGhlciBvbWl0IGl0IG9yIHNldCBpdCB0byAke3Jlc3VsdH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=