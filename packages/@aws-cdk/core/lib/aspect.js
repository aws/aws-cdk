"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aspects = void 0;
const ASPECTS_SYMBOL = Symbol.for('cdk-aspects');
/**
 * Aspects can be applied to CDK tree scopes and can operate on the tree before
 * synthesis.
 */
class Aspects {
    /**
     * Returns the `Aspects` object associated with a construct scope.
     * @param scope The scope for which these aspects will apply.
     */
    static of(scope) {
        let aspects = scope[ASPECTS_SYMBOL];
        if (!aspects) {
            aspects = new Aspects();
            Object.defineProperty(scope, ASPECTS_SYMBOL, {
                value: aspects,
                configurable: false,
                enumerable: false,
            });
        }
        return aspects;
    }
    constructor() {
        this._aspects = [];
    }
    /**
     * Adds an aspect to apply this scope before synthesis.
     * @param aspect The aspect to add.
     */
    add(aspect) {
        this._aspects.push(aspect);
    }
    /**
     * The list of aspects which were directly applied on this scope.
     */
    get all() {
        return [...this._aspects];
    }
}
exports.Aspects = Aspects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFZakQ7OztHQUdHO0FBQ0gsTUFBYSxPQUFPO0lBQ2xCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsSUFBSSxPQUFPLEdBQUksS0FBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUV4QixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzNDLEtBQUssRUFBRSxPQUFPO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFJRDtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxHQUFHLENBQUMsTUFBZTtRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLEdBQUc7UUFDWixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBdkNELDBCQXVDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuY29uc3QgQVNQRUNUU19TWU1CT0wgPSBTeW1ib2wuZm9yKCdjZGstYXNwZWN0cycpO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gQXNwZWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFzcGVjdCB7XG4gIC8qKlxuICAgKiBBbGwgYXNwZWN0cyBjYW4gdmlzaXQgYW4gSUNvbnN0cnVjdFxuICAgKi9cbiAgdmlzaXQobm9kZTogSUNvbnN0cnVjdCk6IHZvaWQ7XG59XG5cbi8qKlxuICogQXNwZWN0cyBjYW4gYmUgYXBwbGllZCB0byBDREsgdHJlZSBzY29wZXMgYW5kIGNhbiBvcGVyYXRlIG9uIHRoZSB0cmVlIGJlZm9yZVxuICogc3ludGhlc2lzLlxuICovXG5leHBvcnQgY2xhc3MgQXNwZWN0cyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgQXNwZWN0c2Agb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCBhIGNvbnN0cnVjdCBzY29wZS5cbiAgICogQHBhcmFtIHNjb3BlIFRoZSBzY29wZSBmb3Igd2hpY2ggdGhlc2UgYXNwZWN0cyB3aWxsIGFwcGx5LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihzY29wZTogSUNvbnN0cnVjdCk6IEFzcGVjdHMge1xuICAgIGxldCBhc3BlY3RzID0gKHNjb3BlIGFzIGFueSlbQVNQRUNUU19TWU1CT0xdO1xuICAgIGlmICghYXNwZWN0cykge1xuICAgICAgYXNwZWN0cyA9IG5ldyBBc3BlY3RzKCk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzY29wZSwgQVNQRUNUU19TWU1CT0wsIHtcbiAgICAgICAgdmFsdWU6IGFzcGVjdHMsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhc3BlY3RzO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfYXNwZWN0czogSUFzcGVjdFtdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fYXNwZWN0cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gYXNwZWN0IHRvIGFwcGx5IHRoaXMgc2NvcGUgYmVmb3JlIHN5bnRoZXNpcy5cbiAgICogQHBhcmFtIGFzcGVjdCBUaGUgYXNwZWN0IHRvIGFkZC5cbiAgICovXG4gIHB1YmxpYyBhZGQoYXNwZWN0OiBJQXNwZWN0KSB7XG4gICAgdGhpcy5fYXNwZWN0cy5wdXNoKGFzcGVjdCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgYXNwZWN0cyB3aGljaCB3ZXJlIGRpcmVjdGx5IGFwcGxpZWQgb24gdGhpcyBzY29wZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgYWxsKCk6IElBc3BlY3RbXSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl9hc3BlY3RzXTtcbiAgfVxufSJdfQ==