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
exports.CfnMapping = CfnMapping;
_a = JSII_RTTI_SYMBOL_1;
CfnMapping[_a] = { fqn: "@aws-cdk/core.CfnMapping", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBNEM7QUFDNUMsK0NBQThDO0FBQzlDLHFDQUE4QjtBQUU5QixtQ0FBZ0M7QUFDaEMsbUNBQWdDO0FBOEJoQzs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLDJCQUFhO0lBTTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBeUIsRUFBRTtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSlgsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixpQkFBWSxHQUFHLEtBQUssQ0FBQzs7Ozs7OytDQUpsQixVQUFVOzs7O1FBUW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FDeEI7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLEtBQVU7UUFDcEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksU0FBUyxDQUFDLElBQVksRUFBRSxJQUFZO1FBQ3pDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMxQixJ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LENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLElBQUksY0FBYyxLQUFLLGFBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2hELE9BQU8sV0FBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RTtRQUVELE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUN0QyxNQUFNLFdBQVcsR0FBRyxlQUFlLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUxRixJQUFJLFdBQVcsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQTJCLENBQUM7UUFDMUYsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsY0FBYyxFQUFFLFdBQVcsRUFBRTtnQkFDeEQsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxXQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEU7SUFFTSxRQUFRO1FBQ2IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBDZm5SZWZFbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4vY2ZuLWZuJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbnR5cGUgTWFwcGluZyA9IHsgW2sxOiBzdHJpbmddOiB7IFtrMjogc3RyaW5nXTogYW55IH0gfTtcblxuZXhwb3J0IGludGVyZmFjZSBDZm5NYXBwaW5nUHJvcHMge1xuICAvKipcbiAgICogTWFwcGluZyBvZiBrZXkgdG8gYSBzZXQgb2YgY29ycmVzcG9uZGluZyBzZXQgb2YgbmFtZWQgdmFsdWVzLlxuICAgKiBUaGUga2V5IGlkZW50aWZpZXMgYSBtYXAgb2YgbmFtZS12YWx1ZSBwYWlycyBhbmQgbXVzdCBiZSB1bmlxdWUgd2l0aGluIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IHdhbnQgdG8gc2V0IHZhbHVlcyBiYXNlZCBvbiBhIHJlZ2lvbiwgeW91IGNhbiBjcmVhdGUgYSBtYXBwaW5nXG4gICAqIHRoYXQgdXNlcyB0aGUgcmVnaW9uIG5hbWUgYXMgYSBrZXkgYW5kIGNvbnRhaW5zIHRoZSB2YWx1ZXMgeW91IHdhbnQgdG8gc3BlY2lmeSBmb3JcbiAgICogZWFjaCBzcGVjaWZpYyByZWdpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWFwcGluZy5cbiAgICovXG4gIHJlYWRvbmx5IG1hcHBpbmc/OiBNYXBwaW5nO1xuXG4gIC8qXG4gICAqIFN5bnRoZXNpemUgdGhpcyBtYXAgaW4gYSBsYXp5IGZhc2hpb24uXG4gICAqXG4gICAqIExhenkgbWFwcyB3aWxsIG9ubHkgc3ludGhlc2l6ZSBhIG1hcHBpbmcgaWYgYSBgZmluZEluTWFwYCBvcGVyYXRpb24gaXMgdW5hYmxlIHRvXG4gICAqIGltbWVkaWF0ZWx5IHJldHVybiBhIHZhbHVlIGJlY2F1c2Ugb25lIG9yIGJvdGggb2YgdGhlIHJlcXVlc3RlZCBrZXlzIGFyZSB1bnJlc29sdmVkXG4gICAqIHRva2Vucy4gSW4gdGhpcyBjYXNlLCBgZmluZEluTWFwYCB3aWxsIHJldHVybiBhIGBGbjo6RmluZEluTWFwYCBDbG91ZEZvcm1hdGlvblxuICAgKiBpbnRyaW5zaWMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBsYXp5PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGb3JtYXRpb24gbWFwcGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIENmbk1hcHBpbmcgZXh0ZW5kcyBDZm5SZWZFbGVtZW50IHtcbiAgcHJpdmF0ZSBtYXBwaW5nOiBNYXBwaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGxhenk/OiBib29sZWFuO1xuICBwcml2YXRlIGxhenlSZW5kZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBsYXp5SW5mb3JtZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuTWFwcGluZ1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMubWFwcGluZyA9IHByb3BzLm1hcHBpbmcgPyB0aGlzLnZhbGlkYXRlTWFwcGluZyhwcm9wcy5tYXBwaW5nKSA6IHt9O1xuICAgIHRoaXMubGF6eSA9IHByb3BzLmxhenk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIGluIHRoZSBtYXAgYmFzZWQgb24gdGhlIHR3byBrZXlzLlxuICAgKi9cbiAgcHVibGljIHNldFZhbHVlKGtleTE6IHN0cmluZywga2V5Mjogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWxpZGF0ZUFscGhhbnVtZXJpYyhrZXkyKTtcblxuICAgIGlmICghKGtleTEgaW4gdGhpcy5tYXBwaW5nKSkge1xuICAgICAgdGhpcy5tYXBwaW5nW2tleTFdID0geyB9O1xuICAgIH1cblxuICAgIHRoaXMubWFwcGluZ1trZXkxXVtrZXkyXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIGEgdmFsdWUgaW4gdGhlIG1hcCBiYXNlZCBvbiB0aGUgdHdvIGtleXMuXG4gICAqL1xuICBwdWJsaWMgZmluZEluTWFwKGtleTE6IHN0cmluZywga2V5Mjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgZnVsbHlSZXNvbHZlZCA9IGZhbHNlO1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGtleTEpKSB7XG4gICAgICBpZiAoIShrZXkxIGluIHRoaXMubWFwcGluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXBwaW5nIGRvZXNuJ3QgY29udGFpbiB0b3AtbGV2ZWwga2V5ICcke2tleTF9J2ApO1xuICAgICAgfVxuICAgICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoa2V5MikpIHtcbiAgICAgICAgaWYgKCEoa2V5MiBpbiB0aGlzLm1hcHBpbmdba2V5MV0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXBwaW5nIGRvZXNuJ3QgY29udGFpbiBzZWNvbmQtbGV2ZWwga2V5ICcke2tleTJ9J2ApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bGx5UmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnVsbHlSZXNvbHZlZCkge1xuICAgICAgaWYgKHRoaXMubGF6eSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXBwaW5nW2tleTFdW2tleTJdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhenlSZW5kZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ2ZuTWFwcGluZ0VtYmVkZGVyKHRoaXMsIHRoaXMubWFwcGluZywga2V5MSwga2V5MikudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfdG9DbG91ZEZvcm1hdGlvbigpOiBvYmplY3Qge1xuICAgIGlmICh0aGlzLmxhenkgPT09IHVuZGVmaW5lZCAmJiAhdGhpcy5sYXp5UmVuZGVyKSB7XG4gICAgICB0aGlzLmluZm9ybUxhenlVc2UoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmxhenkgfHwgKHRoaXMubGF6eSAmJiB0aGlzLmxhenlSZW5kZXIpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBNYXBwaW5nczoge1xuICAgICAgICAgIFt0aGlzLmxvZ2ljYWxJZF06IHRoaXMubWFwcGluZyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluZm9ybUxhenlVc2UoKSB7XG4gICAgaWYgKCF0aGlzLmxhenlJbmZvcm1lZCkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkSW5mbygnQ29uc2lkZXIgbWFraW5nIHRoaXMgQ2ZuTWFwcGluZyBhIGxhenkgbWFwcGluZyBieSBwcm92aWRpbmcgYGxhenk6IHRydWVgOiBlaXRoZXIgbm8gZmluZEluTWFwIHdhcyBjYWxsZWQgb3IgZXZlcnkgZmluZEluTWFwIGNvdWxkIGJlIGltbWVkaWF0ZWx5IHJlc29sdmVkIHdpdGhvdXQgdXNpbmcgRm46OkZpbmRJbk1hcCcpO1xuICAgIH1cbiAgICB0aGlzLmxhenlJbmZvcm1lZCA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlTWFwcGluZyhtYXBwaW5nOiBNYXBwaW5nKTogTWFwcGluZyB7XG4gICAgT2JqZWN0LmtleXMobWFwcGluZykuZm9yRWFjaCgobSkgPT4gT2JqZWN0LmtleXMobWFwcGluZ1ttXSkuZm9yRWFjaCh0aGlzLnZhbGlkYXRlQWxwaGFudW1lcmljKSk7XG4gICAgcmV0dXJuIG1hcHBpbmc7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQWxwaGFudW1lcmljKHZhbHVlOiBhbnkpIHtcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9tYXBwaW5ncy1zZWN0aW9uLXN0cnVjdHVyZS5odG1sXG4gICAgaWYgKHZhbHVlLm1hdGNoKC9bXmEtekEtWjAtOV0vZykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0cmlidXRlIG5hbWUgJyR7dmFsdWV9JyBtdXN0IGNvbnRhaW4gb25seSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycy5gKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQ2ZuTWFwcGluZ0VtYmVkZGVyIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2ZuTWFwcGluZzogQ2ZuTWFwcGluZywgcmVhZG9ubHkgbWFwcGluZzogTWFwcGluZywgcHJpdmF0ZSByZWFkb25seSBrZXkxOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkga2V5Mjogc3RyaW5nKSB7IH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbnN1bWluZ1N0YWNrID0gU3RhY2sub2YoY29udGV4dC5zY29wZSk7XG4gICAgaWYgKGNvbnN1bWluZ1N0YWNrID09PSBTdGFjay5vZih0aGlzLmNmbk1hcHBpbmcpKSB7XG4gICAgICByZXR1cm4gRm4uZmluZEluTWFwKHRoaXMuY2ZuTWFwcGluZy5sb2dpY2FsSWQsIHRoaXMua2V5MSwgdGhpcy5rZXkyKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RTY29wZSA9IGNvbnN1bWluZ1N0YWNrO1xuICAgIGNvbnN0IGNvbnN0cnVjdElkID0gYE1hcHBpbmdDb3B5LSR7dGhpcy5jZm5NYXBwaW5nLm5vZGUuaWR9LSR7dGhpcy5jZm5NYXBwaW5nLm5vZGUuYWRkcn1gO1xuXG4gICAgbGV0IG1hcHBpbmdDb3B5ID0gY29uc3RydWN0U2NvcGUubm9kZS50cnlGaW5kQ2hpbGQoY29uc3RydWN0SWQpIGFzIENmbk1hcHBpbmcgfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFtYXBwaW5nQ29weSkge1xuICAgICAgbWFwcGluZ0NvcHkgPSBuZXcgQ2ZuTWFwcGluZyhjb25zdHJ1Y3RTY29wZSwgY29uc3RydWN0SWQsIHtcbiAgICAgICAgbWFwcGluZzogdGhpcy5tYXBwaW5nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEZuLmZpbmRJbk1hcChtYXBwaW5nQ29weS5sb2dpY2FsSWQsIHRoaXMua2V5MSwgdGhpcy5rZXkyKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcyk7XG4gIH1cbn1cbiJdfQ==