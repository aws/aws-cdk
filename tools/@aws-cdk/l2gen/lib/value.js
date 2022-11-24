"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objLit = exports.ObjectLiteral = void 0;
const well_known_types_1 = require("./well-known-types");
class ObjectLiteral {
    constructor(type = well_known_types_1.ANY) {
        this.type = type;
        this.fields = new Map();
    }
    set1(key, value) {
        if (this.fields.has(key)) {
            throw new Error(`Already has a value: ${key}`);
        }
        this.fields.set(key, value);
    }
    set(fields) {
        for (const [key, value] of Object.entries(fields)) {
            this.set1(key, value);
        }
    }
    has(field) {
        return this.fields.has(field);
    }
    toString() {
        return '{...object...}';
    }
    render(code) {
        code.indent('  ');
        code.write('{\n');
        for (const [k, v] of this.fields.entries()) {
            code.add(k, `: `, v, ',\n');
        }
        code.unindent();
        code.write('}');
    }
}
exports.ObjectLiteral = ObjectLiteral;
function objLit(xs) {
    const x = new ObjectLiteral();
    x.set(xs);
    return x;
}
exports.objLit = objLit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx5REFBeUM7QUFPekMsTUFBYSxhQUFhO0lBR3hCLFlBQTRCLE9BQWMsc0JBQUc7UUFBakIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUY1QixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFHcEQsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFXLEVBQUUsS0FBYTtRQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDaEQ7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLEdBQUcsQ0FBQyxNQUE4QjtRQUN2QyxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQVUsRUFBRSxLQUFZLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTSxHQUFHLENBQUMsS0FBYTtRQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQVM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUFyQ0Qsc0NBcUNDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLEVBQTBCO0lBQy9DLE1BQU0sQ0FBQyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7SUFDOUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNWLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUpELHdCQUlDIn0=