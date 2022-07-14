import fs from 'fs/promises';

export const loadFileContents = async (filePath: string) =>
  fs.readFile(filePath, 'utf-8');
export const saveFileContents = async (filePath: string, content: string) =>
  fs.writeFile(filePath, content, 'utf-8');

export const appendToFile = (filePath: string, contentToAppend: string) =>
  fs.appendFile(filePath, contentToAppend);

export const backupFile = async (
  filePath,
  backupFile,
  dividerTemplate = () =>
    `\n\n\n======================  ${new Date()}  ======================\n\n`
) => {
  const fileContents = await loadFileContents(filePath);
  await appendToFile(backupFile, `${dividerTemplate()}${fileContents}`);
  return fileContents;
};
