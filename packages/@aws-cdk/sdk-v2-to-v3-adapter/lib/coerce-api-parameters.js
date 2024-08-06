"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coercer = exports.coerceApiParameters = void 0;
const parameter_types_1 = require("./parameter-types");
/**
 * Given a minimal AWS SDKv3 call definition (service, action, parameters),
 * coerces nested parameter values into a Uint8Array if that's what the SDKv3 expects.
 */
function coerceApiParameters(v3service, action, parameters = {}) {
    const typeMachine = (0, parameter_types_1.typeCoercionStateMachine)();
    return new Coercer(typeMachine).coerceApiParameters(v3service, action, parameters);
}
exports.coerceApiParameters = coerceApiParameters;
/**
 * Make this a class in order to have multiple entry points for testing that can all share convenience functions
 */
class Coercer {
    constructor(typeMachine) {
        this.typeMachine = typeMachine;
    }
    coerceApiParameters(v3service, action, parameters = {}) {
        // Get the initial state corresponding to the current service+action, then recurse through the parameters
        const actionState = this.progress(action.toLowerCase(), this.progress(v3service.toLowerCase(), 0));
        return this.recurse(parameters, actionState);
    }
    testCoerce(value) {
        return this.recurse(value, 0);
    }
    recurse(value, state) {
        switch (state) {
            case undefined: return value;
            case 'b': return coerceValueToUint8Array(value);
            case 'n': return coerceValueToNumber(value);
        }
        if (Array.isArray(value)) {
            const elState = this.progress('*', state);
            return elState !== undefined
                ? value.map((e) => this.recurse(e, elState))
                : value;
        }
        if (value && typeof value === 'object') {
            // Mutate the object in-place for efficiency
            const mapState = this.progress('*', state);
            for (const key of Object.keys(value)) {
                const fieldState = this.progress(key, state) ?? mapState;
                if (fieldState !== undefined) {
                    value[key] = this.recurse(value[key], fieldState);
                }
            }
            return value;
        }
        return value;
    }
    /**
     * From a given state, return the state we would end up in if we followed this field
     */
    progress(field, s) {
        if (s === undefined || typeof s !== 'number') {
            return undefined;
        }
        return this.typeMachine[s][field];
    }
}
exports.Coercer = Coercer;
function coerceValueToUint8Array(x) {
    if (x instanceof Uint8Array) {
        return x;
    }
    if (typeof x === 'string' || typeof x === 'number') {
        return new TextEncoder().encode(x.toString());
    }
    return x;
}
function coerceValueToNumber(x) {
    if (typeof x === 'number') {
        return x;
    }
    if (typeof x === 'string') {
        const n = Number(x);
        return isNaN(n) ? x : n;
    }
    return x;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29lcmNlLWFwaS1wYXJhbWV0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29lcmNlLWFwaS1wYXJhbWV0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUF1RjtBQU12Rjs7O0dBR0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxTQUFpQixFQUFFLE1BQWMsRUFBRSxhQUE0QixFQUFFO0lBQ25HLE1BQU0sV0FBVyxHQUFHLElBQUEsMENBQXdCLEdBQUUsQ0FBQztJQUMvQyxPQUFPLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUhELGtEQUdDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLE9BQU87SUFDbEIsWUFBNkIsV0FBcUM7UUFBckMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO0lBQUksQ0FBQztJQUVoRSxtQkFBbUIsQ0FBQyxTQUFpQixFQUFFLE1BQWMsRUFBRSxhQUE0QixFQUFFO1FBQzFGLHlHQUF5RztRQUN6RyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25HLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFRLENBQUM7SUFDdEQsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFjO1FBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLE9BQU8sQ0FBQyxLQUFjLEVBQUUsS0FBb0M7UUFDbEUsUUFBUSxLQUFLLEVBQUU7WUFDYixLQUFLLFNBQVMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDO1lBQzdCLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0M7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxPQUFPLEtBQUssU0FBUztnQkFDMUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ1g7UUFFRCxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDdEMsNENBQTRDO1lBQzVDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDcEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDO2dCQUN6RCxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7b0JBQzNCLEtBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFFLEtBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDckU7YUFDRjtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNLLFFBQVEsQ0FBQyxLQUFhLEVBQUUsQ0FBZ0M7UUFDOUQsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUM1QyxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Y7QUFuREQsMEJBbURDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxDQUFVO0lBQ3pDLElBQUksQ0FBQyxZQUFZLFVBQVUsRUFBRTtRQUMzQixPQUFPLENBQUMsQ0FBQztLQUNWO0lBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQ2xELE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLENBQVU7SUFDckMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDekIsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekI7SUFFRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUeXBlQ29lcmNpb25TdGF0ZU1hY2hpbmUsIHR5cGVDb2VyY2lvblN0YXRlTWFjaGluZSB9IGZyb20gJy4vcGFyYW1ldGVyLXR5cGVzJztcblxudHlwZSBBcGlQYXJhbWV0ZXJzID0geyBbcGFyYW06IHN0cmluZ106IGFueSB9O1xuXG50eXBlIFN0YXRlT3JDb252ZXJzaW9uID0gVHlwZUNvZXJjaW9uU3RhdGVNYWNoaW5lW251bWJlcl1bc3RyaW5nXTtcblxuLyoqXG4gKiBHaXZlbiBhIG1pbmltYWwgQVdTIFNES3YzIGNhbGwgZGVmaW5pdGlvbiAoc2VydmljZSwgYWN0aW9uLCBwYXJhbWV0ZXJzKSxcbiAqIGNvZXJjZXMgbmVzdGVkIHBhcmFtZXRlciB2YWx1ZXMgaW50byBhIFVpbnQ4QXJyYXkgaWYgdGhhdCdzIHdoYXQgdGhlIFNES3YzIGV4cGVjdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2VBcGlQYXJhbWV0ZXJzKHYzc2VydmljZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgcGFyYW1ldGVyczogQXBpUGFyYW1ldGVycyA9IHt9KTogQXBpUGFyYW1ldGVycyB7XG4gIGNvbnN0IHR5cGVNYWNoaW5lID0gdHlwZUNvZXJjaW9uU3RhdGVNYWNoaW5lKCk7XG4gIHJldHVybiBuZXcgQ29lcmNlcih0eXBlTWFjaGluZSkuY29lcmNlQXBpUGFyYW1ldGVycyh2M3NlcnZpY2UsIGFjdGlvbiwgcGFyYW1ldGVycyk7XG59XG5cbi8qKlxuICogTWFrZSB0aGlzIGEgY2xhc3MgaW4gb3JkZXIgdG8gaGF2ZSBtdWx0aXBsZSBlbnRyeSBwb2ludHMgZm9yIHRlc3RpbmcgdGhhdCBjYW4gYWxsIHNoYXJlIGNvbnZlbmllbmNlIGZ1bmN0aW9uc1xuICovXG5leHBvcnQgY2xhc3MgQ29lcmNlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdHlwZU1hY2hpbmU6IFR5cGVDb2VyY2lvblN0YXRlTWFjaGluZSkgeyB9XG5cbiAgcHVibGljIGNvZXJjZUFwaVBhcmFtZXRlcnModjNzZXJ2aWNlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBwYXJhbWV0ZXJzOiBBcGlQYXJhbWV0ZXJzID0ge30pOiBBcGlQYXJhbWV0ZXJzIHtcbiAgICAvLyBHZXQgdGhlIGluaXRpYWwgc3RhdGUgY29ycmVzcG9uZGluZyB0byB0aGUgY3VycmVudCBzZXJ2aWNlK2FjdGlvbiwgdGhlbiByZWN1cnNlIHRocm91Z2ggdGhlIHBhcmFtZXRlcnNcbiAgICBjb25zdCBhY3Rpb25TdGF0ZSA9IHRoaXMucHJvZ3Jlc3MoYWN0aW9uLnRvTG93ZXJDYXNlKCksIHRoaXMucHJvZ3Jlc3ModjNzZXJ2aWNlLnRvTG93ZXJDYXNlKCksIDApKTtcbiAgICByZXR1cm4gdGhpcy5yZWN1cnNlKHBhcmFtZXRlcnMsIGFjdGlvblN0YXRlKSBhcyBhbnk7XG4gIH1cblxuICBwdWJsaWMgdGVzdENvZXJjZSh2YWx1ZTogdW5rbm93bik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVjdXJzZSh2YWx1ZSwgMCk7XG4gIH1cblxuICBwcml2YXRlIHJlY3Vyc2UodmFsdWU6IHVua25vd24sIHN0YXRlOiBTdGF0ZU9yQ29udmVyc2lvbiB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6IHJldHVybiB2YWx1ZTtcbiAgICAgIGNhc2UgJ2InOiByZXR1cm4gY29lcmNlVmFsdWVUb1VpbnQ4QXJyYXkodmFsdWUpO1xuICAgICAgY2FzZSAnbic6IHJldHVybiBjb2VyY2VWYWx1ZVRvTnVtYmVyKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IGVsU3RhdGUgPSB0aGlzLnByb2dyZXNzKCcqJywgc3RhdGUpO1xuICAgICAgcmV0dXJuIGVsU3RhdGUgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHZhbHVlLm1hcCgoZSkgPT4gdGhpcy5yZWN1cnNlKGUsIGVsU3RhdGUpKVxuICAgICAgICA6IHZhbHVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBNdXRhdGUgdGhlIG9iamVjdCBpbi1wbGFjZSBmb3IgZWZmaWNpZW5jeVxuICAgICAgY29uc3QgbWFwU3RhdGUgPSB0aGlzLnByb2dyZXNzKCcqJywgc3RhdGUpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkU3RhdGUgPSB0aGlzLnByb2dyZXNzKGtleSwgc3RhdGUpID8/IG1hcFN0YXRlO1xuICAgICAgICBpZiAoZmllbGRTdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgKHZhbHVlIGFzIGFueSlba2V5XSA9IHRoaXMucmVjdXJzZSgodmFsdWUgYXMgYW55KVtrZXldLCBmaWVsZFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcm9tIGEgZ2l2ZW4gc3RhdGUsIHJldHVybiB0aGUgc3RhdGUgd2Ugd291bGQgZW5kIHVwIGluIGlmIHdlIGZvbGxvd2VkIHRoaXMgZmllbGRcbiAgICovXG4gIHByaXZhdGUgcHJvZ3Jlc3MoZmllbGQ6IHN0cmluZywgczogU3RhdGVPckNvbnZlcnNpb24gfCB1bmRlZmluZWQpOiBTdGF0ZU9yQ29udmVyc2lvbiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHMgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgcyAhPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnR5cGVNYWNoaW5lW3NdW2ZpZWxkXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2VyY2VWYWx1ZVRvVWludDhBcnJheSh4OiB1bmtub3duKTogVWludDhBcnJheSB8IGFueSB7XG4gIGlmICh4IGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgIHJldHVybiB4O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgeCA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHgudG9TdHJpbmcoKSk7XG4gIH1cblxuICByZXR1cm4geDtcbn1cblxuZnVuY3Rpb24gY29lcmNlVmFsdWVUb051bWJlcih4OiB1bmtub3duKTogbnVtYmVyIHwgYW55IHtcbiAgaWYgKHR5cGVvZiB4ID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB4O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIoeCk7XG4gICAgcmV0dXJuIGlzTmFOKG4pID8geCA6IG47XG4gIH1cblxuICByZXR1cm4geDtcbn0iXX0=