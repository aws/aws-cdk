"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceSdkv3Response = exports.flatten = exports.ApiCall = void 0;
const coerce_api_parameters_1 = require("./coerce-api-parameters");
const find_client_constructor_1 = require("./find-client-constructor");
const sdk_info_1 = require("./sdk-info");
/**
 * Wrapper to make an SDKv3 API call, with SDKv2 compatibility
 */
class ApiCall {
    constructor(service, action) {
        this.service = (0, sdk_info_1.normalizeServiceName)(service);
        this.action = (0, sdk_info_1.normalizeActionName)(this.service, action);
        this.v3PackageName = `@aws-sdk/client-${this.service}`;
    }
    async invoke(options) {
        this.initializePackage(options.sdkPackage);
        this.initializeClient(options);
        const Command = this.findCommandClass();
        // Command must pass input value https://github.com/aws/aws-sdk-js-v3/issues/424
        const response = await this.client.send(new Command((0, coerce_api_parameters_1.coerceApiParameters)(this.service, this.action, options.parameters ?? {})));
        delete response.$metadata;
        const coerced = await coerceSdkv3Response(response);
        return (options.flattenResponse ? flatten(coerced) : coerced);
    }
    initializePackage(packageOverride) {
        if (this.v3Package) {
            return;
        }
        if (packageOverride) {
            this.v3Package = packageOverride;
            return;
        }
        try {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */ // esbuild-disable unsupported-require-call
            this.v3Package = require(this.v3PackageName);
        }
        catch (e) {
            throw Error(`Service ${this.service} client package with name '${this.v3PackageName}' does not exist.`);
        }
    }
    initializeClient(options) {
        if (!this.v3Package) {
            this.initializePackage();
        }
        const ServiceClient = this.findConstructor(this.v3Package);
        this.client = new ServiceClient({
            apiVersion: options.apiVersion,
            credentials: options.credentials,
            region: options.region,
        });
        return this.client;
    }
    findCommandClass() {
        if (!this.v3Package) {
            this.initializePackage();
        }
        const commandName = `${this.action}Command`;
        const Command = Object.entries(this.v3Package ?? {}).find(([name]) => name.toLowerCase() === commandName.toLowerCase())?.[1];
        if (!Command) {
            throw new Error(`Unable to find command named: ${commandName} for action: ${this.action} in service package ${this.v3PackageName}`);
        }
        return Command;
    }
    findConstructor(pkg) {
        try {
            const ret = (0, find_client_constructor_1.findV3ClientConstructor)(pkg);
            if (!ret) {
                throw new Error('findV3ClientConstructor returned undefined');
            }
            return ret;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            throw Error(`No client constructor found within package: ${this.v3PackageName}`);
        }
    }
}
exports.ApiCall = ApiCall;
/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
function flatten(root) {
    const ret = {};
    recurse(root);
    return ret;
    function recurse(x, path = []) {
        if (x && typeof x === 'object') {
            for (const [key, value] of Object.entries(x)) {
                recurse(value, [...path, key]);
            }
            return;
        }
        ret[path.join('.')] = x;
    }
}
exports.flatten = flatten;
/**
 * Text decoder used for Uint8Array response parsing
 */
const decoder = new TextDecoder();
async function coerceSdkv3Response(value) {
    if (value && typeof (value) === 'object' && typeof (value.transformToString) === 'function') {
        // in sdk v3 some return types are now adapters that we need to explicitly
        // convert to strings. see example: https://github.com/aws/aws-sdk-js-v3/blob/main/UPGRADING.md?plain=1#L573-L576
        // note we don't use 'instanceof Unit8Array' because observations show this won't always return true, even though
        // the `transformToString` function will be available. (for example S3::GetObject)
        return value.transformToString();
    }
    if (Buffer.isBuffer(value)) {
        return value.toString('utf8');
    }
    if (ArrayBuffer.isView(value)) {
        return decoder.decode(value.buffer);
    }
    if (Array.isArray(value)) {
        const ret = [];
        for (const x of value) {
            ret.push(await coerceSdkv3Response(x));
        }
        return ret;
    }
    if (value && typeof value === 'object') {
        for (const key of Object.keys(value)) {
            value[key] = await coerceSdkv3Response(value[key]);
        }
        return value;
    }
    return value;
}
exports.coerceSdkv3Response = coerceSdkv3Response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNhbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktY2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtRUFBOEQ7QUFDOUQsdUVBQW9FO0FBQ3BFLHlDQUF1RTtBQWlEdkU7O0dBRUc7QUFDSCxNQUFhLE9BQU87SUFRbEIsWUFBWSxPQUFlLEVBQUUsTUFBYztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUEsK0JBQW9CLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDhCQUFtQixFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQXNCO1FBQ3hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhDLGdGQUFnRjtRQUNoRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNyQyxJQUFJLE9BQU8sQ0FBQyxJQUFBLDJDQUFtQixFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ3RGLENBQUM7UUFFRixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFFMUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRCxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFD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QUksQ0FBQyxNQUFNLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQ3RDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQyxLQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxtQkFBbUIsQ0FBRSxLQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0RTtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUEvQkQsa0RBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBd3NDcmVkZW50aWFsSWRlbnRpdHlQcm92aWRlciB9IGZyb20gJ0BzbWl0aHkvdHlwZXMnO1xuaW1wb3J0IHsgY29lcmNlQXBpUGFyYW1ldGVycyB9IGZyb20gJy4vY29lcmNlLWFwaS1wYXJhbWV0ZXJzJztcbmltcG9ydCB7IGZpbmRWM0NsaWVudENvbnN0cnVjdG9yIH0gZnJvbSAnLi9maW5kLWNsaWVudC1jb25zdHJ1Y3Rvcic7XG5pbXBvcnQgeyBub3JtYWxpemVBY3Rpb25OYW1lLCBub3JtYWxpemVTZXJ2aWNlTmFtZSB9IGZyb20gJy4vc2RrLWluZm8nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEludm9rZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIFNES3YzIHBhY2thZ2UgZm9yIHRoZSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIExvYWQgdGhlIHBhY2thZ2UgYXV0b21hdGljYWxseVxuICAgKi9cbiAgcmVhZG9ubHkgc2RrUGFja2FnZT86IGFueTtcblxuICAvKipcbiAgICogT3ZlcnJpZGUgQVBJIHZlcnNpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2UgZGVmYXVsdCBBUEkgdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgYXBpVmVyc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogT3ZlcnJpZGUgcmVnaW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ3VycmVudCByZWdpb25cbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogT3ZlcnJpZGUgY3JlZGVudGlhbHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0IGNyZWRlbnRpYWxzXG4gICAqL1xuICByZWFkb25seSBjcmVkZW50aWFscz86IEF3c0NyZWRlbnRpYWxJZGVudGl0eVByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBQYXJhbWV0ZXJzIHRvIHRoZSBBUEkgY2FsbFxuICAgKlxuICAgKiBAZGVmYXVsdCB7fVxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXG4gIC8qKlxuICAgKiBGbGF0dGVuIHRoZSByZXNwb25zZSBvYmplY3RcbiAgICpcbiAgICogSW5zdGVhZCBvZiBhIG5lc3RlZCBvYmplY3Qgc3RydWN0dXJlLCByZXR1cm4gYSBtYXAgb2YgYHsgc3RyaW5nIC0+IHZhbHVlIH1gLCB3aXRoIHRoZSBrZXlzXG4gICAqIGJlaW5nIHRoZSBwYXRocyB0byBlYWNoIHByaW1pdGl2ZSB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGZsYXR0ZW5SZXNwb25zZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogV3JhcHBlciB0byBtYWtlIGFuIFNES3YzIEFQSSBjYWxsLCB3aXRoIFNES3YyIGNvbXBhdGliaWxpdHlcbiAqL1xuZXhwb3J0IGNsYXNzIEFwaUNhbGwge1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB2M1BhY2thZ2VOYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIHYzUGFja2FnZT86IGFueTsgLy8gRm9yIHRlc3RpbmcgcHVycG9zZXNcbiAgcHVibGljIGNsaWVudD86IGFueTsgLy8gRm9yIHRlc3RpbmcgcHVycG9zZXNcblxuICBjb25zdHJ1Y3RvcihzZXJ2aWNlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXJ2aWNlID0gbm9ybWFsaXplU2VydmljZU5hbWUoc2VydmljZSk7XG4gICAgdGhpcy5hY3Rpb24gPSBub3JtYWxpemVBY3Rpb25OYW1lKHRoaXMuc2VydmljZSwgYWN0aW9uKTtcblxuICAgIHRoaXMudjNQYWNrYWdlTmFtZSA9IGBAYXdzLXNkay9jbGllbnQtJHt0aGlzLnNlcnZpY2V9YDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbnZva2Uob3B0aW9uczogSW52b2tlT3B0aW9ucyk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICB0aGlzLmluaXRpYWxpemVQYWNrYWdlKG9wdGlvbnMuc2RrUGFja2FnZSk7XG4gICAgdGhpcy5pbml0aWFsaXplQ2xpZW50KG9wdGlvbnMpO1xuXG4gICAgY29uc3QgQ29tbWFuZCA9IHRoaXMuZmluZENvbW1hbmRDbGFzcygpO1xuXG4gICAgLy8gQ29tbWFuZCBtdXN0IHBhc3MgaW5wdXQgdmFsdWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzLXYzL2lzc3Vlcy80MjRcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuY2xpZW50LnNlbmQoXG4gICAgICBuZXcgQ29tbWFuZChjb2VyY2VBcGlQYXJhbWV0ZXJzKHRoaXMuc2VydmljZSwgdGhpcy5hY3Rpb24sIG9wdGlvbnMucGFyYW1ldGVycyA/PyB7fSkpLFxuICAgICk7XG5cbiAgICBkZWxldGUgcmVzcG9uc2UuJG1ldGFkYXRhO1xuXG4gICAgY29uc3QgY29lcmNlZCA9IGF3YWl0IGNvZXJjZVNka3YzUmVzcG9uc2UocmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIChvcHRpb25zLmZsYXR0ZW5SZXNwb25zZSA/IGZsYXR0ZW4oY29lcmNlZCkgOiBjb2VyY2VkKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplUGFja2FnZShwYWNrYWdlT3ZlcnJpZGU/OiBhbnkpOiBhbnkge1xuICAgIGlmICh0aGlzLnYzUGFja2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYWNrYWdlT3ZlcnJpZGUpIHtcbiAgICAgIHRoaXMudjNQYWNrYWdlID0gcGFja2FnZU92ZXJyaWRlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cyAqLyAvLyBlc2J1aWxkLWRpc2FibGUgdW5zdXBwb3J0ZWQtcmVxdWlyZS1jYWxsXG4gICAgICB0aGlzLnYzUGFja2FnZSA9IHJlcXVpcmUodGhpcy52M1BhY2thZ2VOYW1lKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBFcnJvcihgU2VydmljZSAke3RoaXMuc2VydmljZX0gY2xpZW50IHBhY2thZ2Ugd2l0aCBuYW1lICcke3RoaXMudjNQYWNrYWdlTmFtZX0nIGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplQ2xpZW50KG9wdGlvbnM6IFBpY2s8SW52b2tlT3B0aW9ucywgJ2FwaVZlcnNpb24nIHwgJ2NyZWRlbnRpYWxzJyB8ICdyZWdpb24nPikge1xuICAgIGlmICghdGhpcy52M1BhY2thZ2UpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVBhY2thZ2UoKTtcbiAgICB9XG4gICAgY29uc3QgU2VydmljZUNsaWVudCA9IHRoaXMuZmluZENvbnN0cnVjdG9yKHRoaXMudjNQYWNrYWdlKTtcblxuICAgIHRoaXMuY2xpZW50ID0gbmV3IFNlcnZpY2VDbGllbnQoe1xuICAgICAgYXBpVmVyc2lvbjogb3B0aW9ucy5hcGlWZXJzaW9uLFxuICAgICAgY3JlZGVudGlhbHM6IG9wdGlvbnMuY3JlZGVudGlhbHMsXG4gICAgICByZWdpb246IG9wdGlvbnMucmVnaW9uLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kQ29tbWFuZENsYXNzKCkge1xuICAgIGlmICghdGhpcy52M1BhY2thZ2UpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVBhY2thZ2UoKTtcbiAgICB9XG4gICAgY29uc3QgY29tbWFuZE5hbWUgPSBgJHt0aGlzLmFjdGlvbn1Db21tYW5kYDtcbiAgICBjb25zdCBDb21tYW5kID0gT2JqZWN0LmVudHJpZXModGhpcy52M1BhY2thZ2UgPz8ge30pLmZpbmQoXG4gICAgICAoW25hbWVdKSA9PiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGNvbW1hbmROYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgKT8uWzFdIGFzIHsgbmV3IChpbnB1dDogYW55KTogYW55IH07XG4gICAgaWYgKCFDb21tYW5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGNvbW1hbmQgbmFtZWQ6ICR7Y29tbWFuZE5hbWV9IGZvciBhY3Rpb246ICR7dGhpcy5hY3Rpb259IGluIHNlcnZpY2UgcGFja2FnZSAke3RoaXMudjNQYWNrYWdlTmFtZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIENvbW1hbmQ7XG4gIH1cblxuICBwcml2YXRlIGZpbmRDb25zdHJ1Y3Rvcihwa2c6IE9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXQgPSBmaW5kVjNDbGllbnRDb25zdHJ1Y3Rvcihwa2cpO1xuICAgICAgaWYgKCFyZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaW5kVjNDbGllbnRDb25zdHJ1Y3RvciByZXR1cm5lZCB1bmRlZmluZWQnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB0aHJvdyBFcnJvcihgTm8gY2xpZW50IGNvbnN0cnVjdG9yIGZvdW5kIHdpdGhpbiBwYWNrYWdlOiAke3RoaXMudjNQYWNrYWdlTmFtZX1gKTtcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEZsYXR0ZW5zIGEgbmVzdGVkIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBiZSBmbGF0dGVuZWRcbiAqIEByZXR1cm5zIGEgZmxhdCBvYmplY3Qgd2l0aCBwYXRoIGFzIGtleXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4ocm9vdDogdW5rbm93bik6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICBjb25zdCByZXQ6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgcmVjdXJzZShyb290KTtcbiAgcmV0dXJuIHJldDtcblxuICBmdW5jdGlvbiByZWN1cnNlKHg6IHVua25vd24sIHBhdGg6IHN0cmluZ1tdID0gW10pOiBhbnkge1xuICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeCkpIHtcbiAgICAgICAgcmVjdXJzZSh2YWx1ZSwgWy4uLnBhdGgsIGtleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldFtwYXRoLmpvaW4oJy4nKV0gPSB4O1xuICB9XG59XG5cbi8qKlxuICogVGV4dCBkZWNvZGVyIHVzZWQgZm9yIFVpbnQ4QXJyYXkgcmVzcG9uc2UgcGFyc2luZ1xuICovXG5jb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb2VyY2VTZGt2M1Jlc3BvbnNlKHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx1bmtub3duPiB7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YodmFsdWUpID09PSAnb2JqZWN0JyAmJiB0eXBlb2YoKHZhbHVlIGFzIGFueSkudHJhbnNmb3JtVG9TdHJpbmcpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gaW4gc2RrIHYzIHNvbWUgcmV0dXJuIHR5cGVzIGFyZSBub3cgYWRhcHRlcnMgdGhhdCB3ZSBuZWVkIHRvIGV4cGxpY2l0bHlcbiAgICAvLyBjb252ZXJ0IHRvIHN0cmluZ3MuIHNlZSBleGFtcGxlOiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvYmxvYi9tYWluL1VQR1JBRElORy5tZD9wbGFpbj0xI0w1NzMtTDU3NlxuICAgIC8vIG5vdGUgd2UgZG9uJ3QgdXNlICdpbnN0YW5jZW9mIFVuaXQ4QXJyYXknIGJlY2F1c2Ugb2JzZXJ2YXRpb25zIHNob3cgdGhpcyB3b24ndCBhbHdheXMgcmV0dXJuIHRydWUsIGV2ZW4gdGhvdWdoXG4gICAgLy8gdGhlIGB0cmFuc2Zvcm1Ub1N0cmluZ2AgZnVuY3Rpb24gd2lsbCBiZSBhdmFpbGFibGUuIChmb3IgZXhhbXBsZSBTMzo6R2V0T2JqZWN0KVxuICAgIHJldHVybiAodmFsdWUgYXMgYW55KS50cmFuc2Zvcm1Ub1N0cmluZygpO1xuICB9XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZGVjb2Rlci5kZWNvZGUodmFsdWUuYnVmZmVyKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGZvciAoY29uc3QgeCBvZiB2YWx1ZSkge1xuICAgICAgcmV0LnB1c2goYXdhaXQgY29lcmNlU2RrdjNSZXNwb25zZSh4KSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuICAgICAgKHZhbHVlIGFzIGFueSlba2V5XSA9IGF3YWl0IGNvZXJjZVNka3YzUmVzcG9uc2UoKHZhbHVlIGFzIGFueSlba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cbiJdfQ==