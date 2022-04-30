import * as yargs from 'yargs';
import * as chalk from 'chalk';

import {lstat} from 'fs';
import {mkdir} from 'fs';

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
        return console.log(chalk.red(err));
      }
      if (stats.isFile()) {
        console.log(chalk.green(`In this route you have a File`));
      } else if (stats.isDirectory()) {
        console.log(chalk.green(`In this route you have a Directory`));
      }
    });
  }

  createADirectory() {
    yargs.command({
      command: 'mkdir',
      describe: 'Makes a new directory',
      builder: {
        name: {
          describe: 'Name of the new directory',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        const newDir = new Commands();
        newDir.newDir(`${argv.name}`);
      },
    });
  }

  private newDir(name: string) {
    mkdir(`${name}`, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(chalk.green('New Directory has been created'));
    });
  }
}
