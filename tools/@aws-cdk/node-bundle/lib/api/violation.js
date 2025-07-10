"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationsReport = exports.ViolationType = void 0;
/**
 * Violation types.
 */
var ViolationType;
(function (ViolationType) {
    /**
     * Circular import on the package or one of its dependencies.
     */
    ViolationType["CIRCULAR_IMPORT"] = "circular-import";
    /**
     * Outdated attributions file.
     */
    ViolationType["OUTDATED_ATTRIBUTIONS"] = "outdated-attributions";
    /**
     * Missing notice file.
     */
    ViolationType["MISSING_NOTICE"] = "missing-notice";
    /**
     * Invalid license.
     */
    ViolationType["INVALID_LICENSE"] = "invalid-license";
    /**
     * No license.
     */
    ViolationType["NO_LICENSE"] = "no-license";
    /**
     * Multiple licenses.
     */
    ViolationType["MULTIPLE_LICENSE"] = "multiple-license";
    /**
     * Missing resource file.
     */
    ViolationType["MISSING_RESOURCE"] = "missing-resource";
})(ViolationType || (exports.ViolationType = ViolationType = {}));
/**
 * Report encapsulating a list of violations.
 */
class ViolationsReport {
    constructor(_violations) {
        this._violations = _violations;
    }
    /**
     * The list of violations.
     */
    get violations() {
        return this._violations;
    }
    /**
     * True when no violations exist. False otherwise.
     */
    get success() {
        return this.violations.length === 0;
    }
    /**
     * Summary of the violation in the report.
     */
    get summary() {
        const summary = [
            `${this._violations.length} violations detected`,
        ];
        for (const v of this._violations) {
            summary.push(`- ${v.type}: ${v.message}${v.fix ? ' (fixable)' : ''}`);
        }
        return summary.join('\n');
    }
}
exports.ViolationsReport = ViolationsReport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlvbGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS92aW9sYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxJQUFZLGFBcUNYO0FBckNELFdBQVksYUFBYTtJQUV2Qjs7T0FFRztJQUNILG9EQUFtQyxDQUFBO0lBRW5DOztPQUVHO0lBQ0gsZ0VBQStDLENBQUE7SUFFL0M7O09BRUc7SUFDSCxrREFBaUMsQ0FBQTtJQUVqQzs7T0FFRztJQUNILG9EQUFtQyxDQUFBO0lBRW5DOztPQUVHO0lBQ0gsMENBQXlCLENBQUE7SUFFekI7O09BRUc7SUFDSCxzREFBcUMsQ0FBQTtJQUVyQzs7T0FFRztJQUNILHNEQUFxQyxDQUFBO0FBRXZDLENBQUMsRUFyQ1csYUFBYSw2QkFBYixhQUFhLFFBcUN4QjtBQXFCRDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBRTNCLFlBQTZCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUcsQ0FBQztJQUV6RDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsT0FBTztRQUNoQixNQUFNLE9BQU8sR0FBRztZQUNkLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLHNCQUFzQjtTQUNqRCxDQUFDO1FBQ0YsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBRUY7QUEvQkQsNENBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBWaW9sYXRpb24gdHlwZXMuXG4gKi9cbmV4cG9ydCBlbnVtIFZpb2xhdGlvblR5cGUge1xuXG4gIC8qKlxuICAgKiBDaXJjdWxhciBpbXBvcnQgb24gdGhlIHBhY2thZ2Ugb3Igb25lIG9mIGl0cyBkZXBlbmRlbmNpZXMuXG4gICAqL1xuICBDSVJDVUxBUl9JTVBPUlQgPSAnY2lyY3VsYXItaW1wb3J0JyxcblxuICAvKipcbiAgICogT3V0ZGF0ZWQgYXR0cmlidXRpb25zIGZpbGUuXG4gICAqL1xuICBPVVREQVRFRF9BVFRSSUJVVElPTlMgPSAnb3V0ZGF0ZWQtYXR0cmlidXRpb25zJyxcblxuICAvKipcbiAgICogTWlzc2luZyBub3RpY2UgZmlsZS5cbiAgICovXG4gIE1JU1NJTkdfTk9USUNFID0gJ21pc3Npbmctbm90aWNlJyxcblxuICAvKipcbiAgICogSW52YWxpZCBsaWNlbnNlLlxuICAgKi9cbiAgSU5WQUxJRF9MSUNFTlNFID0gJ2ludmFsaWQtbGljZW5zZScsXG5cbiAgLyoqXG4gICAqIE5vIGxpY2Vuc2UuXG4gICAqL1xuICBOT19MSUNFTlNFID0gJ25vLWxpY2Vuc2UnLFxuXG4gIC8qKlxuICAgKiBNdWx0aXBsZSBsaWNlbnNlcy5cbiAgICovXG4gIE1VTFRJUExFX0xJQ0VOU0UgPSAnbXVsdGlwbGUtbGljZW5zZScsXG5cbiAgLyoqXG4gICAqIE1pc3NpbmcgcmVzb3VyY2UgZmlsZS5cbiAgICovXG4gIE1JU1NJTkdfUkVTT1VSQ0UgPSAnbWlzc2luZy1yZXNvdXJjZScsXG5cbn1cblxuLyoqXG4gKiBBIHZhbGlkYXRpb24gdmlvbGF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZpb2xhdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgdmlvbGF0aW9uIHR5cGUuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBWaW9sYXRpb25UeXBlO1xuICAvKipcbiAgICogVGhlIHZpb2xhdGlvbiBtZXNzYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuICAvKipcbiAgICogQSBmaXhlciBmdW5jdGlvbi5cbiAgICogSWYgdW5kZWZpbmVkLCB0aGlzIHZpb2xhdGlvbiBjYW5ub3QgYmUgZml4ZWQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIHJlYWRvbmx5IGZpeD86ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogUmVwb3J0IGVuY2Fwc3VsYXRpbmcgYSBsaXN0IG9mIHZpb2xhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBWaW9sYXRpb25zUmVwb3J0IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF92aW9sYXRpb25zOiBWaW9sYXRpb25bXSkge31cblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgdmlvbGF0aW9ucy5cbiAgICovXG4gIHB1YmxpYyBnZXQgdmlvbGF0aW9ucygpOiByZWFkb25seSBWaW9sYXRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpb2xhdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSB3aGVuIG5vIHZpb2xhdGlvbnMgZXhpc3QuIEZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgc3VjY2VzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy52aW9sYXRpb25zLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdW1tYXJ5IG9mIHRoZSB2aW9sYXRpb24gaW4gdGhlIHJlcG9ydC5cbiAgICovXG4gIHB1YmxpYyBnZXQgc3VtbWFyeSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBbXG4gICAgICBgJHt0aGlzLl92aW9sYXRpb25zLmxlbmd0aH0gdmlvbGF0aW9ucyBkZXRlY3RlZGAsXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdGhpcy5fdmlvbGF0aW9ucykge1xuICAgICAgc3VtbWFyeS5wdXNoKGAtICR7di50eXBlfTogJHt2Lm1lc3NhZ2V9JHt2LmZpeCA/ICcgKGZpeGFibGUpJyA6ICcnfWApO1xuICAgIH1cbiAgICByZXR1cm4gc3VtbWFyeS5qb2luKCdcXG4nKTtcbiAgfVxuXG59XG4iXX0=