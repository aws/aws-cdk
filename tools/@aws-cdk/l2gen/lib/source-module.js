"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalledModule = exports.SourceFile = void 0;
const path = require("path");
class SourceFile {
    constructor(fileName) {
        this.fileName = fileName;
        this.identifier = fileName;
    }
    importName(code) {
        const relativePath = path.posix.relative(path.dirname(code.currentModule.fileName), this.fileName).replace(/\.ts$/, '');
        return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBUzdCLE1BQWEsVUFBVTtJQUdyQixZQUE0QixRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFTSxVQUFVLENBQUMsSUFBUztRQUN6QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEgsT0FBTyxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFLENBQUM7SUFDN0UsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFrQjtRQUM5QixPQUFPLEdBQUcsWUFBWSxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JFLENBQUM7Q0FDRjtBQWZELGdDQWVDO0FBRUQsTUFBYSxlQUFlO0lBRzFCLFlBQTRCLFVBQWtCO1FBQWxCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVNLFVBQVU7UUFDZixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFrQjtRQUM5QixPQUFPLEdBQUcsWUFBWSxlQUFlLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQzlFLENBQUM7Q0FDRjtBQWRELDBDQWNDIn0=