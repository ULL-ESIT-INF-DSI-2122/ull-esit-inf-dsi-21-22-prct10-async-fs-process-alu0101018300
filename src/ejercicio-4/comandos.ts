import * as yargs from 'yargs';
import {lstat} from 'fs';

export class Commands {

  constructor() {}

  checkFileOrDirectory() {
    yargs.command({
      command: 'check',
      describe: 'Show if a path is a file or a directory',
      builder: {
        route: {
          describe: 'Path',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        const test: Commands = new Commands();
        test.FileOrDirectory(`${argv.route}`);
      },
    });
  }

  private FileOrDirectory(path: string) {
    lstat(`${path}`, (err, stats) => {
      if (err) {
        return console.log(err);
      }
      if (stats.isFile()) {
        console.log(`In this route you have a File`);
      } else if (stats.isDirectory()) {
        console.log(`In this route you have a Directory`);
      }
    });
  }
}