"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linter_1 = require("../linter");
exports.exportsLinter = new linter_1.Linter(assembly => assembly.types);
exports.exportsLinter.add({
    code: 'no-export',
    message: 'the "export" methods are deprecated',
    eval: e => {
        if (e.ctx.isClassType() || e.ctx.isInterfaceType()) {
            e.assert(!e.ctx.allMethods.some(m => m.name === 'export'), e.ctx.fqn);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUM7QUFFdEIsUUFBQSxhQUFhLEdBQUcsSUFBSSxlQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFcEUscUJBQWEsQ0FBQyxHQUFHLENBQUM7SUFDaEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsT0FBTyxFQUFFLHFDQUFxQztJQUM5QyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDUixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUNsRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpbnRlciB9IGZyb20gJy4uL2xpbnRlcic7XG5cbmV4cG9ydCBjb25zdCBleHBvcnRzTGludGVyID0gbmV3IExpbnRlcihhc3NlbWJseSA9PiBhc3NlbWJseS50eXBlcyk7XG5cbmV4cG9ydHNMaW50ZXIuYWRkKHtcbiAgY29kZTogJ25vLWV4cG9ydCcsXG4gIG1lc3NhZ2U6ICd0aGUgXCJleHBvcnRcIiBtZXRob2RzIGFyZSBkZXByZWNhdGVkJyxcbiAgZXZhbDogZSA9PiB7XG4gICAgaWYgKGUuY3R4LmlzQ2xhc3NUeXBlKCkgfHwgZS5jdHguaXNJbnRlcmZhY2VUeXBlKCkpIHtcbiAgICAgIGUuYXNzZXJ0KCFlLmN0eC5hbGxNZXRob2RzLnNvbWUobSA9PiBtLm5hbWUgPT09ICdleHBvcnQnKSwgZS5jdHguZnFuKTtcbiAgICB9XG4gIH1cbn0pOyJdfQ==