"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arguments = void 0;
const cm2_1 = require("./cm2");
class Arguments {
    constructor() {
        this.args = new Array();
    }
    arg(name, type, options = {}) {
        if (options.defaultValue && options.required === true) {
            throw new Error('Cannot pass defaultValue when required=true');
        }
        this.args.push({
            name,
            type,
            required: options.required || options.defaultValue === undefined,
            defaultValue: options.defaultValue,
            summary: options.summary,
        });
        return this;
    }
    render(code) {
        code.add(...cm2_1.interleave(', ', this.args.map(arg => {
            const ret = [arg.name, !arg.required && !arg.defaultValue ? '?' : '', ': ', arg.type];
            if (arg.defaultValue) {
                ret.push(' = ', arg.defaultValue);
            }
            return ret;
        })));
    }
    docBlockLines() {
        return this.args.filter(a => a.summary).map(a => `@param {${a.type}} ${a.name} ${a.summary}`);
    }
    copy() {
        const ret = new Arguments();
        ret.args.push(...this.args);
        return ret;
    }
}
exports.Arguments = Arguments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJndW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJndW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErRDtBQUcvRCxNQUFhLFNBQVM7SUFBdEI7UUFDa0IsU0FBSSxHQUFHLElBQUksS0FBSyxFQUFZLENBQUM7SUFvQy9DLENBQUM7SUFsQ1EsR0FBRyxDQUFDLElBQVksRUFBRSxJQUFXLEVBQUUsVUFBMkIsRUFBRTtRQUNqRSxJQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDYixJQUFJO1lBQ0osSUFBSTtZQUNKLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUztZQUNoRSxZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7WUFDbEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1NBQ3hCLENBQUMsQ0FBQztRQUNKLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvQyxNQUFNLEdBQUcsR0FBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNuQztZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRU0sSUFBSTtRQUNULE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFyQ0QsOEJBcUNDIn0=