"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
function enumerable(value) {
    return function (_target, _propertyKey, descriptor) {
        descriptor.enumerable = value;
    };
}
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    greet() {
        return 'Hello, ' + this.greeting;
    }
}
__decorate([
    enumerable(false)
], Greeter.prototype, "greet", null);
async function handler() {
    const message = new Greeter('World').greet();
    console.log(message); // eslint-disable-line no-console
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHMtZGVjb3JhdG9yLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cy1kZWNvcmF0b3ItaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxTQUFTLFVBQVUsQ0FBQyxLQUFjO0lBQ2hDLE9BQU8sVUFBVSxPQUFZLEVBQUUsWUFBb0IsRUFBRSxVQUE4QjtRQUNqRixVQUFVLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxPQUFPO0lBRVgsWUFBWSxPQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFHRCxLQUFLO1FBQ0gsT0FBTyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0NBQ0Y7QUFIQztJQURDLFVBQVUsQ0FBQyxLQUFLLENBQUM7b0NBR2pCO0FBSUksS0FBSyxVQUFVLE9BQU87SUFDM0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztBQUN6RCxDQUFDO0FBSEQsMEJBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBlbnVtZXJhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoX3RhcmdldDogYW55LCBfcHJvcGVydHlLZXk6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gdmFsdWU7XG4gIH07XG59XG5cbmNsYXNzIEdyZWV0ZXIge1xuICBncmVldGluZzogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmdyZWV0aW5nID0gbWVzc2FnZTtcbiAgfVxuXG4gIEBlbnVtZXJhYmxlKGZhbHNlKVxuICBncmVldCgpIHtcbiAgICByZXR1cm4gJ0hlbGxvLCAnICsgdGhpcy5ncmVldGluZztcbiAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtZXNzYWdlID0gbmV3IEdyZWV0ZXIoJ1dvcmxkJykuZ3JlZXQoKTtcbiAgY29uc29sZS5sb2cobWVzc2FnZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxufVxuIl19