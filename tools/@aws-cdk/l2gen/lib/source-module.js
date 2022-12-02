"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalledModule = exports.SourceFile = void 0;
class SourceFile {
    constructor(fileName) {
        this.fileName = fileName;
        this.identifier = fileName;
    }
    static of(x) {
        return typeof x === 'string' ? new SourceFile(x) : x;
    }
    importName(code) {
        return code.relativeImportName(this.fileName);
    }
    equals(rhs) {
        return rhs instanceof SourceFile && this.fileName === rhs.fileName;
    }
}
exports.SourceFile = SourceFile;
class InstalledModule {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.identifier = moduleName;
    }
    importName() {
        return this.moduleName;
    }
    equals(rhs) {
        return rhs instanceof InstalledModule && this.moduleName === rhs.moduleName;
    }
}
exports.InstalledModule = InstalledModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUEsTUFBYSxVQUFVO0lBT3JCLFlBQTRCLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQVJNLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBc0I7UUFDckMsT0FBTyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQVFNLFVBQVUsQ0FBQyxJQUFTO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQWtCO1FBQzlCLE9BQU8sR0FBRyxZQUFZLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDckUsQ0FBQztDQUNGO0FBbEJELGdDQWtCQztBQUVELE1BQWEsZUFBZTtJQUcxQixZQUE0QixVQUFrQjtRQUFsQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFTSxVQUFVO1FBQ2YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBa0I7UUFDOUIsT0FBTyxHQUFHLFlBQVksZUFBZSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUM5RSxDQUFDO0NBQ0Y7QUFkRCwwQ0FjQyJ9