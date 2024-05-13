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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNhbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktY2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtRUFBOEQ7QUFDOUQsdUVBQW9FO0FBQ3BFLHlDQUF1RTtBQWlEdkU7O0dBRUc7QUFDSCxNQUFhLE9BQU87SUFRbEIsWUFBWSxPQUFlLEVBQUUsTUFBYztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUEsK0JBQW9CLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDhCQUFtQixFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQXNCO1FBQ3hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhDLGdGQUFnRjtRQUNoRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNyQyxJQUFJLE9BQU8sQ0FBQyxJQUFBLDJDQUFtQixFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ3RGLENBQUM7UUFFRixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFFMUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRCxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFD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Q0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN6QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixLQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUN2QyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNwQyxLQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxtQkFBbUIsQ0FBRSxLQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBL0JELGtEQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXdzQ3JlZGVudGlhbElkZW50aXR5UHJvdmlkZXIgfSBmcm9tICdAc21pdGh5L3R5cGVzJztcbmltcG9ydCB7IGNvZXJjZUFwaVBhcmFtZXRlcnMgfSBmcm9tICcuL2NvZXJjZS1hcGktcGFyYW1ldGVycyc7XG5pbXBvcnQgeyBmaW5kVjNDbGllbnRDb25zdHJ1Y3RvciB9IGZyb20gJy4vZmluZC1jbGllbnQtY29uc3RydWN0b3InO1xuaW1wb3J0IHsgbm9ybWFsaXplQWN0aW9uTmFtZSwgbm9ybWFsaXplU2VydmljZU5hbWUgfSBmcm9tICcuL3Nkay1pbmZvJztcblxuZXhwb3J0IGludGVyZmFjZSBJbnZva2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBTREt2MyBwYWNrYWdlIGZvciB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBMb2FkIHRoZSBwYWNrYWdlIGF1dG9tYXRpY2FsbHlcbiAgICovXG4gIHJlYWRvbmx5IHNka1BhY2thZ2U/OiBhbnk7XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIEFQSSB2ZXJzaW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlIGRlZmF1bHQgQVBJIHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IGFwaVZlcnNpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHJlZ2lvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEN1cnJlbnQgcmVnaW9uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGNyZWRlbnRpYWxzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBjcmVkZW50aWFsc1xuICAgKi9cbiAgcmVhZG9ubHkgY3JlZGVudGlhbHM/OiBBd3NDcmVkZW50aWFsSWRlbnRpdHlQcm92aWRlcjtcblxuICAvKipcbiAgICogUGFyYW1ldGVycyB0byB0aGUgQVBJIGNhbGxcbiAgICpcbiAgICogQGRlZmF1bHQge31cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxuICAvKipcbiAgICogRmxhdHRlbiB0aGUgcmVzcG9uc2Ugb2JqZWN0XG4gICAqXG4gICAqIEluc3RlYWQgb2YgYSBuZXN0ZWQgb2JqZWN0IHN0cnVjdHVyZSwgcmV0dXJuIGEgbWFwIG9mIGB7IHN0cmluZyAtPiB2YWx1ZSB9YCwgd2l0aCB0aGUga2V5c1xuICAgKiBiZWluZyB0aGUgcGF0aHMgdG8gZWFjaCBwcmltaXRpdmUgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBmbGF0dGVuUmVzcG9uc2U/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgdG8gbWFrZSBhbiBTREt2MyBBUEkgY2FsbCwgd2l0aCBTREt2MiBjb21wYXRpYmlsaXR5XG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlDYWxsIHtcbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGFjdGlvbjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdjNQYWNrYWdlTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyB2M1BhY2thZ2U/OiBhbnk7IC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gIHB1YmxpYyBjbGllbnQ/OiBhbnk7IC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzXG5cbiAgY29uc3RydWN0b3Ioc2VydmljZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZykge1xuICAgIHRoaXMuc2VydmljZSA9IG5vcm1hbGl6ZVNlcnZpY2VOYW1lKHNlcnZpY2UpO1xuICAgIHRoaXMuYWN0aW9uID0gbm9ybWFsaXplQWN0aW9uTmFtZSh0aGlzLnNlcnZpY2UsIGFjdGlvbik7XG5cbiAgICB0aGlzLnYzUGFja2FnZU5hbWUgPSBgQGF3cy1zZGsvY2xpZW50LSR7dGhpcy5zZXJ2aWNlfWA7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW52b2tlKG9wdGlvbnM6IEludm9rZU9wdGlvbnMpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB7XG4gICAgdGhpcy5pbml0aWFsaXplUGFja2FnZShvcHRpb25zLnNka1BhY2thZ2UpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNsaWVudChvcHRpb25zKTtcblxuICAgIGNvbnN0IENvbW1hbmQgPSB0aGlzLmZpbmRDb21tYW5kQ2xhc3MoKTtcblxuICAgIC8vIENvbW1hbmQgbXVzdCBwYXNzIGlucHV0IHZhbHVlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy12My9pc3N1ZXMvNDI0XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKFxuICAgICAgbmV3IENvbW1hbmQoY29lcmNlQXBpUGFyYW1ldGVycyh0aGlzLnNlcnZpY2UsIHRoaXMuYWN0aW9uLCBvcHRpb25zLnBhcmFtZXRlcnMgPz8ge30pKSxcbiAgICApO1xuXG4gICAgZGVsZXRlIHJlc3BvbnNlLiRtZXRhZGF0YTtcblxuICAgIGNvbnN0IGNvZXJjZWQgPSBhd2FpdCBjb2VyY2VTZGt2M1Jlc3BvbnNlKHJlc3BvbnNlKTtcblxuICAgIHJldHVybiAob3B0aW9ucy5mbGF0dGVuUmVzcG9uc2UgPyBmbGF0dGVuKGNvZXJjZWQpIDogY29lcmNlZCkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZVBhY2thZ2UocGFja2FnZU92ZXJyaWRlPzogYW55KTogYW55IHtcbiAgICBpZiAodGhpcy52M1BhY2thZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFja2FnZU92ZXJyaWRlKSB7XG4gICAgICB0aGlzLnYzUGFja2FnZSA9IHBhY2thZ2VPdmVycmlkZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMgKi8gLy8gZXNidWlsZC1kaXNhYmxlIHVuc3VwcG9ydGVkLXJlcXVpcmUtY2FsbFxuICAgICAgdGhpcy52M1BhY2thZ2UgPSByZXF1aXJlKHRoaXMudjNQYWNrYWdlTmFtZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHt0aGlzLnNlcnZpY2V9IGNsaWVudCBwYWNrYWdlIHdpdGggbmFtZSAnJHt0aGlzLnYzUGFja2FnZU5hbWV9JyBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZUNsaWVudChvcHRpb25zOiBQaWNrPEludm9rZU9wdGlvbnMsICdhcGlWZXJzaW9uJyB8ICdjcmVkZW50aWFscycgfCAncmVnaW9uJz4pIHtcbiAgICBpZiAoIXRoaXMudjNQYWNrYWdlKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVQYWNrYWdlKCk7XG4gICAgfVxuICAgIGNvbnN0IFNlcnZpY2VDbGllbnQgPSB0aGlzLmZpbmRDb25zdHJ1Y3Rvcih0aGlzLnYzUGFja2FnZSk7XG5cbiAgICB0aGlzLmNsaWVudCA9IG5ldyBTZXJ2aWNlQ2xpZW50KHtcbiAgICAgIGFwaVZlcnNpb246IG9wdGlvbnMuYXBpVmVyc2lvbixcbiAgICAgIGNyZWRlbnRpYWxzOiBvcHRpb25zLmNyZWRlbnRpYWxzLFxuICAgICAgcmVnaW9uOiBvcHRpb25zLnJlZ2lvbixcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbGllbnQ7XG4gIH1cblxuICBwdWJsaWMgZmluZENvbW1hbmRDbGFzcygpIHtcbiAgICBpZiAoIXRoaXMudjNQYWNrYWdlKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVQYWNrYWdlKCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbW1hbmROYW1lID0gYCR7dGhpcy5hY3Rpb259Q29tbWFuZGA7XG4gICAgY29uc3QgQ29tbWFuZCA9IE9iamVjdC5lbnRyaWVzKHRoaXMudjNQYWNrYWdlID8/IHt9KS5maW5kKFxuICAgICAgKFtuYW1lXSkgPT4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSBjb21tYW5kTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICk/LlsxXSBhcyB7IG5ldyAoaW5wdXQ6IGFueSk6IGFueSB9O1xuICAgIGlmICghQ29tbWFuZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBjb21tYW5kIG5hbWVkOiAke2NvbW1hbmROYW1lfSBmb3IgYWN0aW9uOiAke3RoaXMuYWN0aW9ufSBpbiBzZXJ2aWNlIHBhY2thZ2UgJHt0aGlzLnYzUGFja2FnZU5hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiBDb21tYW5kO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ29uc3RydWN0b3IocGtnOiBPYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0gZmluZFYzQ2xpZW50Q29uc3RydWN0b3IocGtnKTtcbiAgICAgIGlmICghcmV0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZmluZFYzQ2xpZW50Q29uc3RydWN0b3IgcmV0dXJuZWQgdW5kZWZpbmVkJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgdGhyb3cgRXJyb3IoYE5vIGNsaWVudCBjb25zdHJ1Y3RvciBmb3VuZCB3aXRoaW4gcGFja2FnZTogJHt0aGlzLnYzUGFja2FnZU5hbWV9YCk7XG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBGbGF0dGVucyBhIG5lc3RlZCBvYmplY3RcbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHRoZSBvYmplY3QgdG8gYmUgZmxhdHRlbmVkXG4gKiBAcmV0dXJucyBhIGZsYXQgb2JqZWN0IHdpdGggcGF0aCBhcyBrZXlzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKHJvb3Q6IHVua25vd24pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgY29uc3QgcmV0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gIHJlY3Vyc2Uocm9vdCk7XG4gIHJldHVybiByZXQ7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZSh4OiB1bmtub3duLCBwYXRoOiBzdHJpbmdbXSA9IFtdKTogYW55IHtcbiAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHgpKSB7XG4gICAgICAgIHJlY3Vyc2UodmFsdWUsIFsuLi5wYXRoLCBrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXRbcGF0aC5qb2luKCcuJyldID0geDtcbiAgfVxufVxuXG4vKipcbiAqIFRleHQgZGVjb2RlciB1c2VkIGZvciBVaW50OEFycmF5IHJlc3BvbnNlIHBhcnNpbmdcbiAqL1xuY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29lcmNlU2RrdjNSZXNwb25zZSh2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dW5rbm93bj4ge1xuICBpZiAodmFsdWUgJiYgdHlwZW9mKHZhbHVlKSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mKCh2YWx1ZSBhcyBhbnkpLnRyYW5zZm9ybVRvU3RyaW5nKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIGluIHNkayB2MyBzb21lIHJldHVybiB0eXBlcyBhcmUgbm93IGFkYXB0ZXJzIHRoYXQgd2UgbmVlZCB0byBleHBsaWNpdGx5XG4gICAgLy8gY29udmVydCB0byBzdHJpbmdzLiBzZWUgZXhhbXBsZTogaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzLXYzL2Jsb2IvbWFpbi9VUEdSQURJTkcubWQ/cGxhaW49MSNMNTczLUw1NzZcbiAgICAvLyBub3RlIHdlIGRvbid0IHVzZSAnaW5zdGFuY2VvZiBVbml0OEFycmF5JyBiZWNhdXNlIG9ic2VydmF0aW9ucyBzaG93IHRoaXMgd29uJ3QgYWx3YXlzIHJldHVybiB0cnVlLCBldmVuIHRob3VnaFxuICAgIC8vIHRoZSBgdHJhbnNmb3JtVG9TdHJpbmdgIGZ1bmN0aW9uIHdpbGwgYmUgYXZhaWxhYmxlLiAoZm9yIGV4YW1wbGUgUzM6OkdldE9iamVjdClcbiAgICByZXR1cm4gKHZhbHVlIGFzIGFueSkudHJhbnNmb3JtVG9TdHJpbmcoKTtcbiAgfVxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygndXRmOCcpO1xuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGRlY29kZXIuZGVjb2RlKHZhbHVlLmJ1ZmZlcik7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHggb2YgdmFsdWUpIHtcbiAgICAgIHJldC5wdXNoKGF3YWl0IGNvZXJjZVNka3YzUmVzcG9uc2UoeCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh2YWx1ZSkpIHtcbiAgICAgICh2YWx1ZSBhcyBhbnkpW2tleV0gPSBhd2FpdCBjb2VyY2VTZGt2M1Jlc3BvbnNlKCh2YWx1ZSBhcyBhbnkpW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG4iXX0=