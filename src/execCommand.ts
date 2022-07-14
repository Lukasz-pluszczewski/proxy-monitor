const { exec } = require('child_process');

export const execCommand = ([command, ...params]: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(
      [command, ...params].join(' '),
      {
        cwd: process.cwd(),
      },
      (error, stdout: string, stderr: string) => {
        if (error) {
          return reject(error);
        }

        resolve(stdout);
      }
    );
  });
