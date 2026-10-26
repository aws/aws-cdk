import { Fn } from '../cfn-fn';
import { Token, Tokenization } from '../token';

/*
 * Escaping for values that are only known at deploy time.
 *
 * The problem. A deploy-time value, such as a `CfnParameter`, is a placeholder
 * when CDK builds the template. CloudFormation pastes the real value into the
 * script later, exactly as the person deploying typed it:
 *
 *   Input (author's code):  run.sh '${p}'     with p = `x'; touch /tmp/pwned; '`
 *   Script line:            run.sh 'x'; touch /tmp/pwned; ''
 *   Result:                 runs `touch /tmp/pwned`
 *
 * The fix. CDK asks CloudFormation to Base64-encode the value (`Fn::Base64`)
 * and writes code that decodes it on the machine. Base64 text only has
 * letters, digits, `+`, `/` and `=`, so the shell reads nothing in it:
 *
 *   Script line:   run.sh "$(printf %s 'eCc7IHRvdWNoIC90bXAvcHduZWQ7ICc=' | base64 -d)"
 *   Program gets:  x'; touch /tmp/pwned; '     (one argument, nothing runs)
 *
 * In the examples below, `|` separates the arguments the program receives.
 */

/**
 * Decodes one deploy-time value as one argument of a Linux shell command.
 *
 * @param value - a deploy-time value (a token). The caller writes values it
 * already knows itself.
 * @returns shell text that becomes the decoded value, as one argument.
 *
 * @example
 *   Input:         bucketKey = ${p}     with p = `/opt/my app`
 *   Script line:   "$(printf %s 'L29wdC9teSBhcHA=' | base64 -d)"
 *   Program gets:  /opt/my app          (one argument, not split at the space)
 */
export function posixShellDecodeDeployTimeArgument(value: string): string {
  return `"${posixShellDecode(Fn.base64(value))}"`;
}

/**
 * Escapes the deploy-time values inside a Linux command line the author wrote.
 * The author's own text is kept as written; only the deploy-time values change.
 *
 * Each value becomes `${0+"$(decode)"}`. `${0+...}` means "if `$0` is set,
 * use `...`", and `$0` (the script name) is always set, so this is just the
 * decoded value in double quotes.
 *
 * Why the wrapper: plain double quotes clash with quotes the author wrote.
 *
 *   Input (author's arguments):  -f "${p}"     with p = `my app`
 *
 *   With "$(decode)":
 *     Script line:   -f ""$(decode)""
 *     Program gets:  -f | my | app       (the two pairs of quotes cancel out)
 *
 *   With ${0+"$(decode)"}:
 *     Script line:   -f "${0+"$(decode)"}"
 *     Program gets:  -f | my app         (the inner quotes pair with each other)
 *
 * Not supported. Write the double-quoted form instead (p = `my app`):
 *
 *   Input        Program gets                    Write instead
 *   'pre ${p}'   pre ${0+"$(printf ...)"}         "pre ${p}"   -> pre my app
 *   "'${p}'"     my app (quotes dropped)          \'${p}\'     -> 'my app'
 *
 * @param commandLine - shell text written by the author, which may contain
 * deploy-time values.
 * @returns the same text, with each deploy-time value replaced by code that
 * decodes it as one argument.
 *
 * @example
 * // what the program receives, for a parameter `p` with the value `my app`
 * `-f ${p}`               // -f | my app
 * `-f "${p}"`             // -f | my app
 * `-f '${p}'`             // -f | my app
 * `"pre ${p} post"`       // pre my app post
 * `--path=${p}`           // --path=my app
 * `${p}.log`              // my app.log
 * `*.log $HOME -f ${p}`   // the author's *.log and $HOME expand as usual
 * `-f ${p}`, p is empty   // -f | (an empty argument)
 * `-f ${p}`, p is $(rm x) // -f | $(rm x)  (plain text, nothing runs)
 *
 * @see replaceDeployTimeValues for how a value alone in single quotes is handled.
 */
export function posixShellEscapeDeployTimeValuesInCommandLine(commandLine: string): string {
  return replaceDeployTimeValues(commandLine, (base64) => `\${0+"${posixShellDecode(base64)}"}`);
}

/**
 * Decodes one deploy-time value as one argument of a PowerShell command.
 *
 * @param value - a deploy-time value (a token). The caller writes values it
 * already knows itself.
 * @returns a PowerShell expression that becomes the decoded value.
 *
 * @example
 *   Input:         bucketKey = ${p}     with p = `my app`
 *   Script line:   ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('bXkgYXBw')))
 *   Program gets:  my app
 */
export function powershellDecodeDeployTimeArgument(value: string): string {
  return powershellDecode(Fn.base64(value));
}

/**
 * Escapes the deploy-time values inside a PowerShell command line the author
 * wrote. The author's own text is kept as written.
 *
 * Each value becomes `$(decode)`. PowerShell never splits the result of
 * `$(...)` at spaces, so it needs no wrapper:
 *
 *   Input:         -f "${p}"     with p = `my app`
 *   Script line:   -f "$(decode)"
 *   Program gets:  -f | my app
 *
 * Not supported. Put double quotes around the whole word (p = `my app`):
 *
 *   Input         Program gets               Write instead
 *   -Path=${p}    -Path=$ | my app           "-Path=${p}"
 *   ${p}post      my app | post              "${p}post"
 *   ${a}:${b}     fn | :7                    "${a}:${b}"
 *   ${p}.log      (an empty argument)        "${p}.log"
 *   'pre ${p}'    the decode code as text    "pre ${p}"
 *   "'${p}'"      my app (quotes dropped)    "`'${p}`'"
 *
 * @param commandLine - PowerShell text written by the author, which may contain
 * deploy-time values.
 * @returns the same text, with each deploy-time value replaced by code that
 * decodes it as one argument.
 *
 * @example
 * // what the program receives, for a parameter `p` with the value `my app`
 * `-f ${p}`               // -f | my app
 * `-f "${p}"`             // -f | my app
 * `-f '${p}'`             // -f | my app
 * `"pre ${p} post"`       // pre my app post
 * `--path=${p}`           // --path=my app
 * `-Name:${p}`            // binds my app to a script's -Name parameter
 * `-f ${p}`, p is empty   // -f | (an empty argument)
 * `-f ${p}`, p is $(rm x) // -f | $(rm x)  (plain text, nothing runs)
 *
 * @see replaceDeployTimeValues for how a value alone in single quotes is handled.
 */
export function powershellEscapeDeployTimeValuesInCommandLine(commandLine: string): string {
  return replaceDeployTimeValues(commandLine, (base64) => `$(${powershellDecode(base64)})`);
}

/**
 * Replaces each deploy-time value in `commandLine` with the code that decodes
 * it. The author's own text is kept as written.
 *
 * @param commandLine - text written by the author, which may contain
 * deploy-time values.
 * @param writeDecode - returns the decode code for one value, given that
 * value's Base64 text.
 * @returns the text with each deploy-time value replaced.
 */
function replaceDeployTimeValues(commandLine: string, writeDecode: (base64: string) => string): string {
  // Step 1: drop single quotes around a value that stands alone in them.
  // Nothing inside single quotes runs, so the decode would reach the program
  // as text. The regex `'([^'\s]+)'` finds a quote, then characters that are
  // not a quote or a space, then a quote. The quotes are dropped only when the
  // inside is exactly one deploy-time value:
  //
  //   Input:   -f '${p}' -g 'lit' -h 'pre ${p}'
  //   Output:  -f ${p} -g 'lit' -h 'pre ${p}'
  const withoutQuotesAroundLoneValues = commandLine.replace(/'([^'\s]+)'/g, (quoted, inner) => {
    const isLoneDeployTimeValue = Tokenization.reverse(inner, { failConcat: false }) !== undefined;
    return isLoneDeployTimeValue ? inner : quoted;
  });

  // Steps 2 and 3: replace each deploy-time value with its decode code, and
  // keep the author's text around it:
  //
  //   Input:   -f ${p} --verbose
  //   Output:  -f <decode code for p> --verbose
  return Tokenization.reverseString(withoutQuotesAroundLoneValues)
    .mapTokens({ mapToken: (value) => writeDecode(Fn.base64(Token.asString(value))) })
    .join({ join: (left, right) => `${left ?? ''}${right ?? ''}` });
}

/**
 * Linux shell code that turns Base64 text back into the original value.
 *
 * @param base64 - the value's Base64 text.
 * @returns shell text that becomes the decoded value.
 *
 * @example
 *   Input:   bXkgYXBw   (Base64 of `my app`)
 *   Output:  $(printf %s 'bXkgYXBw' | base64 -d)   which becomes `my app` when the script runs
 */
function posixShellDecode(base64: string): string {
  return `$(printf %s '${base64}' | base64 -d)`;
}

/**
 * PowerShell code that turns Base64 text back into the original value.
 *
 * @param base64 - the value's Base64 text.
 * @returns a PowerShell expression that becomes the decoded value.
 *
 * @example
 *   Input:   bXkgYXBw   (Base64 of `my app`)
 *   Output:  ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('bXkgYXBw')))
 *            which becomes `my app` when the script runs
 */
function powershellDecode(base64: string): string {
  return `([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64}')))`;
}
