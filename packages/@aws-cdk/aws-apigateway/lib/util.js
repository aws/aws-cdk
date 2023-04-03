"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemaMapper = exports.validateDouble = exports.validateInteger = exports.parseAwsApiCall = exports.parseMethodOptionsPath = exports.validateHttpMethod = exports.ALL_METHODS = void 0;
const url_1 = require("url");
const jsonSchema = require("./json-schema");
exports.ALL_METHODS = ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD'];
const ALLOWED_METHODS = ['ANY', ...exports.ALL_METHODS];
function validateHttpMethod(method, messagePrefix = '') {
    if (!ALLOWED_METHODS.includes(method)) {
        throw new Error(`${messagePrefix}Invalid HTTP method "${method}". Allowed methods: ${ALLOWED_METHODS.join(',')}`);
    }
}
exports.validateHttpMethod = validateHttpMethod;
function parseMethodOptionsPath(originalPath) {
    if (!originalPath.startsWith('/')) {
        throw new Error(`Method options path must start with '/': ${originalPath}`);
    }
    const path = originalPath.slice(1); // trim trailing '/'
    const components = path.split('/');
    if (components.length < 2) {
        throw new Error(`Method options path must include at least two components: /{resource}/{method} (i.e. /foo/bar/GET): ${path}`);
    }
    const httpMethod = components.pop().toUpperCase(); // last component is an HTTP method
    if (httpMethod !== '*') {
        validateHttpMethod(httpMethod, `${originalPath}: `);
    }
    let resourcePath = '/~1' + components.join('~1');
    if (components.length === 1 && components[0] === '*') {
        resourcePath = '/*';
    }
    else if (components.length === 1 && components[0] === '') {
        resourcePath = '/';
    }
    return {
        httpMethod,
        resourcePath,
    };
}
exports.parseMethodOptionsPath = parseMethodOptionsPath;
function parseAwsApiCall(path, action, actionParams) {
    if (actionParams && !action) {
        throw new Error('"actionParams" requires that "action" will be set');
    }
    if (path && action) {
        throw new Error(`"path" and "action" are mutually exclusive (path="${path}", action="${action}")`);
    }
    if (path) {
        return {
            apiType: 'path',
            apiValue: path,
        };
    }
    if (action) {
        if (actionParams) {
            action += '&' + url_1.format({ query: actionParams }).slice(1);
        }
        return {
            apiType: 'action',
            apiValue: action,
        };
    }
    throw new Error('Either "path" or "action" are required');
}
exports.parseAwsApiCall = parseAwsApiCall;
function validateInteger(property, messagePrefix) {
    if (property && !Number.isInteger(property)) {
        throw new Error(`${messagePrefix} should be an integer`);
    }
}
exports.validateInteger = validateInteger;
function validateDouble(property, messagePrefix) {
    if (property && isNaN(property) && isNaN(parseFloat(property.toString()))) {
        throw new Error(`${messagePrefix} should be an double`);
    }
}
exports.validateDouble = validateDouble;
class JsonSchemaMapper {
    /**
     * Transforms naming of some properties to prefix with a $, where needed
     * according to the JSON schema spec
     * @param schema The JsonSchema object to transform for CloudFormation output
     */
    static toCfnJsonSchema(schema) {
        const result = JsonSchemaMapper._toCfnJsonSchema(schema);
        if (!('$schema' in result)) {
            result.$schema = jsonSchema.JsonSchemaVersion.DRAFT4;
        }
        return result;
    }
    static _toCfnJsonSchema(schema, preserveKeys = false) {
        if (schema == null || typeof schema !== 'object') {
            return schema;
        }
        if (Array.isArray(schema)) {
            return schema.map(entry => JsonSchemaMapper._toCfnJsonSchema(entry));
        }
        return Object.assign({}, ...Object.entries(schema).map(([key, value]) => {
            const mapKey = !preserveKeys && (key in JsonSchemaMapper.SchemaPropsWithPrefix);
            const newKey = mapKey ? JsonSchemaMapper.SchemaPropsWithPrefix[key] : key;
            // If keys were preserved, don't consider SchemaPropsWithUserDefinedChildren for those keys (they are user-defined!)
            const newValue = JsonSchemaMapper._toCfnJsonSchema(value, !preserveKeys && JsonSchemaMapper.SchemaPropsWithUserDefinedChildren[key]);
            return { [newKey]: newValue };
        }));
    }
}
exports.JsonSchemaMapper = JsonSchemaMapper;
JsonSchemaMapper.SchemaPropsWithPrefix = {
    schema: '$schema',
    ref: '$ref',
};
// The value indicates whether direct children should be key-mapped.
JsonSchemaMapper.SchemaPropsWithUserDefinedChildren = {
    definitions: true,
    properties: true,
    patternProperties: true,
    dependencies: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTBDO0FBQzFDLDRDQUE0QztBQUUvQixRQUFBLFdBQVcsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXhGLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsbUJBQVcsQ0FBQyxDQUFDO0FBRWhELFNBQWdCLGtCQUFrQixDQUFDLE1BQWMsRUFBRSxnQkFBd0IsRUFBRTtJQUMzRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsYUFBYSx3QkFBd0IsTUFBTSx1QkFBdUIsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbkg7QUFDSCxDQUFDO0FBSkQsZ0RBSUM7QUFFRCxTQUFnQixzQkFBc0IsQ0FBQyxZQUFvQjtJQUN6RCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQzdFO0lBRUQsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtJQUV4RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRW5DLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1R0FBdUcsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNoSTtJQUVELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVB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LFlBQVksRUFBRSxJQUFJO0NBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXQgYXMgZm9ybWF0VXJsIH0gZnJvbSAndXJsJztcbmltcG9ydCAqIGFzIGpzb25TY2hlbWEgZnJvbSAnLi9qc29uLXNjaGVtYSc7XG5cbmV4cG9ydCBjb25zdCBBTExfTUVUSE9EUyA9IFsnT1BUSU9OUycsICdHRVQnLCAnUFVUJywgJ1BPU1QnLCAnREVMRVRFJywgJ1BBVENIJywgJ0hFQUQnXTtcblxuY29uc3QgQUxMT1dFRF9NRVRIT0RTID0gWydBTlknLCAuLi5BTExfTUVUSE9EU107XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUh0dHBNZXRob2QobWV0aG9kOiBzdHJpbmcsIG1lc3NhZ2VQcmVmaXg6IHN0cmluZyA9ICcnKSB7XG4gIGlmICghQUxMT1dFRF9NRVRIT0RTLmluY2x1ZGVzKG1ldGhvZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZVByZWZpeH1JbnZhbGlkIEhUVFAgbWV0aG9kIFwiJHttZXRob2R9XCIuIEFsbG93ZWQgbWV0aG9kczogJHtBTExPV0VEX01FVEhPRFMuam9pbignLCcpfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKG9yaWdpbmFsUGF0aDogc3RyaW5nKTogeyByZXNvdXJjZVBhdGg6IHN0cmluZywgaHR0cE1ldGhvZDogc3RyaW5nIH0ge1xuICBpZiAoIW9yaWdpbmFsUGF0aC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1ldGhvZCBvcHRpb25zIHBhdGggbXVzdCBzdGFydCB3aXRoICcvJzogJHtvcmlnaW5hbFBhdGh9YCk7XG4gIH1cblxuICBjb25zdCBwYXRoID0gb3JpZ2luYWxQYXRoLnNsaWNlKDEpOyAvLyB0cmltIHRyYWlsaW5nICcvJ1xuXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG5cbiAgaWYgKGNvbXBvbmVudHMubGVuZ3RoIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihgTWV0aG9kIG9wdGlvbnMgcGF0aCBtdXN0IGluY2x1ZGUgYXQgbGVhc3QgdHdvIGNvbXBvbmVudHM6IC97cmVzb3VyY2V9L3ttZXRob2R9IChpLmUuIC9mb28vYmFyL0dFVCk6ICR7cGF0aH1gKTtcbiAgfVxuXG4gIGNvbnN0IGh0dHBNZXRob2QgPSBjb21wb25lbnRzLnBvcCgpIS50b1VwcGVyQ2FzZSgpOyAvLyBsYXN0IGNvbXBvbmVudCBpcyBhbiBIVFRQIG1ldGhvZFxuICBpZiAoaHR0cE1ldGhvZCAhPT0gJyonKSB7XG4gICAgdmFsaWRhdGVIdHRwTWV0aG9kKGh0dHBNZXRob2QsIGAke29yaWdpbmFsUGF0aH06IGApO1xuICB9XG5cbiAgbGV0IHJlc291cmNlUGF0aCA9ICcvfjEnICsgY29tcG9uZW50cy5qb2luKCd+MScpO1xuICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDEgJiYgY29tcG9uZW50c1swXSA9PT0gJyonKSB7XG4gICAgcmVzb3VyY2VQYXRoID0gJy8qJztcbiAgfSBlbHNlIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSAmJiBjb21wb25lbnRzWzBdID09PSAnJykge1xuICAgIHJlc291cmNlUGF0aCA9ICcvJztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaHR0cE1ldGhvZCxcbiAgICByZXNvdXJjZVBhdGgsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF3c0FwaUNhbGwocGF0aD86IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBhY3Rpb25QYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KTogeyBhcGlUeXBlOiBzdHJpbmcsIGFwaVZhbHVlOiBzdHJpbmcgfSB7XG4gIGlmIChhY3Rpb25QYXJhbXMgJiYgIWFjdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignXCJhY3Rpb25QYXJhbXNcIiByZXF1aXJlcyB0aGF0IFwiYWN0aW9uXCIgd2lsbCBiZSBzZXQnKTtcbiAgfVxuXG4gIGlmIChwYXRoICYmIGFjdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgXCJwYXRoXCIgYW5kIFwiYWN0aW9uXCIgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSAocGF0aD1cIiR7cGF0aH1cIiwgYWN0aW9uPVwiJHthY3Rpb259XCIpYCk7XG4gIH1cblxuICBpZiAocGF0aCkge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlUeXBlOiAncGF0aCcsXG4gICAgICBhcGlWYWx1ZTogcGF0aCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbikge1xuICAgIGlmIChhY3Rpb25QYXJhbXMpIHtcbiAgICAgIGFjdGlvbiArPSAnJicgKyBmb3JtYXRVcmwoeyBxdWVyeTogYWN0aW9uUGFyYW1zIH0pLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhcGlUeXBlOiAnYWN0aW9uJyxcbiAgICAgIGFwaVZhbHVlOiBhY3Rpb24sXG4gICAgfTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignRWl0aGVyIFwicGF0aFwiIG9yIFwiYWN0aW9uXCIgYXJlIHJlcXVpcmVkJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUludGVnZXIocHJvcGVydHk6IG51bWJlciB8IHVuZGVmaW5lZCwgbWVzc2FnZVByZWZpeDogc3RyaW5nKSB7XG4gIGlmIChwcm9wZXJ0eSAmJiAhTnVtYmVyLmlzSW50ZWdlcihwcm9wZXJ0eSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZVByZWZpeH0gc2hvdWxkIGJlIGFuIGludGVnZXJgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVEb3VibGUocHJvcGVydHk6IG51bWJlciB8IHVuZGVmaW5lZCwgbWVzc2FnZVByZWZpeDogc3RyaW5nKSB7XG4gIGlmIChwcm9wZXJ0eSAmJiBpc05hTihwcm9wZXJ0eSkgJiYgaXNOYU4ocGFyc2VGbG9hdChwcm9wZXJ0eS50b1N0cmluZygpKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZVByZWZpeH0gc2hvdWxkIGJlIGFuIGRvdWJsZWApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBKc29uU2NoZW1hTWFwcGVyIHtcbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgbmFtaW5nIG9mIHNvbWUgcHJvcGVydGllcyB0byBwcmVmaXggd2l0aCBhICQsIHdoZXJlIG5lZWRlZFxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIEpTT04gc2NoZW1hIHNwZWNcbiAgICogQHBhcmFtIHNjaGVtYSBUaGUgSnNvblNjaGVtYSBvYmplY3QgdG8gdHJhbnNmb3JtIGZvciBDbG91ZEZvcm1hdGlvbiBvdXRwdXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG9DZm5Kc29uU2NoZW1hKHNjaGVtYToganNvblNjaGVtYS5Kc29uU2NoZW1hKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSBKc29uU2NoZW1hTWFwcGVyLl90b0Nmbkpzb25TY2hlbWEoc2NoZW1hKTtcbiAgICBpZiAoISAoJyRzY2hlbWEnIGluIHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdC4kc2NoZW1hID0ganNvblNjaGVtYS5Kc29uU2NoZW1hVmVyc2lvbi5EUkFGVDQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTY2hlbWFQcm9wc1dpdGhQcmVmaXg6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgc2NoZW1hOiAnJHNjaGVtYScsXG4gICAgcmVmOiAnJHJlZicsXG4gIH07XG4gIC8vIFRoZSB2YWx1ZSBpbmRpY2F0ZXMgd2hldGhlciBkaXJlY3QgY2hpbGRyZW4gc2hvdWxkIGJlIGtleS1tYXBwZWQuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNjaGVtYVByb3BzV2l0aFVzZXJEZWZpbmVkQ2hpbGRyZW46IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge1xuICAgIGRlZmluaXRpb25zOiB0cnVlLFxuICAgIHByb3BlcnRpZXM6IHRydWUsXG4gICAgcGF0dGVyblByb3BlcnRpZXM6IHRydWUsXG4gICAgZGVwZW5kZW5jaWVzOiB0cnVlLFxuICB9O1xuXG4gIHByaXZhdGUgc3RhdGljIF90b0Nmbkpzb25TY2hlbWEoc2NoZW1hOiBhbnksIHByZXNlcnZlS2V5cyA9IGZhbHNlKTogYW55IHtcbiAgICBpZiAoc2NoZW1hID09IG51bGwgfHwgdHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBzY2hlbWE7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHNjaGVtYSkpIHtcbiAgICAgIHJldHVybiBzY2hlbWEubWFwKGVudHJ5ID0+IEpzb25TY2hlbWFNYXBwZXIuX3RvQ2ZuSnNvblNjaGVtYShlbnRyeSkpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgLi4uT2JqZWN0LmVudHJpZXMoc2NoZW1hKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgY29uc3QgbWFwS2V5ID0gIXByZXNlcnZlS2V5cyAmJiAoa2V5IGluIEpzb25TY2hlbWFNYXBwZXIuU2NoZW1hUHJvcHNXaXRoUHJlZml4KTtcbiAgICAgIGNvbnN0IG5ld0tleSA9IG1hcEtleSA/IEpzb25TY2hlbWFNYXBwZXIuU2NoZW1hUHJvcHNXaXRoUHJlZml4W2tleV0gOiBrZXk7XG4gICAgICAvLyBJZiBrZXlzIHdlcmUgcHJlc2VydmVkLCBkb24ndCBjb25zaWRlciBTY2hlbWFQcm9wc1dpdGhVc2VyRGVmaW5lZENoaWxkcmVuIGZvciB0aG9zZSBrZXlzICh0aGV5IGFyZSB1c2VyLWRlZmluZWQhKVxuICAgICAgY29uc3QgbmV3VmFsdWUgPSBKc29uU2NoZW1hTWFwcGVyLl90b0Nmbkpzb25TY2hlbWEodmFsdWUsICFwcmVzZXJ2ZUtleXMgJiYgSnNvblNjaGVtYU1hcHBlci5TY2hlbWFQcm9wc1dpdGhVc2VyRGVmaW5lZENoaWxkcmVuW2tleV0pO1xuICAgICAgcmV0dXJuIHsgW25ld0tleV06IG5ld1ZhbHVlIH07XG4gICAgfSkpO1xuICB9XG59XG4iXX0=