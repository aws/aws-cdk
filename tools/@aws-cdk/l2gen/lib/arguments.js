"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arguments = void 0;
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
        });
        return this;
    }
    render(code) {
        let first = true;
        for (const arg of this.args) {
            if (!first) {
                code.add(', ');
            }
            first = false;
            code.add(arg.name, !arg.required && !arg.defaultValue ? '?' : '', ': ', arg.type);
            if (arg.defaultValue) {
                code.add(' = ', arg.defaultValue);
            }
        }
    }
    copy() {
        const ret = new Arguments();
        ret.args.push(...this.args);
        return ret;
    }
}
exports.Arguments = Arguments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJndW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJndW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLE1BQWEsU0FBUztJQUF0QjtRQUNtQixTQUFJLEdBQUcsSUFBSSxLQUFLLEVBQVksQ0FBQztJQWtDaEQsQ0FBQztJQWhDUSxHQUFHLENBQUMsSUFBWSxFQUFFLElBQVcsRUFBRSxVQUEyQixFQUFFO1FBQ2pFLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtZQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNiLElBQUk7WUFDSixJQUFJO1lBQ0osUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxTQUFTO1lBQ2hFLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtTQUNsQyxDQUFDLENBQUM7UUFDSixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBUztRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzNCLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUFFO1lBQy9CLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFZCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNuQztTQUNGO0lBQ0gsQ0FBQztJQUVNLElBQUk7UUFDVCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBbkNELDhCQW1DQyJ9