"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnMapping = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnMappingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnMapping);
            }
            throw error;
        }
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
_a = JSII_RTTI_SYMBOL_1;
CfnMapping[_a] = { fqn: "@aws-cdk/core.CfnMapping", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBNEM7QUFDNUMsK0NBQThDO0FBQzlDLHFDQUE4QjtBQUU5QixtQ0FBZ0M7QUFDaEMsbUNBQWdDO0FBOEJoQzs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLDJCQUFhO0lBTTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBeUIsRUFBRTtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSlgsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixpQkFBWSxHQUFHLEtBQUssQ0FBQzs7Ozs7OytDQUpsQixVQUFVOzs7O1FBUW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FDeEI7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLEtBQVU7UUFDcEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksU0FBUyxDQUFDLElBQVksRUFBRSxJQUFZO1FBQ3pDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMxQixJ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RSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxJQUFJLGNBQWMsS0FBSyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNoRCxPQUFPLFdBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEU7UUFFRCxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDdEMsTUFBTSxXQUFXLEdBQUcsZUFBZSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFMUYsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUEyQixDQUFDO1FBQzFGLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRSxXQUFXLEVBQUU7Z0JBQ3hELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN0QixDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sV0FBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xFO0lBRU0sUUFBUTtRQUNiLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuUmVmRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgRm4gfSBmcm9tICcuL2Nmbi1mbic7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG50eXBlIE1hcHBpbmcgPSB7IFtrMTogc3RyaW5nXTogeyBbazI6IHN0cmluZ106IGFueSB9IH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuTWFwcGluZ1Byb3BzIHtcbiAgLyoqXG4gICAqIE1hcHBpbmcgb2Yga2V5IHRvIGEgc2V0IG9mIGNvcnJlc3BvbmRpbmcgc2V0IG9mIG5hbWVkIHZhbHVlcy5cbiAgICogVGhlIGtleSBpZGVudGlmaWVzIGEgbWFwIG9mIG5hbWUtdmFsdWUgcGFpcnMgYW5kIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHlvdSB3YW50IHRvIHNldCB2YWx1ZXMgYmFzZWQgb24gYSByZWdpb24sIHlvdSBjYW4gY3JlYXRlIGEgbWFwcGluZ1xuICAgKiB0aGF0IHVzZXMgdGhlIHJlZ2lvbiBuYW1lIGFzIGEga2V5IGFuZCBjb250YWlucyB0aGUgdmFsdWVzIHlvdSB3YW50IHRvIHNwZWNpZnkgZm9yXG4gICAqIGVhY2ggc3BlY2lmaWMgcmVnaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1hcHBpbmcuXG4gICAqL1xuICByZWFkb25seSBtYXBwaW5nPzogTWFwcGluZztcblxuICAvKlxuICAgKiBTeW50aGVzaXplIHRoaXMgbWFwIGluIGEgbGF6eSBmYXNoaW9uLlxuICAgKlxuICAgKiBMYXp5IG1hcHMgd2lsbCBvbmx5IHN5bnRoZXNpemUgYSBtYXBwaW5nIGlmIGEgYGZpbmRJbk1hcGAgb3BlcmF0aW9uIGlzIHVuYWJsZSB0b1xuICAgKiBpbW1lZGlhdGVseSByZXR1cm4gYSB2YWx1ZSBiZWNhdXNlIG9uZSBvciBib3RoIG9mIHRoZSByZXF1ZXN0ZWQga2V5cyBhcmUgdW5yZXNvbHZlZFxuICAgKiB0b2tlbnMuIEluIHRoaXMgY2FzZSwgYGZpbmRJbk1hcGAgd2lsbCByZXR1cm4gYSBgRm46OkZpbmRJbk1hcGAgQ2xvdWRGb3JtYXRpb25cbiAgICogaW50cmluc2ljLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbGF6eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIG1hcHBpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5NYXBwaW5nIGV4dGVuZHMgQ2ZuUmVmRWxlbWVudCB7XG4gIHByaXZhdGUgbWFwcGluZzogTWFwcGluZztcbiAgcHJpdmF0ZSByZWFkb25seSBsYXp5PzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsYXp5UmVuZGVyID0gZmFsc2U7XG4gIHByaXZhdGUgbGF6eUluZm9ybWVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbk1hcHBpbmdQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLm1hcHBpbmcgPSBwcm9wcy5tYXBwaW5nID8gdGhpcy52YWxpZGF0ZU1hcHBpbmcocHJvcHMubWFwcGluZykgOiB7fTtcbiAgICB0aGlzLmxhenkgPSBwcm9wcy5sYXp5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBpbiB0aGUgbWFwIGJhc2VkIG9uIHRoZSB0d28ga2V5cy5cbiAgICovXG4gIHB1YmxpYyBzZXRWYWx1ZShrZXkxOiBzdHJpbmcsIGtleTI6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsaWRhdGVBbHBoYW51bWVyaWMoa2V5Mik7XG5cbiAgICBpZiAoIShrZXkxIGluIHRoaXMubWFwcGluZykpIHtcbiAgICAgIHRoaXMubWFwcGluZ1trZXkxXSA9IHsgfTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcHBpbmdba2V5MV1ba2V5Ml0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBBIHJlZmVyZW5jZSB0byBhIHZhbHVlIGluIHRoZSBtYXAgYmFzZWQgb24gdGhlIHR3byBrZXlzLlxuICAgKi9cbiAgcHVibGljIGZpbmRJbk1hcChrZXkxOiBzdHJpbmcsIGtleTI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IGZ1bGx5UmVzb2x2ZWQgPSBmYWxzZTtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChrZXkxKSkge1xuICAgICAgaWYgKCEoa2V5MSBpbiB0aGlzLm1hcHBpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwcGluZyBkb2Vzbid0IGNvbnRhaW4gdG9wLWxldmVsIGtleSAnJHtrZXkxfSdgKTtcbiAgICAgIH1cbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGtleTIpKSB7XG4gICAgICAgIGlmICghKGtleTIgaW4gdGhpcy5tYXBwaW5nW2tleTFdKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwcGluZyBkb2Vzbid0IGNvbnRhaW4gc2Vjb25kLWxldmVsIGtleSAnJHtrZXkyfSdgKTtcbiAgICAgICAgfVxuICAgICAgICBmdWxseVJlc29sdmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZ1bGx5UmVzb2x2ZWQpIHtcbiAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwcGluZ1trZXkxXVtrZXkyXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXp5UmVuZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENmbk1hcHBpbmdFbWJlZGRlcih0aGlzLCB0aGlzLm1hcHBpbmcsIGtleTEsIGtleTIpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICBpZiAodGhpcy5sYXp5ID09PSB1bmRlZmluZWQgJiYgIXRoaXMubGF6eVJlbmRlcikge1xuICAgICAgdGhpcy5pbmZvcm1MYXp5VXNlKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5sYXp5IHx8ICh0aGlzLmxhenkgJiYgdGhpcy5sYXp5UmVuZGVyKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgTWFwcGluZ3M6IHtcbiAgICAgICAgICBbdGhpcy5sb2dpY2FsSWRdOiB0aGlzLm1hcHBpbmcsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbmZvcm1MYXp5VXNlKCkge1xuICAgIGlmICghdGhpcy5sYXp5SW5mb3JtZWQpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEluZm8oJ0NvbnNpZGVyIG1ha2luZyB0aGlzIENmbk1hcHBpbmcgYSBsYXp5IG1hcHBpbmcgYnkgcHJvdmlkaW5nIGBsYXp5OiB0cnVlYDogZWl0aGVyIG5vIGZpbmRJbk1hcCB3YXMgY2FsbGVkIG9yIGV2ZXJ5IGZpbmRJbk1hcCBjb3VsZCBiZSBpbW1lZGlhdGVseSByZXNvbHZlZCB3aXRob3V0IHVzaW5nIEZuOjpGaW5kSW5NYXAnKTtcbiAgICB9XG4gICAgdGhpcy5sYXp5SW5mb3JtZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZU1hcHBpbmcobWFwcGluZzogTWFwcGluZyk6IE1hcHBpbmcge1xuICAgIE9iamVjdC5rZXlzKG1hcHBpbmcpLmZvckVhY2goKG0pID0+IE9iamVjdC5rZXlzKG1hcHBpbmdbbV0pLmZvckVhY2godGhpcy52YWxpZGF0ZUFscGhhbnVtZXJpYykpO1xuICAgIHJldHVybiBtYXBwaW5nO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUFscGhhbnVtZXJpYyh2YWx1ZTogYW55KSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvbWFwcGluZ3Mtc2VjdGlvbi1zdHJ1Y3R1cmUuaHRtbFxuICAgIGlmICh2YWx1ZS5tYXRjaCgvW15hLXpBLVowLTldL2cpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dHJpYnV0ZSBuYW1lICcke3ZhbHVlfScgbXVzdCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuYCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENmbk1hcHBpbmdFbWJlZGRlciBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNmbk1hcHBpbmc6IENmbk1hcHBpbmcsIHJlYWRvbmx5IG1hcHBpbmc6IE1hcHBpbmcsIHByaXZhdGUgcmVhZG9ubHkga2V5MTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IGtleTI6IHN0cmluZykgeyB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogc3RyaW5nIHtcbiAgICBjb25zdCBjb25zdW1pbmdTdGFjayA9IFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpO1xuICAgIGlmIChjb25zdW1pbmdTdGFjayA9PT0gU3RhY2sub2YodGhpcy5jZm5NYXBwaW5nKSkge1xuICAgICAgcmV0dXJuIEZuLmZpbmRJbk1hcCh0aGlzLmNmbk1hcHBpbmcubG9naWNhbElkLCB0aGlzLmtleTEsIHRoaXMua2V5Mik7XG4gICAgfVxuXG4gICAgY29uc3QgY29uc3RydWN0U2NvcGUgPSBjb25zdW1pbmdTdGFjaztcbiAgICBjb25zdCBjb25zdHJ1Y3RJZCA9IGBNYXBwaW5nQ29weS0ke3RoaXMuY2ZuTWFwcGluZy5ub2RlLmlkfS0ke3RoaXMuY2ZuTWFwcGluZy5ub2RlLmFkZHJ9YDtcblxuICAgIGxldCBtYXBwaW5nQ29weSA9IGNvbnN0cnVjdFNjb3BlLm5vZGUudHJ5RmluZENoaWxkKGNvbnN0cnVjdElkKSBhcyBDZm5NYXBwaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmICghbWFwcGluZ0NvcHkpIHtcbiAgICAgIG1hcHBpbmdDb3B5ID0gbmV3IENmbk1hcHBpbmcoY29uc3RydWN0U2NvcGUsIGNvbnN0cnVjdElkLCB7XG4gICAgICAgIG1hcHBpbmc6IHRoaXMubWFwcGluZyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBGbi5maW5kSW5NYXAobWFwcGluZ0NvcHkubG9naWNhbElkLCB0aGlzLmtleTEsIHRoaXMua2V5Mik7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMpO1xuICB9XG59XG4iXX0=