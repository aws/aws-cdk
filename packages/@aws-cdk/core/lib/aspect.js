"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aspects = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IAspect(aspect);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.add);
            }
            throw error;
        }
        this._aspects.push(aspect);
    }
    /**
     * The list of aspects which were directly applied on this scope.
     */
    get all() {
        return [...this._aspects];
    }
}
_a = JSII_RTTI_SYMBOL_1;
Aspects[_a] = { fqn: "@aws-cdk/core.Aspects", version: "0.0.0" };
exports.Aspects = Aspects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFZakQ7OztHQUdHO0FBQ0gsTUFBYSxPQUFPO0lBQ2xCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsSUFBSSxPQUFPLEdBQUksS0FBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUV4QixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzNDLEtBQUssRUFBRSxPQUFPO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBSUQ7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjtJQUVEOzs7T0FHRztJQUNJLEdBQUcsQ0FBQyxNQUFlOzs7Ozs7Ozs7O1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVCO0lBRUQ7O09BRUc7SUFDSCxJQUFXLEdBQUc7UUFDWixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDM0I7Ozs7QUF0Q1UsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmNvbnN0IEFTUEVDVFNfU1lNQk9MID0gU3ltYm9sLmZvcignY2RrLWFzcGVjdHMnKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIEFzcGVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBc3BlY3Qge1xuICAvKipcbiAgICogQWxsIGFzcGVjdHMgY2FuIHZpc2l0IGFuIElDb25zdHJ1Y3RcbiAgICovXG4gIHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpOiB2b2lkO1xufVxuXG4vKipcbiAqIEFzcGVjdHMgY2FuIGJlIGFwcGxpZWQgdG8gQ0RLIHRyZWUgc2NvcGVzIGFuZCBjYW4gb3BlcmF0ZSBvbiB0aGUgdHJlZSBiZWZvcmVcbiAqIHN5bnRoZXNpcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzcGVjdHMge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgYEFzcGVjdHNgIG9iamVjdCBhc3NvY2lhdGVkIHdpdGggYSBjb25zdHJ1Y3Qgc2NvcGUuXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgc2NvcGUgZm9yIHdoaWNoIHRoZXNlIGFzcGVjdHMgd2lsbCBhcHBseS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2Yoc2NvcGU6IElDb25zdHJ1Y3QpOiBBc3BlY3RzIHtcbiAgICBsZXQgYXNwZWN0cyA9IChzY29wZSBhcyBhbnkpW0FTUEVDVFNfU1lNQk9MXTtcbiAgICBpZiAoIWFzcGVjdHMpIHtcbiAgICAgIGFzcGVjdHMgPSBuZXcgQXNwZWN0cygpO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NvcGUsIEFTUEVDVFNfU1lNQk9MLCB7XG4gICAgICAgIHZhbHVlOiBhc3BlY3RzLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXNwZWN0cztcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FzcGVjdHM6IElBc3BlY3RbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2FzcGVjdHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGFzcGVjdCB0byBhcHBseSB0aGlzIHNjb3BlIGJlZm9yZSBzeW50aGVzaXMuXG4gICAqIEBwYXJhbSBhc3BlY3QgVGhlIGFzcGVjdCB0byBhZGQuXG4gICAqL1xuICBwdWJsaWMgYWRkKGFzcGVjdDogSUFzcGVjdCkge1xuICAgIHRoaXMuX2FzcGVjdHMucHVzaChhc3BlY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGFzcGVjdHMgd2hpY2ggd2VyZSBkaXJlY3RseSBhcHBsaWVkIG9uIHRoaXMgc2NvcGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGFsbCgpOiBJQXNwZWN0W10ge1xuICAgIHJldHVybiBbLi4udGhpcy5fYXNwZWN0c107XG4gIH1cbn0iXX0=