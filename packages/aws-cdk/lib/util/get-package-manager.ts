const pmFromUserAgent = (userAgent: string) => {
  const pmSpec = userAgent.split(' ')[0];
  const separatorPos = pmSpec.lastIndexOf('/');
  const name = pmSpec.substring(0, separatorPos);
  return {
    name: name === 'npminstall' ? 'cnpm' : name,
    version: pmSpec.substring(separatorPos + 1),
  };
};

/**
 * Gives the package manager which was used to init the app
 * @returns npm, pnpm, yarn or cnpm
 */
export const getPackageManager = () => {
  if (!process.env.npm_config_user_agent) {
    return 'npm';
  }
  return pmFromUserAgent(process.env.npm_config_user_agent).name;
};
