"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnMapping = void 0;
const annotations_1 = require("./annotations");
const cfn_element_1 = require("./cfn-element");
const cfn_fn_1 = require("./cfn-fn");
const stack_1 = require("./stack");
const token_1 = require("./token");
/**
 * Represents a CloudFormation mapping.
 */
class CfnMapping extends cfn_element_1.CfnRefElement {
    constructor(scope, id, props = {}) {
        super(scope, id);
        this.lazyRender = false;
        this.lazyInformed = false;
        this.mapping = props.mapping ? this.validateMapping(props.mapping) : {};
        this.lazy = props.lazy;
    }
    /**
     * Sets a value in the map based on the two keys.
     */
    setValue(key1, key2, value) {
        this.validateAlphanumeric(key2);
        if (!(key1 in this.mapping)) {
            this.mapping[key1] = {};
        }
        this.mapping[key1][key2] = value;
    }
    /**
     * @returns A reference to a value in the map based on the two keys.
     */
    findInMap(key1, key2) {
        let fullyResolved = false;
        if (!token_1.Token.isUnresolved(key1)) {
            if (!(key1 in this.mapping)) {
                throw new Error(`Mapping doesn't contain top-level key '${key1}'`);
            }
            if (!token_1.Token.isUnresolved(key2)) {
                if (!(key2 in this.mapping[key1])) {
                    throw new Error(`Mapping doesn't contain second-level key '${key2}'`);
                }
                fullyResolved = true;
            }
        }
        if (fullyResolved) {
            if (this.lazy) {
                return this.mapping[key1][key2];
            }
        }
        else {
            this.lazyRender = true;
        }
        return new CfnMappingEmbedder(this, this.mapping, key1, key2).toString();
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        if (this.lazy === undefined && !this.lazyRender) {
            this.informLazyUse();
        }
        if (!this.lazy || (this.lazy && this.lazyRender)) {
            return {
                Mappings: {
                    [this.logicalId]: this.mapping,
                },
            };
        }
        else {
            return {};
        }
    }
    informLazyUse() {
        if (!this.lazyInformed) {
            annotations_1.Annotations.of(this).addInfo('Consider making this CfnMapping a lazy mapping by providing `lazy: true`: either no findInMap was called or every findInMap could be immediately resolved without using Fn::FindInMap');
        }
        this.lazyInformed = true;
    }
    validateMapping(mapping) {
        Object.keys(mapping).forEach((m) => Object.keys(mapping[m]).forEach(this.validateAlphanumeric));
        return mapping;
    }
    validateAlphanumeric(value) {
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
        if (value.match(/[^a-zA-Z0-9]/g)) {
            throw new Error(`Attribute name '${value}' must contain only alphanumeric characters.`);
        }
    }
}
exports.CfnMapping = CfnMapping;
class CfnMappingEmbedder {
    constructor(cfnMapping, mapping, key1, key2) {
        this.cfnMapping = cfnMapping;
        this.mapping = mapping;
        this.key1 = key1;
        this.key2 = key2;
        this.creationStack = [];
    }
    resolve(context) {
        const consumingStack = stack_1.Stack.of(context.scope);
        if (consumingStack === stack_1.Stack.of(this.cfnMapping)) {
            return cfn_fn_1.Fn.findInMap(this.cfnMapping.logicalId, this.key1, this.key2);
        }
        const constructScope = consumingStack;
        const constructId = `MappingCopy-${this.cfnMapping.node.id}-${this.cfnMapping.node.addr}`;
        let mappingCopy = constructScope.node.tryFindChild(constructId);
        if (!mappingCopy) {
            mappingCopy = new CfnMapping(constructScope, constructId, {
                mapping: this.mapping,
            });
        }
        return cfn_fn_1.Fn.findInMap(mappingCopy.logicalId, this.key1, this.key2);
    }
    toString() {
        return token_1.Token.asString(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FBNEM7QUFDNUMsK0NBQThDO0FBQzlDLHFDQUE4QjtBQUU5QixtQ0FBZ0M7QUFDaEMsbUNBQWdDO0FBOEJoQzs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLDJCQUFhO0lBTTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBeUIsRUFBRTtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSlgsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUkzQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLEtBQVU7UUFDcEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDekMsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFL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R0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxJQUFJLGNBQWMsS0FBSyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNoRCxPQUFPLFdBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEU7UUFFRCxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDdEMsTUFBTSxXQUFXLEdBQUcsZUFBZSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFMUYsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUEyQixDQUFDO1FBQzFGLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRSxXQUFXLEVBQUU7Z0JBQ3hELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN0QixDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sV0FBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7IENmblJlZkVsZW1lbnQgfSBmcm9tICcuL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi9jZm4tZm4nO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxudHlwZSBNYXBwaW5nID0geyBbazE6IHN0cmluZ106IHsgW2syOiBzdHJpbmddOiBhbnkgfSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENmbk1hcHBpbmdQcm9wcyB7XG4gIC8qKlxuICAgKiBNYXBwaW5nIG9mIGtleSB0byBhIHNldCBvZiBjb3JyZXNwb25kaW5nIHNldCBvZiBuYW1lZCB2YWx1ZXMuXG4gICAqIFRoZSBrZXkgaWRlbnRpZmllcyBhIG1hcCBvZiBuYW1lLXZhbHVlIHBhaXJzIGFuZCBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB5b3Ugd2FudCB0byBzZXQgdmFsdWVzIGJhc2VkIG9uIGEgcmVnaW9uLCB5b3UgY2FuIGNyZWF0ZSBhIG1hcHBpbmdcbiAgICogdGhhdCB1c2VzIHRoZSByZWdpb24gbmFtZSBhcyBhIGtleSBhbmQgY29udGFpbnMgdGhlIHZhbHVlcyB5b3Ugd2FudCB0byBzcGVjaWZ5IGZvclxuICAgKiBlYWNoIHNwZWNpZmljIHJlZ2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtYXBwaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFwcGluZz86IE1hcHBpbmc7XG5cbiAgLypcbiAgICogU3ludGhlc2l6ZSB0aGlzIG1hcCBpbiBhIGxhenkgZmFzaGlvbi5cbiAgICpcbiAgICogTGF6eSBtYXBzIHdpbGwgb25seSBzeW50aGVzaXplIGEgbWFwcGluZyBpZiBhIGBmaW5kSW5NYXBgIG9wZXJhdGlvbiBpcyB1bmFibGUgdG9cbiAgICogaW1tZWRpYXRlbHkgcmV0dXJuIGEgdmFsdWUgYmVjYXVzZSBvbmUgb3IgYm90aCBvZiB0aGUgcmVxdWVzdGVkIGtleXMgYXJlIHVucmVzb2x2ZWRcbiAgICogdG9rZW5zLiBJbiB0aGlzIGNhc2UsIGBmaW5kSW5NYXBgIHdpbGwgcmV0dXJuIGEgYEZuOjpGaW5kSW5NYXBgIENsb3VkRm9ybWF0aW9uXG4gICAqIGludHJpbnNpYy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGxhenk/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiBtYXBwaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuTWFwcGluZyBleHRlbmRzIENmblJlZkVsZW1lbnQge1xuICBwcml2YXRlIG1hcHBpbmc6IE1hcHBpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGF6eT86IGJvb2xlYW47XG4gIHByaXZhdGUgbGF6eVJlbmRlciA9IGZhbHNlO1xuICBwcml2YXRlIGxhenlJbmZvcm1lZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5NYXBwaW5nUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgdGhpcy5tYXBwaW5nID0gcHJvcHMubWFwcGluZyA/IHRoaXMudmFsaWRhdGVNYXBwaW5nKHByb3BzLm1hcHBpbmcpIDoge307XG4gICAgdGhpcy5sYXp5ID0gcHJvcHMubGF6eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhlIG1hcCBiYXNlZCBvbiB0aGUgdHdvIGtleXMuXG4gICAqL1xuICBwdWJsaWMgc2V0VmFsdWUoa2V5MTogc3RyaW5nLCBrZXkyOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbGlkYXRlQWxwaGFudW1lcmljKGtleTIpO1xuXG4gICAgaWYgKCEoa2V5MSBpbiB0aGlzLm1hcHBpbmcpKSB7XG4gICAgICB0aGlzLm1hcHBpbmdba2V5MV0gPSB7IH07XG4gICAgfVxuXG4gICAgdGhpcy5tYXBwaW5nW2tleTFdW2tleTJdID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgQSByZWZlcmVuY2UgdG8gYSB2YWx1ZSBpbiB0aGUgbWFwIGJhc2VkIG9uIHRoZSB0d28ga2V5cy5cbiAgICovXG4gIHB1YmxpYyBmaW5kSW5NYXAoa2V5MTogc3RyaW5nLCBrZXkyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCBmdWxseVJlc29sdmVkID0gZmFsc2U7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoa2V5MSkpIHtcbiAgICAgIGlmICghKGtleTEgaW4gdGhpcy5tYXBwaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcHBpbmcgZG9lc24ndCBjb250YWluIHRvcC1sZXZlbCBrZXkgJyR7a2V5MX0nYCk7XG4gICAgICB9XG4gICAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChrZXkyKSkge1xuICAgICAgICBpZiAoIShrZXkyIGluIHRoaXMubWFwcGluZ1trZXkxXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcHBpbmcgZG9lc24ndCBjb250YWluIHNlY29uZC1sZXZlbCBrZXkgJyR7a2V5Mn0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVsbHlSZXNvbHZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmdWxseVJlc29sdmVkKSB7XG4gICAgICBpZiAodGhpcy5sYXp5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcHBpbmdba2V5MV1ba2V5Ml07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF6eVJlbmRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDZm5NYXBwaW5nRW1iZWRkZXIodGhpcywgdGhpcy5tYXBwaW5nLCBrZXkxLCBrZXkyKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgaWYgKHRoaXMubGF6eSA9PT0gdW5kZWZpbmVkICYmICF0aGlzLmxhenlSZW5kZXIpIHtcbiAgICAgIHRoaXMuaW5mb3JtTGF6eVVzZSgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGF6eSB8fCAodGhpcy5sYXp5ICYmIHRoaXMubGF6eVJlbmRlcikpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIE1hcHBpbmdzOiB7XG4gICAgICAgICAgW3RoaXMubG9naWNhbElkXTogdGhpcy5tYXBwaW5nLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5mb3JtTGF6eVVzZSgpIHtcbiAgICBpZiAoIXRoaXMubGF6eUluZm9ybWVkKSB7XG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRJbmZvKCdDb25zaWRlciBtYWtpbmcgdGhpcyBDZm5NYXBwaW5nIGEgbGF6eSBtYXBwaW5nIGJ5IHByb3ZpZGluZyBgbGF6eTogdHJ1ZWA6IGVpdGhlciBubyBmaW5kSW5NYXAgd2FzIGNhbGxlZCBvciBldmVyeSBmaW5kSW5NYXAgY291bGQgYmUgaW1tZWRpYXRlbHkgcmVzb2x2ZWQgd2l0aG91dCB1c2luZyBGbjo6RmluZEluTWFwJyk7XG4gICAgfVxuICAgIHRoaXMubGF6eUluZm9ybWVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVNYXBwaW5nKG1hcHBpbmc6IE1hcHBpbmcpOiBNYXBwaW5nIHtcbiAgICBPYmplY3Qua2V5cyhtYXBwaW5nKS5mb3JFYWNoKChtKSA9PiBPYmplY3Qua2V5cyhtYXBwaW5nW21dKS5mb3JFYWNoKHRoaXMudmFsaWRhdGVBbHBoYW51bWVyaWMpKTtcbiAgICByZXR1cm4gbWFwcGluZztcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVBbHBoYW51bWVyaWModmFsdWU6IGFueSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL21hcHBpbmdzLXNlY3Rpb24tc3RydWN0dXJlLmh0bWxcbiAgICBpZiAodmFsdWUubWF0Y2goL1teYS16QS1aMC05XS9nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRyaWJ1dGUgbmFtZSAnJHt2YWx1ZX0nIG11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLmApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBDZm5NYXBwaW5nRW1iZWRkZXIgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjZm5NYXBwaW5nOiBDZm5NYXBwaW5nLCByZWFkb25seSBtYXBwaW5nOiBNYXBwaW5nLCBwcml2YXRlIHJlYWRvbmx5IGtleTE6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBrZXkyOiBzdHJpbmcpIHsgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IHN0cmluZyB7XG4gICAgY29uc3QgY29uc3VtaW5nU3RhY2sgPSBTdGFjay5vZihjb250ZXh0LnNjb3BlKTtcbiAgICBpZiAoY29uc3VtaW5nU3RhY2sgPT09IFN0YWNrLm9mKHRoaXMuY2ZuTWFwcGluZykpIHtcbiAgICAgIHJldHVybiBGbi5maW5kSW5NYXAodGhpcy5jZm5NYXBwaW5nLmxvZ2ljYWxJZCwgdGhpcy5rZXkxLCB0aGlzLmtleTIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnN0cnVjdFNjb3BlID0gY29uc3VtaW5nU3RhY2s7XG4gICAgY29uc3QgY29uc3RydWN0SWQgPSBgTWFwcGluZ0NvcHktJHt0aGlzLmNmbk1hcHBpbmcubm9kZS5pZH0tJHt0aGlzLmNmbk1hcHBpbmcubm9kZS5hZGRyfWA7XG5cbiAgICBsZXQgbWFwcGluZ0NvcHkgPSBjb25zdHJ1Y3RTY29wZS5ub2RlLnRyeUZpbmRDaGlsZChjb25zdHJ1Y3RJZCkgYXMgQ2ZuTWFwcGluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIW1hcHBpbmdDb3B5KSB7XG4gICAgICBtYXBwaW5nQ29weSA9IG5ldyBDZm5NYXBwaW5nKGNvbnN0cnVjdFNjb3BlLCBjb25zdHJ1Y3RJZCwge1xuICAgICAgICBtYXBwaW5nOiB0aGlzLm1hcHBpbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gRm4uZmluZEluTWFwKG1hcHBpbmdDb3B5LmxvZ2ljYWxJZCwgdGhpcy5rZXkxLCB0aGlzLmtleTIpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxufVxuIl19