"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSource = void 0;
const source_1 = require("./source");
const source_types_1 = require("./source-types");
/**
 * A `NO_SOURCE` CodeBuild Project Source definition.
 * This is the default source type,
 * if none was specified when creating the Project.
 * *Note*: the `NO_SOURCE` type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 *
 * This class is private to the aws-codebuild package.
 */
class NoSource extends source_1.Source {
    constructor() {
        super({});
        this.type = source_types_1.NO_SOURCE_TYPE;
    }
}
exports.NoSource = NoSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm8tc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFrQztBQUNsQyxpREFBZ0Q7QUFFaEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFNO0lBR2xDO1FBQ0UsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBSEksU0FBSSxHQUFHLDZCQUFjLENBQUM7S0FJckM7Q0FDRjtBQU5ELDRCQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHsgTk9fU09VUkNFX1RZUEUgfSBmcm9tICcuL3NvdXJjZS10eXBlcyc7XG5cbi8qKlxuICogQSBgTk9fU09VUkNFYCBDb2RlQnVpbGQgUHJvamVjdCBTb3VyY2UgZGVmaW5pdGlvbi5cbiAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgc291cmNlIHR5cGUsXG4gKiBpZiBub25lIHdhcyBzcGVjaWZpZWQgd2hlbiBjcmVhdGluZyB0aGUgUHJvamVjdC5cbiAqICpOb3RlKjogdGhlIGBOT19TT1VSQ0VgIHR5cGUgY2Fubm90IGJlIHVzZWQgYXMgYSBzZWNvbmRhcnkgc291cmNlLFxuICogYW5kIGJlY2F1c2Ugb2YgdGhhdCwgeW91J3JlIG5vdCBhbGxvd2VkIHRvIHNwZWNpZnkgYW4gaWRlbnRpZmllciBmb3IgaXQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcml2YXRlIHRvIHRoZSBhd3MtY29kZWJ1aWxkIHBhY2thZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb1NvdXJjZSBleHRlbmRzIFNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gTk9fU09VUkNFX1RZUEU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe30pO1xuICB9XG59XG4iXX0=