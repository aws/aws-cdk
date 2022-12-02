"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.litVal = exports.objLit = exports.ObjectLiteral = void 0;
const type_1 = require("./type");
class ObjectLiteral {
    constructor(type = type_1.ANY) {
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
function litVal(x, type = type_1.ANY) {
    return {
        type,
        render(code) {
            if (Array.isArray(x)) {
                code.add(...x);
            }
            else {
                code.add(x);
            }
        },
        toString: () => `${x}`,
    };
}
exports.litVal = litVal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBb0M7QUFRcEMsTUFBYSxhQUFhO0lBR3hCLFlBQTRCLE9BQWMsVUFBRztRQUFqQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBRjVCLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUdwRCxDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQVcsRUFBRSxLQUFhO1FBQ3BDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNoRDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sR0FBRyxDQUFDLE1BQW1DO1FBQzVDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBVSxFQUFFLEtBQVksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVNLEdBQUcsQ0FBQyxLQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLFFBQVE7UUFDYixPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBUztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQXJDRCxzQ0FxQ0M7QUFFRCxTQUFnQixNQUFNLENBQUMsRUFBK0I7SUFDcEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1YsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBSkQsd0JBSUM7QUFFRCxTQUFnQixNQUFNLENBQUMsQ0FBd0IsRUFBRSxPQUFjLFVBQUc7SUFDaEUsT0FBTztRQUNMLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSTtZQUNULElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDYjtRQUNILENBQUM7UUFDRCxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7S0FDdkIsQ0FBQztBQUNKLENBQUM7QUFaRCx3QkFZQyJ9