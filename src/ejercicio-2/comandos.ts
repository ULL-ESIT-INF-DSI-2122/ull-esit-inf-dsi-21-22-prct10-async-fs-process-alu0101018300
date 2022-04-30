import {spawn} from 'child_process';
import * as yargs from 'yargs';

export class Commands {

  constructor() {}

  catNoPipes() {
    yargs.command({
      command: 'cat',
      describe: 'Bash command that reads a file',
      builder: {
        file: {
          describe: 'File name we want to read',
          demandOption: true,
          type: 'string',
        },
      },

      handler(argv) {
        const cat = spawn('cat', [`${argv.file}`]);

        cat.stdout.on('data', (catResult) => {
          console.log(catResult.toString("utf8"));
        });
    
        cat.stderr.on('data', (err) => {
          console.error(err.toString());
        });
    
        cat.on('close', (code) => {
          if (code !== 0) {
            console.log(`Process has ended with error code ${code}`);
          }
        });
      },
    });
  }
}