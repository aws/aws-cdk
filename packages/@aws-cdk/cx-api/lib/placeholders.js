"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentPlaceholders = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Placeholders which can be used manifests
 *
 * These can occur both in the Asset Manifest as well as the general
 * Cloud Assembly manifest.
 */
class EnvironmentPlaceholders {
    /**
     * Replace the environment placeholders in all strings found in a complex object.
     *
     * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
     * (they're nominally independent tools).
     */
    static replace(object, values) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_EnvironmentPlaceholderValues(values);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.replace);
            }
            throw error;
        }
        return this.recurse(object, value => {
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_REGION, values.region);
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_ACCOUNT, values.accountId);
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_PARTITION, values.partition);
            return value;
        });
    }
    /**
     * Like 'replace', but asynchronous
     */
    static async replaceAsync(object, provider) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_IEnvironmentPlaceholderProvider(provider);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.replaceAsync);
            }
            throw error;
        }
        let needRegion = false;
        let needAccountId = false;
        let needPartition = false;
        this.recurse(object, value => {
            if (value.indexOf(EnvironmentPlaceholders.CURRENT_REGION) > 1) {
                needRegion = true;
            }
            if (value.indexOf(EnvironmentPlaceholders.CURRENT_ACCOUNT) > 1) {
                needAccountId = true;
            }
            if (value.indexOf(EnvironmentPlaceholders.CURRENT_PARTITION) > 1) {
                needPartition = true;
            }
            return value;
        });
        const region = needRegion ? await provider.region() : undefined;
        const accountId = needAccountId ? await provider.accountId() : undefined;
        const partition = needPartition ? await provider.partition() : undefined;
        return this.recurse(object, value => {
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_REGION, region ?? 'WONTHAPPEN');
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_ACCOUNT, accountId ?? 'WONTHAPPEN');
            value = replaceAll(value, EnvironmentPlaceholders.CURRENT_PARTITION, partition ?? 'WONTHAPPEN');
            return value;
        });
    }
    static recurse(value, cb) {
        if (typeof value === 'string') {
            return cb(value);
        }
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(x => this.recurse(x, cb));
        }
        const ret = {};
        for (const [key, inner] of Object.entries(value)) {
            ret[key] = this.recurse(inner, cb);
        }
        return ret;
    }
}
_a = JSII_RTTI_SYMBOL_1;
EnvironmentPlaceholders[_a] = { fqn: "@aws-cdk/cx-api.EnvironmentPlaceholders", version: "0.0.0" };
/**
 * Insert this into the destination fields to be replaced with the current region
 */
EnvironmentPlaceholders.CURRENT_REGION = '${AWS::Region}';
/**
 * Insert this into the destination fields to be replaced with the current account
 */
EnvironmentPlaceholders.CURRENT_ACCOUNT = '${AWS::AccountId}';
/**
 * Insert this into the destination fields to be replaced with the current partition
 */
EnvironmentPlaceholders.CURRENT_PARTITION = '${AWS::Partition}';
exports.EnvironmentPlaceholders = EnvironmentPlaceholders;
/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s, search, replace) {
    return s.split(search).join(replace);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxhY2Vob2xkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7OztHQUtHO0FBQ0gsTUFBYSx1QkFBdUI7SUFnQmxDOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFXLEVBQUUsTUFBb0M7Ozs7Ozs7Ozs7UUFDckUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNsQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pGLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLHVCQUF1QixDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckYsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBVyxFQUFFLFFBQXlDOzs7Ozs7Ozs7O1FBQ3JGLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTFCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzNCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQUUsVUFBVSxHQUFHLElBQUksQ0FBQzthQUFFO1lBQ3JGLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQUUsYUFBYSxHQUFHLElBQUksQ0FBQzthQUFFO1lBQ3pGLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFBRSxhQUFhLEdBQUcsSUFBSSxDQUFDO2FBQUU7WUFDM0YsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoRSxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDekUsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXpFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDbEMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsY0FBYyxFQUFFLE1BQU0sSUFBSSxZQUFZLENBQUMsQ0FBQztZQUMxRixLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxlQUFlLEVBQUUsU0FBUyxJQUFJLFlBQVksQ0FBQyxDQUFDO1lBQzlGLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLHVCQUF1QixDQUFDLGlCQUFpQixFQUFFLFNBQVMsSUFBSSxZQUFZLENBQUMsQ0FBQztZQUNoRyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQVUsRUFBRSxFQUF5QjtRQUMxRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDcEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUU7UUFDbEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUFFO1FBRXpFLE1BQU0sR0FBRyxHQUF3QixFQUFFLENBQUM7UUFDcEMsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDWjs7OztBQW5FRDs7R0FFRztBQUNvQixzQ0FBYyxHQUFHLGdCQUFnQixDQUFDO0FBRXpEOztHQUVHO0FBQ29CLHVDQUFlLEdBQUcsbUJBQW1CLENBQUM7QUFFN0Q7O0dBRUc7QUFDb0IseUNBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFkcEQsMERBQXVCO0FBK0dwQzs7R0FFRztBQUNILFNBQVMsVUFBVSxDQUFDLENBQVMsRUFBRSxNQUFjLEVBQUUsT0FBZTtJQUM1RCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBsYWNlaG9sZGVycyB3aGljaCBjYW4gYmUgdXNlZCBtYW5pZmVzdHNcbiAqXG4gKiBUaGVzZSBjYW4gb2NjdXIgYm90aCBpbiB0aGUgQXNzZXQgTWFuaWZlc3QgYXMgd2VsbCBhcyB0aGUgZ2VuZXJhbFxuICogQ2xvdWQgQXNzZW1ibHkgbWFuaWZlc3QuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudFBsYWNlaG9sZGVycyB7XG4gIC8qKlxuICAgKiBJbnNlcnQgdGhpcyBpbnRvIHRoZSBkZXN0aW5hdGlvbiBmaWVsZHMgdG8gYmUgcmVwbGFjZWQgd2l0aCB0aGUgY3VycmVudCByZWdpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1VSUkVOVF9SRUdJT04gPSAnJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBJbnNlcnQgdGhpcyBpbnRvIHRoZSBkZXN0aW5hdGlvbiBmaWVsZHMgdG8gYmUgcmVwbGFjZWQgd2l0aCB0aGUgY3VycmVudCBhY2NvdW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENVUlJFTlRfQUNDT1VOVCA9ICcke0FXUzo6QWNjb3VudElkfSc7XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGlzIGludG8gdGhlIGRlc3RpbmF0aW9uIGZpZWxkcyB0byBiZSByZXBsYWNlZCB3aXRoIHRoZSBjdXJyZW50IHBhcnRpdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDVVJSRU5UX1BBUlRJVElPTiA9ICcke0FXUzo6UGFydGl0aW9ufSc7XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGVudmlyb25tZW50IHBsYWNlaG9sZGVycyBpbiBhbGwgc3RyaW5ncyBmb3VuZCBpbiBhIGNvbXBsZXggb2JqZWN0LlxuICAgKlxuICAgKiBEdXBsaWNhdGVkIGJldHdlZW4gY2RrLWFzc2V0cyBhbmQgYXdzLWNkayBDTEkgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGEgZ29vZCBzaW5nbGUgcGxhY2UgdG8gcHV0IGl0XG4gICAqICh0aGV5J3JlIG5vbWluYWxseSBpbmRlcGVuZGVudCB0b29scykuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlcGxhY2Uob2JqZWN0OiBhbnksIHZhbHVlczogRW52aXJvbm1lbnRQbGFjZWhvbGRlclZhbHVlcyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVjdXJzZShvYmplY3QsIHZhbHVlID0+IHtcbiAgICAgIHZhbHVlID0gcmVwbGFjZUFsbCh2YWx1ZSwgRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9SRUdJT04sIHZhbHVlcy5yZWdpb24pO1xuICAgICAgdmFsdWUgPSByZXBsYWNlQWxsKHZhbHVlLCBFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX0FDQ09VTlQsIHZhbHVlcy5hY2NvdW50SWQpO1xuICAgICAgdmFsdWUgPSByZXBsYWNlQWxsKHZhbHVlLCBFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX1BBUlRJVElPTiwgdmFsdWVzLnBhcnRpdGlvbik7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSAncmVwbGFjZScsIGJ1dCBhc3luY2hyb25vdXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVwbGFjZUFzeW5jKG9iamVjdDogYW55LCBwcm92aWRlcjogSUVudmlyb25tZW50UGxhY2Vob2xkZXJQcm92aWRlcik6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IG5lZWRSZWdpb24gPSBmYWxzZTtcbiAgICBsZXQgbmVlZEFjY291bnRJZCA9IGZhbHNlO1xuICAgIGxldCBuZWVkUGFydGl0aW9uID0gZmFsc2U7XG5cbiAgICB0aGlzLnJlY3Vyc2Uob2JqZWN0LCB2YWx1ZSA9PiB7XG4gICAgICBpZiAodmFsdWUuaW5kZXhPZihFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX1JFR0lPTikgPiAxKSB7IG5lZWRSZWdpb24gPSB0cnVlOyB9XG4gICAgICBpZiAodmFsdWUuaW5kZXhPZihFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX0FDQ09VTlQpID4gMSkgeyBuZWVkQWNjb3VudElkID0gdHJ1ZTsgfVxuICAgICAgaWYgKHZhbHVlLmluZGV4T2YoRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9QQVJUSVRJT04pID4gMSkgeyBuZWVkUGFydGl0aW9uID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVnaW9uID0gbmVlZFJlZ2lvbiA/IGF3YWl0IHByb3ZpZGVyLnJlZ2lvbigpIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGFjY291bnRJZCA9IG5lZWRBY2NvdW50SWQgPyBhd2FpdCBwcm92aWRlci5hY2NvdW50SWQoKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0aXRpb24gPSBuZWVkUGFydGl0aW9uID8gYXdhaXQgcHJvdmlkZXIucGFydGl0aW9uKCkgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN1cnNlKG9iamVjdCwgdmFsdWUgPT4ge1xuICAgICAgdmFsdWUgPSByZXBsYWNlQWxsKHZhbHVlLCBFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX1JFR0lPTiwgcmVnaW9uID8/ICdXT05USEFQUEVOJyk7XG4gICAgICB2YWx1ZSA9IHJlcGxhY2VBbGwodmFsdWUsIEVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfQUNDT1VOVCwgYWNjb3VudElkID8/ICdXT05USEFQUEVOJyk7XG4gICAgICB2YWx1ZSA9IHJlcGxhY2VBbGwodmFsdWUsIEVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfUEFSVElUSU9OLCBwYXJ0aXRpb24gPz8gJ1dPTlRIQVBQRU4nKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHJlY3Vyc2UodmFsdWU6IGFueSwgY2I6ICh4OiBzdHJpbmcpID0+IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIGNiKHZhbHVlKTsgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgeyByZXR1cm4gdmFsdWUubWFwKHggPT4gdGhpcy5yZWN1cnNlKHgsIGNiKSk7IH1cblxuICAgIGNvbnN0IHJldDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgaW5uZXJdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgcmV0W2tleV0gPSB0aGlzLnJlY3Vyc2UoaW5uZXIsIGNiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzIGZvciB0aGUgZW52aXJvbm1lbnQgcGxhY2Vob2xkZXJzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnRQbGFjZWhvbGRlclZhbHVlcyB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlZ2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYWNjb3VudFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcGFydGl0aW9uXG4gICAqL1xuICByZWFkb25seSBwYXJ0aXRpb246IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGFwcHJvcHJpYXRlIHZhbHVlcyBmb3IgdGhlIGVudmlyb25tZW50IHBsYWNlaG9sZGVyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBsYWNlaG9sZGVyUHJvdmlkZXIge1xuICAvKipcbiAgICogUmV0dXJuIHRoZSByZWdpb25cbiAgICovXG4gIHJlZ2lvbigpOiBQcm9taXNlPHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYWNjb3VudFxuICAgKi9cbiAgYWNjb3VudElkKCk6IFByb21pc2U8c3RyaW5nPjtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBwYXJ0aXRpb25cbiAgICovXG4gIHBhcnRpdGlvbigpOiBQcm9taXNlPHN0cmluZz47XG59XG5cbi8qKlxuICogQSBcInJlcGxhY2UtYWxsXCIgZnVuY3Rpb24gdGhhdCBkb2Vzbid0IHJlcXVpcmUgdXMgZXNjYXBpbmcgYSBsaXRlcmFsIHN0cmluZyB0byBhIHJlZ2V4XG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VBbGwoczogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKSB7XG4gIHJldHVybiBzLnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlKTtcbn1cbiJdfQ==