"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeListener = void 0;
class FakeListener {
    constructor(doAbort = false) {
        this.doAbort = doAbort;
        this.types = new Array();
        this.messages = new Array();
    }
    onPublishEvent(_type, event) {
        this.messages.push(event.message);
        if (this.doAbort) {
            event.abort();
        }
    }
}
exports.FakeListener = FakeListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1saXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZha2UtbGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxZQUFZO0lBSXZCLFlBQTZCLFVBQVUsS0FBSztRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFINUIsVUFBSyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFDL0IsYUFBUSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFHL0MsQ0FBQztJQUVNLGNBQWMsQ0FBQyxLQUFnQixFQUFFLEtBQXVCO1FBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWRELG9DQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVB1Ymxpc2hQcm9ncmVzc0xpc3RlbmVyLCBFdmVudFR5cGUsIElQdWJsaXNoUHJvZ3Jlc3MgfSBmcm9tICcuLi9saWIvcHJvZ3Jlc3MnO1xuXG5leHBvcnQgY2xhc3MgRmFrZUxpc3RlbmVyIGltcGxlbWVudHMgSVB1Ymxpc2hQcm9ncmVzc0xpc3RlbmVyIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGVzID0gbmV3IEFycmF5PEV2ZW50VHlwZT4oKTtcbiAgcHVibGljIHJlYWRvbmx5IG1lc3NhZ2VzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRvQWJvcnQgPSBmYWxzZSkge1xuICB9XG5cbiAgcHVibGljIG9uUHVibGlzaEV2ZW50KF90eXBlOiBFdmVudFR5cGUsIGV2ZW50OiBJUHVibGlzaFByb2dyZXNzKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlcy5wdXNoKGV2ZW50Lm1lc3NhZ2UpO1xuXG4gICAgaWYgKHRoaXMuZG9BYm9ydCkge1xuICAgICAgZXZlbnQuYWJvcnQoKTtcbiAgICB9XG4gIH1cbn0iXX0=