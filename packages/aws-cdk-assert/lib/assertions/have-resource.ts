import { Assertion } from "../assertion";
import { StackInspector } from "../inspector";

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
export function haveResource(resourceType: string, properties?: any) {
    return new HaveResourceAssertion(resourceType, properties);
}

class HaveResourceAssertion extends Assertion<StackInspector> {
    private inspected: any[] = [];

    constructor(private readonly resourceType: string,
                private readonly properties?: any) {
        super();
    }

    public assertUsing(inspector: StackInspector): boolean {
        for (const logicalId of Object.keys(inspector.value.Resources)) {
            const resource = inspector.value.Resources[logicalId];
            if (resource.Type === this.resourceType) {
                this.inspected.push(resource);
                if (isSuperObject(resource.Properties, this.properties)) {
                    return true;
                }
            }
        }

        return false;
    }

    public assertOrThrow(inspector: StackInspector) {
        if (!this.assertUsing(inspector)) {
            throw new Error(`None of ${JSON.stringify(this.inspected, null, 2)} match ${this.description}`);
        }
    }

    public get description(): string {
        // tslint:disable-next-line:max-line-length
        return `resource '${this.resourceType}' with properties ${JSON.stringify(this.properties, undefined, 2)}`;
    }
}

/**
 * Return whether `superObj` is a super-object of `obj`.
 *
 * A super-object has the same or more property values, recursing into nested objects.
 */
function isSuperObject(superObj: any, obj: any): boolean {
    if (obj == null) { return true; }
    if (Array.isArray(superObj) !== Array.isArray(obj)) { return false; }
    if (Array.isArray(superObj)) {
        if (obj.length !== superObj.length) { return false; }

        // Do isSuperObject comparison for individual objects
        for (let i = 0; i < obj.length; i++) {
            if (!isSuperObject(superObj[i], obj[i])) {
                return false;
            }
        }
        return true;
    }
    if ((typeof superObj === 'object') !== (typeof obj === 'object')) { return false; }
    if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            if (!(key in superObj)) { return false; }

            if (!isSuperObject(superObj[key], obj[key])) {
                return false;
            }
        }
        return true;
    }
    return superObj === obj;
}