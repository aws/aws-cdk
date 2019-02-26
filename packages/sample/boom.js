"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var assets = require("../@aws-cdk/assets/lib");
var cdk = require("../@aws-cdk/cdk/lib");
var MyStack = /** @class */ (function (_super) {
    __extends(MyStack, _super);
    function MyStack(scope, id) {
        var _this = _super.call(this, scope, id) || this;
        new cdk.Resource(_this, 'R1', { type: 'R1', properties: { Boom: 'Bam' } });
        var file = new assets.FileAsset(_this, 'File', {
            path: path.join(__dirname, 'file.txt')
        });
        new cdk.Resource(_this, 'R2', { type: 'R2', properties: {
                Bucket: file.s3BucketName,
                Key: file.s3ObjectKey
            } });
        return _this;
    }
    return MyStack;
}(cdk.Stack));
var app = new cdk.App();
new MyStack(app, 'my-stack');
app.run();
