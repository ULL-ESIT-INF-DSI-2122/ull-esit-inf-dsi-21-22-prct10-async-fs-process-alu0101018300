import {spawn} from 'child_process';
import * as yargs from 'yargs';
import * as chalk from 'chalk';

/**
 * Clase Commands, la cual contentrá las operaciones que realizarán los comandos
 * que nos interesan
 */
export class Commands {

  constructor() {}

  /**
   * Función que realiza el comando cat a través de yargs, pasando 
   * como opción la ruta del fichero que queremos leer.
   */
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
        const cat = new Commands();
        cat.catFile(`${argv.file}`);
      },
    });
  }

  /**
   * Función que realiza el cat mediante creación de procesos con spawn.
   * @param fileName Nombre del fichero que queremos leer.
   */
  catFile(fileName: string): boolean {
    let result: boolean = true;
    const cat = spawn('cat', [`${fileName}`]);

    cat.stdout.on('data', (catResult) => {
      console.log(chalk.green(catResult.toString("utf8")));
    });

    cat.stderr.on('data', (err) => {
      result = false;
      console.error(chalk.red.inverse(err.toString()));
    });

    cat.on('close', (code) => {
      if (code !== 0) {
        result = false;
        console.log(chalk.red.inverse(`Process has ended with error code ${code}`));
      }
    });

  return result;

  }

  /**
   * Función que realiza el comando cat con pipe a través de yargs, pasando 
   * como opción la ruta del fichero que queremos leer y la expresión por la
   * que queremos filtrar.
   */
  catWithGrep() {
    yargs.command({
      command: 'grep',
      describe: 'Bash command that finds the ocurrencies with a certain expression',
      builder: {
        file: {
          describe: 'File name we want to read',
          demandOption: true,
          type: 'string',
        },
        expression: {
          describe: 'Expression wanted to find in the file',
          demandOption: true,
          type: 'string',
        },
      },

      handler(argv) {
        const grep = new Commands();
        grep.grepFile(`${argv.file}`, `${argv.expression}`);
      },
    });
  }

  /**
   * Función que realiza el cat | grep mediante creación de procesos con spawn.
   * @param file nombre del fichero en el que queremos mirar.
   * @param expression Expresión que deseamos encontrar en el fichero.
   */
  grepFile(file: string, expression: string): boolean {
    let result: boolean = true;

    const cat = spawn('cat', [`${file}`]);
    const grep = spawn('grep', [`${expression}`]);

    cat.stderr.on('data', (err) => {
      result = false;
      console.error(chalk.red.inverse(err.toString()));
    });

    cat.stdout.pipe(grep.stdin);

    let consoleOutput: string = '';
    grep.stdout.on('data', (piece) => {
      consoleOutput += piece;
    });

    grep.stderr.on('data', (err) => {
      result = false;
      console.error(chalk.red.inverse(err.toString()));
    });

    grep.on('close', () => {
      process.stdout.write(consoleOutput);
    });

    return result;
  }


}