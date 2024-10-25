"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const fs = require("fs-extra");
const path = require("path");
let linter;
const outputRoot = path.join(process.cwd(), '.test-output');
fs.mkdirpSync(outputRoot);
const fixturesRoot = path.join(__dirname, 'fixtures');
fs.readdirSync(fixturesRoot).filter(f => fs.lstatSync(path.join(fixturesRoot, f)).isDirectory()).forEach(d => {
    describe(d, () => {
        const fixturesDir = path.join(fixturesRoot, d);
        beforeAll(() => {
            linter = new eslint_1.ESLint({
                baseConfig: {
                    parser: '@typescript-eslint/parser',
                },
                overrideConfigFile: path.join(fixturesDir, 'eslintrc.js'),
                rulePaths: [
                    path.join(__dirname, '..', '..', 'lib', 'rules'),
                ],
                fix: true,
            });
        });
        const outputDir = path.join(outputRoot, d);
        fs.mkdirpSync(outputDir);
        const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.ts') && !f.endsWith('.expected.ts'));
        fixtureFiles.forEach(f => {
            it(f, async () => {
                const originalFilePath = path.join(fixturesDir, f);
                const expectedFixedFilePath = path.join(fixturesDir, `${path.basename(f, '.ts')}.expected.ts`);
                const expectedErrorFilepath = path.join(fixturesDir, `${path.basename(f, '.ts')}.error.txt`);
                const fix = fs.existsSync(expectedFixedFilePath);
                const checkErrors = fs.existsSync(expectedErrorFilepath);
                if (fix && checkErrors) {
                    fail(`Expected only a fixed file or an expected error message file. Both ${expectedFixedFilePath} and ${expectedErrorFilepath} are present.`);
                }
                else if (fix) {
                    const actualFile = await lintAndFix(originalFilePath, outputDir);
                    const actual = await fs.readFile(actualFile, { encoding: 'utf8' });
                    const expected = await fs.readFile(expectedFixedFilePath, { encoding: 'utf8' });
                    if (actual !== expected) {
                        fail(`Linted file did not match expectations.\n--------- Expected ----------\n${expected}\n---------- Actual ----------\n${actual}`);
                    }
                    return;
                }
                else if (checkErrors) {
                    const actualErrorMessages = await lint(originalFilePath);
                    const expectedErrorMessages = (await fs.readFile(expectedErrorFilepath, { encoding: 'utf8' })).split('\n');
                    if (expectedErrorMessages.length !== actualErrorMessages?.length) {
                        fail(`Number of messages from linter did not match expectations. Linted file: ${originalFilePath}. Expected number of messages: ${expectedErrorMessages.length}. Actual number of messages: ${actualErrorMessages?.length}.`);
                    }
                    actualErrorMessages.forEach(actualMessage => {
                        if (!expectedErrorMessages.some(expectedMessage => actualMessage.message.includes(expectedMessage))) {
                            fail(`Error message not found in .error.txt file. Linted file: ${originalFilePath}. Actual message:\n${actualMessage.message}\nExpected messages:\n${expectedErrorMessages}`);
                        }
                    });
                    return;
                }
                else {
                    fail(`Expected fixed file or expected error file not found.`);
                }
            });
        });
    });
});
async function lintAndFix(file, outputDir) {
    const newPath = path.join(outputDir, path.basename(file));
    let result = await linter.lintFiles(file);
    const hasFixes = result.find(r => typeof (r.output) === 'string') !== undefined;
    if (hasFixes) {
        await eslint_1.ESLint.outputFixes(result.map(r => {
            r.filePath = newPath;
            return r;
        }));
    }
    else {
        // If there are no fixes, copy the input file as output
        await fs.copyFile(file, newPath);
    }
    return newPath;
}
async function lint(file) {
    const result = await linter.lintFiles(file);
    // If you only lint one file, then result.length will always be one.
    if (result.length === 1) {
        return result[0].messages;
    }
    return [];
}
function fail(x) {
    throw new Error(x);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpeHR1cmVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBZ0M7QUFDaEMsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUU3QixJQUFJLE1BQWMsQ0FBQztBQUVuQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM1RCxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTFCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRXRELEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQzNHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFL0MsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNiLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQztnQkFDbEIsVUFBVSxFQUFFO29CQUNWLE1BQU0sRUFBRSwyQkFBMkI7aUJBQ3BDO2dCQUNELGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQztnQkFDekQsU0FBUyxFQUFFO29CQUNULElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQztp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QUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxLQUFLLFVBQVUsSUFBSSxDQUFDLElBQVk7SUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLG9FQUFvRTtJQUNwRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEIsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLElBQUksQ0FBQyxDQUFTO0lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludCB9IGZyb20gJ2VzbGludCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5sZXQgbGludGVyOiBFU0xpbnQ7XG5cbmNvbnN0IG91dHB1dFJvb3QgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy50ZXN0LW91dHB1dCcpO1xuZnMubWtkaXJwU3luYyhvdXRwdXRSb290KTtcblxuY29uc3QgZml4dHVyZXNSb290ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJyk7XG5cbmZzLnJlYWRkaXJTeW5jKGZpeHR1cmVzUm9vdCkuZmlsdGVyKGYgPT4gZnMubHN0YXRTeW5jKHBhdGguam9pbihmaXh0dXJlc1Jvb3QsIGYpKS5pc0RpcmVjdG9yeSgpKS5mb3JFYWNoKGQgPT4ge1xuICBkZXNjcmliZShkLCAoKSA9PiB7XG4gICAgY29uc3QgZml4dHVyZXNEaXIgPSBwYXRoLmpvaW4oZml4dHVyZXNSb290LCBkKTtcblxuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBsaW50ZXIgPSBuZXcgRVNMaW50KHtcbiAgICAgICAgYmFzZUNvbmZpZzoge1xuICAgICAgICAgIHBhcnNlcjogJ0B0eXBlc2NyaXB0LWVzbGludC9wYXJzZXInLFxuICAgICAgICB9LFxuICAgICAgICBvdmVycmlkZUNvbmZpZ0ZpbGU6IHBhdGguam9pbihmaXh0dXJlc0RpciwgJ2VzbGludHJjLmpzJyksXG4gICAgICAgIHJ1bGVQYXRoczogW1xuICAgICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICdsaWInLCAncnVsZXMnKSxcbiAgICAgICAgXSxcbiAgICAgICAgZml4OiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLmpvaW4ob3V0cHV0Um9vdCwgZCk7XG4gICAgZnMubWtkaXJwU3luYyhvdXRwdXREaXIpO1xuXG4gICAgY29uc3QgZml4dHVyZUZpbGVzID0gZnMucmVhZGRpclN5bmMoZml4dHVyZXNEaXIpLmZpbHRlcihmID0+IGYuZW5kc1dpdGgoJy50cycpICYmICFmLmVuZHNXaXRoKCcuZXhwZWN0ZWQudHMnKSk7XG5cbiAgICBmaXh0dXJlRmlsZXMuZm9yRWFjaChmID0+IHtcbiAgICAgIGl0KGYsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc0RpciwgZik7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkRml4ZWRGaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc0RpciwgYCR7cGF0aC5iYXNlbmFtZShmLCAnLnRzJyl9LmV4cGVjdGVkLnRzYCk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkRXJyb3JGaWxlcGF0aCA9IHBhdGguam9pbihmaXh0dXJlc0RpciwgYCR7cGF0aC5iYXNlbmFtZShmLCAnLnRzJyl9LmVycm9yLnR4dGApO1xuICAgICAgICBjb25zdCBmaXggPSBmcy5leGlzdHNTeW5jKGV4cGVjdGVkRml4ZWRGaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGNoZWNrRXJyb3JzID0gZnMuZXhpc3RzU3luYyhleHBlY3RlZEVycm9yRmlsZXBhdGgpO1xuICAgICAgICBpZiAoZml4ICYmIGNoZWNrRXJyb3JzKSB7XG4gICAgICAgICAgZmFpbChgRXhwZWN0ZWQgb25seSBhIGZpeGVkIGZpbGUgb3IgYW4gZXhwZWN0ZWQgZXJyb3IgbWVzc2FnZSBmaWxlLiBCb3RoICR7ZXhwZWN0ZWRGaXhlZEZpbGVQYXRofSBhbmQgJHtleHBlY3RlZEVycm9yRmlsZXBhdGh9IGFyZSBwcmVzZW50LmApO1xuICAgICAgICB9IGVsc2UgaWYgKGZpeCkge1xuICAgICAgICAgIGNvbnN0IGFjdHVhbEZpbGUgPSBhd2FpdCBsaW50QW5kRml4KG9yaWdpbmFsRmlsZVBhdGgsIG91dHB1dERpcik7XG4gICAgICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgZnMucmVhZEZpbGUoYWN0dWFsRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gYXdhaXQgZnMucmVhZEZpbGUoZXhwZWN0ZWRGaXhlZEZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICAgICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgICAgIGZhaWwoYExpbnRlZCBmaWxlIGRpZCBub3QgbWF0Y2ggZXhwZWN0YXRpb25zLlxcbi0tLS0tLS0tLSBFeHBlY3RlZCAtLS0tLS0tLS0tXFxuJHtleHBlY3RlZH1cXG4tLS0tLS0tLS0tIEFjdHVhbCAtLS0tLS0tLS0tXFxuJHthY3R1YWx9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChjaGVja0Vycm9ycykge1xuICAgICAgICAgIGNvbnN0IGFjdHVhbEVycm9yTWVzc2FnZXMgPSBhd2FpdCBsaW50KG9yaWdpbmFsRmlsZVBhdGgpXG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRFcnJvck1lc3NhZ2VzID0gKGF3YWl0IGZzLnJlYWRGaWxlKGV4cGVjdGVkRXJyb3JGaWxlcGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgaWYgKGV4cGVjdGVkRXJyb3JNZXNzYWdlcy5sZW5ndGggIT09IGFjdHVhbEVycm9yTWVzc2FnZXM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgZmFpbChgTnVtYmVyIG9mIG1lc3NhZ2VzIGZyb20gbGludGVyIGRpZCBub3QgbWF0Y2ggZXhwZWN0YXRpb25zLiBMaW50ZWQgZmlsZTogJHtvcmlnaW5hbEZpbGVQYXRofS4gRXhwZWN0ZWQgbnVtYmVyIG9mIG1lc3NhZ2VzOiAke2V4cGVjdGVkRXJyb3JNZXNzYWdlcy5sZW5ndGh9LiBBY3R1YWwgbnVtYmVyIG9mIG1lc3NhZ2VzOiAke2FjdHVhbEVycm9yTWVzc2FnZXM/Lmxlbmd0aH0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFjdHVhbEVycm9yTWVzc2FnZXMuZm9yRWFjaChhY3R1YWxNZXNzYWdlID0+IHtcbiAgICAgICAgICAgIGlmKCFleHBlY3RlZEVycm9yTWVzc2FnZXMuc29tZShleHBlY3RlZE1lc3NhZ2UgPT4gYWN0dWFsTWVzc2FnZS5tZXNzYWdlLmluY2x1ZGVzKGV4cGVjdGVkTWVzc2FnZSkpKSB7XG4gICAgICAgICAgICAgIGZhaWwoYEVycm9yIG1lc3NhZ2Ugbm90IGZvdW5kIGluIC5lcnJvci50eHQgZmlsZS4gTGludGVkIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH0uIEFjdHVhbCBtZXNzYWdlOlxcbiR7YWN0dWFsTWVzc2FnZS5tZXNzYWdlfVxcbkV4cGVjdGVkIG1lc3NhZ2VzOlxcbiR7ZXhwZWN0ZWRFcnJvck1lc3NhZ2VzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmYWlsKGBFeHBlY3RlZCBmaXhlZCBmaWxlIG9yIGV4cGVjdGVkIGVycm9yIGZpbGUgbm90IGZvdW5kLmApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gbGludEFuZEZpeChmaWxlOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gIGNvbnN0IG5ld1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0RGlyLCBwYXRoLmJhc2VuYW1lKGZpbGUpKVxuICBsZXQgcmVzdWx0ID0gYXdhaXQgbGludGVyLmxpbnRGaWxlcyhmaWxlKTtcbiAgY29uc3QgaGFzRml4ZXMgPSByZXN1bHQuZmluZChyID0+IHR5cGVvZihyLm91dHB1dCkgPT09ICdzdHJpbmcnKSAhPT0gdW5kZWZpbmVkO1xuICBpZiAoaGFzRml4ZXMpIHtcbiAgICBhd2FpdCBFU0xpbnQub3V0cHV0Rml4ZXMocmVzdWx0Lm1hcChyID0+IHtcbiAgICAgIHIuZmlsZVBhdGggPSBuZXdQYXRoO1xuICAgICAgcmV0dXJuIHI7XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIC8vIElmIHRoZXJlIGFyZSBubyBmaXhlcywgY29weSB0aGUgaW5wdXQgZmlsZSBhcyBvdXRwdXRcbiAgICBhd2FpdCBmcy5jb3B5RmlsZShmaWxlLCBuZXdQYXRoKTtcbiAgfVxuICByZXR1cm4gbmV3UGF0aDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbGludChmaWxlOiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbGludGVyLmxpbnRGaWxlcyhmaWxlKTtcbiAgLy8gSWYgeW91IG9ubHkgbGludCBvbmUgZmlsZSwgdGhlbiByZXN1bHQubGVuZ3RoIHdpbGwgYWx3YXlzIGJlIG9uZS5cbiAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gcmVzdWx0WzBdLm1lc3NhZ2VzO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gZmFpbCh4OiBzdHJpbmcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKHgpO1xufSJdfQ==