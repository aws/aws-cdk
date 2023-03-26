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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2xkLXN0eWxlLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2xkLXN0eWxlLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQStGO0FBRS9GLHlCQUF5QjtBQUN6QixJQUFJLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO0lBQ2xELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUVuQixNQUFNLE9BQVEsU0FBUSxXQUFLO1FBQ2xCLFlBQVksQ0FBQyxLQUFzQjtZQUN4QyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2QsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO0tBQ0Y7SUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO1FBQzVDLFdBQVcsRUFBRSxJQUFJLDRCQUFzQixFQUFFO0tBQzFDLENBQUMsQ0FBQztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO1FBQzdCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFNBQVMsRUFBRSx3QkFBa0IsQ0FBQyxJQUFJO1FBQ2xDLFVBQVUsRUFBRSxpQkFBaUI7S0FDOUIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpbGVBc3NldFBhY2thZ2luZywgU3RhY2ssIEZpbGVBc3NldFNvdXJjZSwgTGVnYWN5U3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4uLy4uL2xpYic7XG5cbi8vIFJlbW92ZSB0aGlzIGZpbGUgaW4gdjJcbnRlc3QoJ292ZXJyaWRkZW4gbWV0aG9kIG9uIHN0YWNrIGdldHMgY2FsbGVkJywgKCkgPT4ge1xuICBsZXQgY2FsbGVkID0gZmFsc2U7XG5cbiAgY2xhc3MgTXlTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgICBwdWJsaWMgYWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICByZXR1cm4gc3VwZXIuYWRkRmlsZUFzc2V0KGFzc2V0KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGFjayA9IG5ldyBNeVN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrJywge1xuICAgIHN5bnRoZXNpemVyOiBuZXcgTGVnYWN5U3RhY2tTeW50aGVzaXplcigpLFxuICB9KTtcbiAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgIHNvdXJjZUhhc2g6ICdmaWxlLWFzc2V0LWhhc2gnLFxuICB9KTtcblxuICBleHBlY3QoY2FsbGVkKS50b0VxdWFsKHRydWUpO1xufSk7XG4iXX0=