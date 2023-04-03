"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
// Remove this file in v2
test('overridden method on stack gets called', () => {
    let called = false;
    class MyStack extends lib_1.Stack {
        addFileAsset(asset) {
            called = true;
            return super.addFileAsset(asset);
        }
    }
    const stack = new MyStack(undefined, 'Stack', {
        synthesizer: new lib_1.LegacyStackSynthesizer(),
    });
    stack.synthesizer.addFileAsset({
        fileName: __filename,
        packaging: lib_1.FileAssetPackaging.FILE,
        sourceHash: 'file-asset-hash',
    });
    expect(called).toEqual(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2xkLXN0eWxlLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2xkLXN0eWxlLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQStGO0FBRS9GLHlCQUF5QjtBQUN6QixJQUFJLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO0lBQ2xELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUVuQixNQUFNLE9BQVEsU0FBUSxXQUFLO1FBQ2xCLFlBQVksQ0FBQyxLQUFzQjtZQUN4QyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2QsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDRjtJQUVELE1BQU0sS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7UUFDNUMsV0FBVyxFQUFFLElBQUksNEJBQXNCLEVBQUU7S0FDMUMsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7UUFDN0IsUUFBUSxFQUFFLFVBQVU7UUFDcEIsU0FBUyxFQUFFLHdCQUFrQixDQUFDLElBQUk7UUFDbEMsVUFBVSxFQUFFLGlCQUFpQjtLQUM5QixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmlsZUFzc2V0UGFja2FnaW5nLCBTdGFjaywgRmlsZUFzc2V0U291cmNlLCBMZWdhY3lTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi4vLi4vbGliJztcblxuLy8gUmVtb3ZlIHRoaXMgZmlsZSBpbiB2MlxudGVzdCgnb3ZlcnJpZGRlbiBtZXRob2Qgb24gc3RhY2sgZ2V0cyBjYWxsZWQnLCAoKSA9PiB7XG4gIGxldCBjYWxsZWQgPSBmYWxzZTtcblxuICBjbGFzcyBNeVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICAgIHB1YmxpYyBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBzdXBlci5hZGRGaWxlQXNzZXQoYXNzZXQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gbmV3IE15U3RhY2sodW5kZWZpbmVkLCAnU3RhY2snLCB7XG4gICAgc3ludGhlc2l6ZXI6IG5ldyBMZWdhY3lTdGFja1N5bnRoZXNpemVyKCksXG4gIH0pO1xuICBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgc291cmNlSGFzaDogJ2ZpbGUtYXNzZXQtaGFzaCcsXG4gIH0pO1xuXG4gIGV4cGVjdChjYWxsZWQpLnRvRXF1YWwodHJ1ZSk7XG59KTtcbiJdfQ==