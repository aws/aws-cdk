import * as chalk from 'chalk';

// Create a new chalk instance with color support disabled if we're not in a TTY
const wrapper = new chalk.Instance({
  level: process.stdout.isTTY ? 2 : 0,
});

export default wrapper;

// Export individual methods
export const {
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  grey,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  visible,
  reset,
} = wrapper;
