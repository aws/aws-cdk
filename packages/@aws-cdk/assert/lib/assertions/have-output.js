"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haveOutput = void 0;
const assertion_1 = require("../assertion");
class HaveOutputAssertion extends assertion_1.JestFriendlyAssertion {
    constructor(outputName, exportName, outputValue) {
        super();
        this.outputName = outputName;
        this.exportName = exportName;
        this.outputValue = outputValue;
        this.inspected = [];
        if (!this.outputName && !this.exportName) {
            throw new Error('At least one of [outputName, exportName] should be provided');
        }
    }
    get description() {
        const descriptionPartsArray = new Array();
        if (this.outputName) {
            descriptionPartsArray.push(`name '${this.outputName}'`);
        }
        if (this.exportName) {
            descriptionPartsArray.push(`export name ${JSON.stringify(this.exportName)}`);
        }
        if (this.outputValue) {
            descriptionPartsArray.push(`value ${JSON.stringify(this.outputValue)}`);
        }
        return 'output with ' + descriptionPartsArray.join(', ');
    }
    assertUsing(inspector) {
        if (!('Outputs' in inspector.value)) {
            return false;
        }
        for (const [name, props] of Object.entries(inspector.value.Outputs)) {
            const mismatchedFields = new Array();
            if (this.outputName && name !== this.outputName) {
                mismatchedFields.push('name');
            }
            if (this.exportName && JSON.stringify(this.exportName) !== JSON.stringify(props.Export?.Name)) {
                mismatchedFields.push('export name');
            }
            if (this.outputValue && JSON.stringify(this.outputValue) !== JSON.stringify(props.Value)) {
                mismatchedFields.push('value');
            }
            if (mismatchedFields.length === 0) {
                return true;
            }
            this.inspected.push({
                output: { [name]: props },
                failureReason: `mismatched ${mismatchedFields.join(', ')}`,
            });
        }
        return false;
    }
    generateErrorMessage() {
        const lines = new Array();
        lines.push(`None of ${this.inspected.length} outputs matches ${this.description}.`);
        for (const inspected of this.inspected) {
            lines.push(`- ${inspected.failureReason} in:`);
            lines.push(indent(4, JSON.stringify(inspected.output, null, 2)));
        }
        return lines.join('\n');
    }
}
/**
 * An assertion  to check whether Output with particular properties is present in a stack
 * @param props  properties of the Output that is being asserted against.
 *               Check ``HaveOutputProperties`` interface to get full list of available parameters
 */
function haveOutput(props) {
    return new HaveOutputAssertion(props.outputName, props.exportName, props.outputValue);
}
exports.haveOutput = haveOutput;
function indent(n, s) {
    const prefix = ' '.repeat(n);
    return prefix + s.replace(/\n/g, '\n' + prefix);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF2ZS1vdXRwdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoYXZlLW91dHB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBcUQ7QUFHckQsTUFBTSxtQkFBb0IsU0FBUSxpQ0FBcUM7SUFHckUsWUFBNkIsVUFBbUIsRUFBbUIsVUFBZ0IsRUFBVSxXQUFpQjtRQUM1RyxLQUFLLEVBQUUsQ0FBQztRQURtQixlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQW1CLGVBQVUsR0FBVixVQUFVLENBQU07UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBTTtRQUY3RixjQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUluRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1NBQ2hGO0lBQ0gsQ0FBQztJQUVELElBQVcsV0FBVztRQUNwQixNQUFNLHFCQUFxQixHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFFbEQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLHFCQUFxQixDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekU7UUFFRCxPQUFPLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7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eUFzc2VydGlvbiB9IGZyb20gJy4uL2Fzc2VydGlvbic7XG5pbXBvcnQgeyBTdGFja0luc3BlY3RvciB9IGZyb20gJy4uL2luc3BlY3Rvcic7XG5cbmNsYXNzIEhhdmVPdXRwdXRBc3NlcnRpb24gZXh0ZW5kcyBKZXN0RnJpZW5kbHlBc3NlcnRpb248U3RhY2tJbnNwZWN0b3I+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBpbnNwZWN0ZWQ6IEluc3BlY3Rpb25GYWlsdXJlW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dHB1dE5hbWU/OiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgZXhwb3J0TmFtZT86IGFueSwgcHJpdmF0ZSBvdXRwdXRWYWx1ZT86IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKCF0aGlzLm91dHB1dE5hbWUgJiYgIXRoaXMuZXhwb3J0TmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgb2YgW291dHB1dE5hbWUsIGV4cG9ydE5hbWVdIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvblBhcnRzQXJyYXkgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgaWYgKHRoaXMub3V0cHV0TmFtZSkge1xuICAgICAgZGVzY3JpcHRpb25QYXJ0c0FycmF5LnB1c2goYG5hbWUgJyR7dGhpcy5vdXRwdXROYW1lfSdgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXhwb3J0TmFtZSkge1xuICAgICAgZGVzY3JpcHRpb25QYXJ0c0FycmF5LnB1c2goYGV4cG9ydCBuYW1lICR7SlNPTi5zdHJpbmdpZnkodGhpcy5leHBvcnROYW1lKX1gKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3V0cHV0VmFsdWUpIHtcbiAgICAgIGRlc2NyaXB0aW9uUGFydHNBcnJheS5wdXNoKGB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHRoaXMub3V0cHV0VmFsdWUpfWApO1xuICAgIH1cblxuICAgIHJldHVybiAnb3V0cHV0IHdpdGggJyArIGRlc2NyaXB0aW9uUGFydHNBcnJheS5qb2luKCcsICcpO1xuICB9XG5cbiAgcHVibGljIGFzc2VydFVzaW5nKGluc3BlY3RvcjogU3RhY2tJbnNwZWN0b3IpOiBib29sZWFuIHtcbiAgICBpZiAoISgnT3V0cHV0cycgaW4gaW5zcGVjdG9yLnZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgW25hbWUsIHByb3BzXSBvZiBPYmplY3QuZW50cmllcyhpbnNwZWN0b3IudmFsdWUuT3V0cHV0cyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KSkge1xuICAgICAgY29uc3QgbWlzbWF0Y2hlZEZpZWxkcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgIGlmICh0aGlzLm91dHB1dE5hbWUgJiYgbmFtZSAhPT0gdGhpcy5vdXRwdXROYW1lKSB7XG4gICAgICAgIG1pc21hdGNoZWRGaWVsZHMucHVzaCgnbmFtZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5leHBvcnROYW1lICYmIEpTT04uc3RyaW5naWZ5KHRoaXMuZXhwb3J0TmFtZSkgIT09IEpTT04uc3RyaW5naWZ5KHByb3BzLkV4cG9ydD8uTmFtZSkpIHtcbiAgICAgICAgbWlzbWF0Y2hlZEZpZWxkcy5wdXNoKCdleHBvcnQgbmFtZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vdXRwdXRWYWx1ZSAmJiBKU09OLnN0cmluZ2lmeSh0aGlzLm91dHB1dFZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkocHJvcHMuVmFsdWUpKSB7XG4gICAgICAgIG1pc21hdGNoZWRGaWVsZHMucHVzaCgndmFsdWUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1pc21hdGNoZWRGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluc3BlY3RlZC5wdXNoKHtcbiAgICAgICAgb3V0cHV0OiB7IFtuYW1lXTogcHJvcHMgfSxcbiAgICAgICAgZmFpbHVyZVJlYXNvbjogYG1pc21hdGNoZWQgJHttaXNtYXRjaGVkRmllbGRzLmpvaW4oJywgJyl9YCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBnZW5lcmF0ZUVycm9yTWVzc2FnZSgpIHtcbiAgICBjb25zdCBsaW5lcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICBsaW5lcy5wdXNoKGBOb25lIG9mICR7dGhpcy5pbnNwZWN0ZWQubGVuZ3RofSBvdXRwdXRzIG1hdGNoZXMgJHt0aGlzLmRlc2NyaXB0aW9ufS5gKTtcblxuICAgIGZvciAoY29uc3QgaW5zcGVjdGVkIG9mIHRoaXMuaW5zcGVjdGVkKSB7XG4gICAgICBsaW5lcy5wdXNoKGAtICR7aW5zcGVjdGVkLmZhaWx1cmVSZWFzb259IGluOmApO1xuICAgICAgbGluZXMucHVzaChpbmRlbnQoNCwgSlNPTi5zdHJpbmdpZnkoaW5zcGVjdGVkLm91dHB1dCwgbnVsbCwgMikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGhhdmVPdXRwdXQgZnVuY3Rpb24gcHJvcGVydGllc1xuICogTk9URSB0aGF0IGF0IGxlYXN0IG9uZSBvZiBbb3V0cHV0TmFtZSwgZXhwb3J0TmFtZV0gc2hvdWxkIGJlIHByb3ZpZGVkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGF2ZU91dHB1dFByb3BlcnRpZXMge1xuICAvKipcbiAgICogTG9naWNhbCBJRCBvZiB0aGUgb3V0cHV0XG4gICAqIEBkZWZhdWx0IC0gdGhlIGxvZ2ljYWwgSUQgb2YgdGhlIG91dHB1dCB3aWxsIG5vdCBiZSBjaGVja2VkXG4gICAqL1xuICBvdXRwdXROYW1lPzogc3RyaW5nO1xuICAvKipcbiAgICogRXhwb3J0IG5hbWUgb2YgdGhlIG91dHB1dCwgd2hlbiBpdCdzIGV4cG9ydGVkIGZvciBjcm9zcy1zdGFjayByZWZlcmVuY2luZ1xuICAgKiBAZGVmYXVsdCAtIHRoZSBleHBvcnQgbmFtZSBpcyBub3QgcmVxdWlyZWQgYW5kIHdpbGwgbm90IGJlIGNoZWNrZWRcbiAgICovXG4gIGV4cG9ydE5hbWU/OiBhbnk7XG4gIC8qKlxuICAgKiBWYWx1ZSBvZiB0aGUgb3V0cHV0O1xuICAgKiBAZGVmYXVsdCAtIHRoZSB2YWx1ZSB3aWxsIG5vdCBiZSBjaGVja2VkXG4gICAqL1xuICBvdXRwdXRWYWx1ZT86IGFueTtcbn1cblxuaW50ZXJmYWNlIEluc3BlY3Rpb25GYWlsdXJlIHtcbiAgb3V0cHV0OiBhbnk7XG4gIGZhaWx1cmVSZWFzb246IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBhc3NlcnRpb24gIHRvIGNoZWNrIHdoZXRoZXIgT3V0cHV0IHdpdGggcGFydGljdWxhciBwcm9wZXJ0aWVzIGlzIHByZXNlbnQgaW4gYSBzdGFja1xuICogQHBhcmFtIHByb3BzICBwcm9wZXJ0aWVzIG9mIHRoZSBPdXRwdXQgdGhhdCBpcyBiZWluZyBhc3NlcnRlZCBhZ2FpbnN0LlxuICogICAgICAgICAgICAgICBDaGVjayBgYEhhdmVPdXRwdXRQcm9wZXJ0aWVzYGAgaW50ZXJmYWNlIHRvIGdldCBmdWxsIGxpc3Qgb2YgYXZhaWxhYmxlIHBhcmFtZXRlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVPdXRwdXQocHJvcHM6IEhhdmVPdXRwdXRQcm9wZXJ0aWVzKTogSmVzdEZyaWVuZGx5QXNzZXJ0aW9uPFN0YWNrSW5zcGVjdG9yPiB7XG4gIHJldHVybiBuZXcgSGF2ZU91dHB1dEFzc2VydGlvbihwcm9wcy5vdXRwdXROYW1lLCBwcm9wcy5leHBvcnROYW1lLCBwcm9wcy5vdXRwdXRWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGluZGVudChuOiBudW1iZXIsIHM6IHN0cmluZykge1xuICBjb25zdCBwcmVmaXggPSAnICcucmVwZWF0KG4pO1xuICByZXR1cm4gcHJlZml4ICsgcy5yZXBsYWNlKC9cXG4vZywgJ1xcbicgKyBwcmVmaXgpO1xufVxuIl19