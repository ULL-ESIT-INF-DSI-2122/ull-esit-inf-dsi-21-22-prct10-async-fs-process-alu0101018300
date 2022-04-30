import * as yargs from 'yargs';
import * as chalk from 'chalk';

import {spawn} from 'child_process';
import {lstat, mkdir, rmdir, unlink} from 'fs';

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

  FileOrDirectory(path: string): boolean {
    let result: boolean = true;
    lstat(`${path}`, (err, stats) => {
      if (err) {
        result = false;
        return console.log(chalk.red(err));
      }
      if (stats.isFile()) {
        console.log(chalk.green(`In this route you have a File`));
      } else if (stats.isDirectory()) {
        console.log(chalk.green(`In this route you have a Directory`));
      }
    });

    return result;
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

  newDir(name: string): boolean {
    let result: boolean = true;
    mkdir(`${name}`, (err) => {
      if (err) {
        result = false;
        return console.error(err);
      }
      console.log(chalk.green('New Directory has been succesfully created'));
    });
    return result;
  }

  listFilesfromDirectory() {
    yargs.command({
      command: 'ls',
      describe: 'Lists all files from a directory',
      builder: {
        name: {
          describe: 'Directory name you want to list the files',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        const list = new Commands();
        list.list(`${argv.name}`);
      },
    });
  }

  list(name: string): boolean {
    let result: boolean = true;
    lstat(`${name}`, (err, stats) => {
      if (err) {
        result = false;
        return console.log(chalk.red(err));
      }

      if (stats.isDirectory()) {
        const ls = spawn('ls', [`${name}`]);
        
        ls.on('error', (err) => {
          console.log(chalk.red(err));
        });

        ls.stdout.on('data', (lsResult) => {
            console.log(chalk.green(lsResult.toString("utf8")));
          });

      } else if (stats.isFile()) {
        console.log(chalk.red.inverse(`Your path is not a Directory`));
      }
    });
    return result;
  }

 
  showContent() {
    yargs.command({
      command: 'cat',
      describe: 'Show files content',
      builder: {
        route: {
          describe: 'Path of the file',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        const show = new Commands();
        show.catFunction(`${argv.route}`);
      },
    });
  }
  catFunction(route: string): boolean {
    let result: boolean = true;

    lstat(`${route}`, (err, stats) => {
    if (err) {
      result = false;
      return console.log(chalk.red(err));
    }
    
      if (stats.isDirectory()) {
        console.log(chalk.red.inverse(`Your path is not a Directory`));
      }

      else {
        const cat = spawn('cat', [`${route}`]);
        cat.stdout.on('data', (catResult) => {
          console.log(chalk.green(catResult.toString("utf8")));
        });
      }
    });

    return result;
  }

  removeFileOrDirectory() {
    yargs.command({
      command: 'rm',
      describe: 'Delete a file or a directory',
      builder: {
        route: {
          describe: 'Path of the thing you want to remove',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        const deletes = new Commands();
        deletes.remove(`${argv.route}`);
      },
    });
  }

  remove(route: string): boolean {
    let result: boolean = true;

    lstat(`${route}`, (err, stats) => {
      if (err) {
        result = false;
        return console.log(chalk.red(err));
      }
      if (stats.isDirectory()) {
        rmdir(`${route}`, (err) => {
          if (err) {
            console.log(chalk.red(err));
          }
          console.log(chalk.green('Directory succesfully deleted'));
        });

      } else if (stats.isFile()) {
        unlink(`${route}`, (err) => {
          if (err) {
            console.log(chalk.red(err));
          }
          console.log(chalk.green('File succesfully deleted'));
        });
      }
    });
    return result;
  }

  CopyMoveFileOrDirectory() {
    yargs.command({
      command: 'mv',
      describe: 'Copy/Moves a File or a Directory',
      builder: {
        oriRoute: {
          describe: 'Path of the file or Directory we want to Move / Copy',
          demandOption: true,
          type: 'string',
        },
        destRoute: {
          describe: 'Path',
          demandOption: true,
          type: 'string',
        },
        copy: {
          describe: 'Flag',
          demandOption: true,
          type: 'boolean',
        },
      },
      handler(argv) {
        const mv = new Commands();
        mv.move(`${argv.oriRoute}`, `${argv.destRoute}`, argv.copy as boolean);
      },
    });
  }

  move(oriRoute: string, destRoute: string, copy: boolean): boolean {
    let result: boolean = true;

    if (copy === true) {
      const mv = spawn('mv', [`${oriRoute}`, `${destRoute}`]);

      mv.on('close', () => {
        console.log(chalk.green(`File or Directory moved to ${destRoute}`));
      });
    } 
    
    else if (copy === false) {
      const cp = spawn('cp', [`${oriRoute}`, `${destRoute}`]);

      cp.on('close', () => {
        console.log(chalk.green(`File or Directory copied to ${destRoute}`));
      });
    } else {
      result = false;
      console.log(chalk.red.inverse(`Option no available`));
    }

    return result;
  }
}




