import { backupFile, saveFileContents } from './fsUtils';
import { simpleGit } from 'simple-git';
import { gitOptions } from './GitStatus';

const npmProxyTemplate = (proxyUrl: string) =>
  proxyUrl
    ? `proxy=${proxyUrl}
https-proxy=${proxyUrl}`
    : '';

const gitInstance = simpleGit(gitOptions);

export const setNewProxy = async (
  newProxy: string,
  { git = true, npm = true } = {}
) => {
  if (git) {
    gitInstance.addConfig(
      `http.https://${process.env.PROXY_MONITOR_REPO_URL}.proxy`,
      newProxy,
      false,
      'global'
    );
  }
  if (npm) {
    const fileContents = await backupFile(
      process.env.PROXY_MONITOR_NPMRC_FILE_PATH,
      process.env.PROXY_MONITOR_NPMRC_BACKUP_PATH
    );
    console.log(
      'file contents',
      (new RegExp(process.env.PROXY_MONITOR_NPMRC_TEMPLATE).exec(
        fileContents
      ) || [])[0]
    );

    const newFileContents = fileContents.replace(
      new RegExp(process.env.PROXY_MONITOR_NPMRC_TEMPLATE),
      `$1\n${npmProxyTemplate(newProxy)}\n$2`
    );

    await saveFileContents(
      process.env.PROXY_MONITOR_NPMRC_FILE_PATH,
      newFileContents
    );
  }
};
