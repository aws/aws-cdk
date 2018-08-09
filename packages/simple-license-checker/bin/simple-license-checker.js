#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
require("source-map-support/register");
var util = require("util");
var yargs = require("yargs");
// tslint:disable-next-line:no-var-requires
var nlv = require('node-license-validator');
var argv = yargs
    .option('allow-licenses', { type: 'array', alias: 'a', desc: 'Additional licenses to allow', default: [] })
    .option('allow-packages', { type: 'array', alias: 'a', desc: 'Packages to allow by default', default: [] })
    .argv;
/**
 * Set of permissive licenses allowed by default
 */
var PERMISSIVE_LICENSES = [
    // MIT variants
    'MIT', 'ISC', 'MIT/X11',
    // BSD variants
    'BSD', 'BSD-2-Clause', 'BSD-3-Clause',
    // Public domain
    'CC0-1.0',
    'Unlicense',
    // Creative Commons
    'CC-BY-3.0',
    // Organizations
    'Apache-2.0',
    'Apache 2.0',
    'PSF',
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var settings, licenses, packages, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = require(path.join(process.cwd(), 'package.json'))["simple-license-checker"] || {};
                    licenses = PERMISSIVE_LICENSES.concat(argv['allow-licenses']).concat(settings["allow-licenses"] || []);
                    packages = argv['allow-packages'].concat(Object.keys(settings["allow-packages"] || {}));
                    return [4 /*yield*/, util.promisify(nlv)('.', { licenses: licenses, packages: packages })];
                case 1:
                    results = _a.sent();
                    if (results.invalids.length > 0) {
                        process.stderr.write('Uses dependencies with nonpermissive (or unknown) licenses:\n');
                        results.invalids.forEach(function (pkg) {
                            var license = results.packages[pkg];
                            process.stderr.write("* " + pkg + " => " + license + "\n");
                        });
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLWxpY2Vuc2UtY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpbXBsZS1saWNlbnNlLWNoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQkFBOEI7QUFDOUIsdUNBQXFDO0FBQ3JDLDJCQUE4QjtBQUM5Qiw2QkFBZ0M7QUFFaEMsMkNBQTJDO0FBQzNDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBUTlDLElBQU0sSUFBSSxHQUFHLEtBQUs7S0FDYixNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUMxRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUMxRyxJQUFJLENBQUM7QUFFVjs7R0FFRztBQUNILElBQU0sbUJBQW1CLEdBQUc7SUFDeEIsZUFBZTtJQUNmLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUztJQUN2QixlQUFlO0lBQ2YsS0FBSyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBQ3JDLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixZQUFZO0lBQ1osS0FBSztDQUNSLENBQUM7QUFFRjs7Ozs7O29CQUNVLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFN0YsUUFBUSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdkcsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWxFLHFCQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxVQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxFQUFBOztvQkFBNUUsT0FBTyxHQUFlLFNBQXNEO29CQUVsRixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDN0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQzt3QkFDdEYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHOzRCQUN4QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUN0QyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFLLEdBQUcsWUFBTyxPQUFPLE9BQUksQ0FBQyxDQUFDO3dCQUNyRCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNuQjs7Ozs7Q0FDSjtBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7SUFDWixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDIn0=