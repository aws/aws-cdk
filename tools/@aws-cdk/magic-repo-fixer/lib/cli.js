"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const yargs_1 = __importDefault(require("yargs/yargs"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const cp = __importStar(require("child_process"));
const exec = (cmd, opts) => new Promise((ok, ko) => {
    cp.exec(cmd, opts, (err, stdout, stderr) => {
        if (err) {
            return ko(err);
        }
        return ok({ stdout, stderr });
    });
});
async function main() {
    const args = (0, yargs_1.default)(process.argv.slice(2))
        .command('$0 [REPO_ROOT]', 'Magically restructure cdk repository', argv => argv
        .positional('REPO_ROOT', {
        type: 'string',
        desc: 'The root of the cdk repo to be magicked',
        default: '.',
        normalize: true,
    })
        .option('dry-run', {
        type: 'boolean',
        default: false,
        desc: 'don\'t replace files in working directory',
        defaultDescription: 'replace files in working directory, will delete old package files and directories in favor of new structure.',
    })
        .option('clean', {
        type: 'boolean',
        default: true,
        desc: 'remove intermediary directory with new structure, negate with --no-clean',
    })
        .option('tmp-dir', {
        type: 'string',
        desc: 'temporary intermediate directory, removed unless --no-clean is specified',
    }))
        .argv;
    const { 'tmp-dir': tmpDir, REPO_ROOT: repoRoot, clean } = args;
    const targetDir = tmpDir ?? await fs.mkdtemp('magic-');
    if (fs.existsSync(targetDir)) {
        await fs.remove(targetDir);
    }
    await fs.mkdir(targetDir);
    await exec(`git clone ${repoRoot} ${targetDir}`);
    if (clean) {
        await fs.rmdir(path.resolve(targetDir));
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3Qiw2Q0FBK0I7QUFDL0Isa0RBQW9DO0FBR3BDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBVyxFQUFFLElBQTRCLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQ2pGLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQTRCLEVBQUUsTUFBdUIsRUFBRSxNQUF1QixFQUFFLEVBQUU7UUFDcEcsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNoQjtRQUVELE9BQU8sRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVJLEtBQUssVUFBVSxJQUFJO0lBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUEsZUFBSyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxzQ0FBc0MsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUN4RSxJQUFJO1NBQ0QsVUFBVSxDQUFDLFdBQVcsRUFBRTtRQUN2QixJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSx5Q0FBeUM7UUFDL0MsT0FBTyxFQUFFLEdBQUc7UUFDWixTQUFTLEVBQUUsSUFBSTtLQUNoQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO1FBQ2QsSUFBSSxFQUFFLDJDQUEyQztRQUNqRCxrQkFBa0IsRUFBRSw4R0FBOEc7S0FDbkksQ0FBQztTQUNELE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxJQUFJO1FBQ2IsSUFBSSxFQUFFLDBFQUEwRTtLQUNqRixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSwwRUFBMEU7S0FDakYsQ0FBQyxDQUNMO1NBQ0EsSUFBSSxDQUFDO0lBRU4sTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV2RCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUM7UUFDM0IsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFCLE1BQU0sSUFBSSxDQUFDLGFBQWEsUUFBUSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDakQsSUFBSSxLQUFLLEVBQUU7UUFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3pDO0FBQ0wsQ0FBQztBQXpDRCxvQkF5Q0MifQ==