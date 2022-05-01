# Practica 10
## Sistema de ficheros y creación de procesos en Node.js

En esta práctica se plantean una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.

### Ejercicio 1

Mediante el siguiente código, se debe contestar a una serie de preguntas:

``` typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

#### Traza de ejecución

En primer lugar, aparece el evento *access* en la pila de llamadas, comprobando los permisos del usuario. Además, hace uso
de *constants*, que comprueba la existencia del fichero. Seguidamente, se pasa a la API para pasar el manejador a la cola
de los mismos. La cola realiza su función, es decir, comprobar que el blucle de eventos compruebe que la pila de llamadas 
esté vacía. Si es así, access entrará a la pila de llamadas y se ejecutará.

Después, *watcher* entra a la pila de llamadas, el cual se quedará esperando hasta que el fichero en cuestión sufra una
modificación. Cuando el fichero sufre una modificación, el evento pasa a la cola de manejadores y confirmó, como en el 
caso anterior a que el bucle de eventos revisara la pila de llamadas para pasar el evento a la misma y que este se pudiera
ejecutar.

### Ejercicio 2

Implemente un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto. Para acceder al contenido del fichero deberá expandir el comando cat de Unix/Linux, además de expandir el comando grep con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.

#### Desarrollo

En este caso, se ha planteado una solución bastante sencilla al problema planteado. Esto es, se han almacenado los dos comandos 
en funciones dentro del fichero, ambos comandos van a tener la misma estructura, es decir, una función que hace uso de yargs
para poder ejecutarlo en forma de comando y que va a llamar que va a realizar la operación en sí.

##### Comando Cat

``` typescript
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
  ``` 
  
  Esta sería la función que hace uso de yargs, para realizar el semejante del comando cat, como vemos es un comando
  que se la va a pasar únicamente una opción, la cual se ha denominado *file* y será la ruta del fichero que queremos
  mostrar en formato string. Posteriormente, en el *handler* se crea un objeto de la clase en cuestión para llamar
  al método *catFile()*, el cual explicaremos a continuación:
  
  ``` typescript
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
  ``` 
  En este caso, es una función que recibe como parámetro un string, el cual será el nombre del fichero del que
  queremos mostrar su contenido. Retorna un booleano, puesto que aunque este no afecta a la ejecución del código
  nos sirve para probar el correcto funcionamiento del método (Esto es así para todas las funciones). En caso 
  de que no haya ningún error, este mostrará el contenido del fichero mediante cat, comando que podemos ejecutar
  gracias a *spawn*. En caso de que haya algún error nos mostrará el mensaje de error en color rojo, mediante
  la herramienta *chalk*.
  
  ##### Comando Grep
  
  ``` typescript
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
  ```
  
  En esta caso sucede exactamente igual que en lo anterior, pero además de la opción *file*, se le pasa la opción
  *expression*, la cual es la expresión que queremos comprobar dentro del fichero. Por otra parte, este llamará a 
  la función *grepFile()*, la cual se explicará a continuación.
  
  ``` typescript
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
  ``` 
  
  En este caso, a la función se le pasan dos parámetros, la ruta del fichero como el caso anterior y la 
  expresión que queremos encontrar dentro del fichero. En este caso, también comprobamos que haya errores
  para que si no los hay, haga uso, mediante *spawn* de los comandos *cat* y *grep*. Los resultados coincidentes
  se almacenarán en un string que concatena las ocurrencias para posteriormente mostrarlas al usuario.
  
  ##### Index
  
  ``` typescript
  const testCommands: Commands = new Commands();

testCommands.catNoPipes();
testCommands.catWithGrep();

yargs.parse();
``` 
En el fichero *index.js* simplemente deberemos crear un objeto de la clase en cuestión, llamar a los métodos 
que hacen uso del yargs y finalmente, hacer el parse para que se pueda ejecutar el código correctamente.

### Ejercicio 4

Desarrolle una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

- Dada una ruta concreta, mostrar si es un directorio o un fichero.
- Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro. 
- Listar los ficheros dentro de un directorio.
- Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
- Borrar ficheros y directorios.
- Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta
origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

#### Desarollo

La solución planteada es igual que en el caso del ejercicio 2, es decir, una clase que va a contener todas 
las operaciones que deseamos realizar, que almacena métodos donde se hace uso del yargs, donde hay que pasar 
las opciones correspondientes, que a su vez van a llamar a los métodos que van a realizar el proceso en cuestión.

##### Check 

Esta función comprobará, si una ruta es un fichero o un directorio:

``` typescript
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
  ``` 
  En este caso, el yargs solo solicitar una opción, la cual es la ruta del elemento que deseamos comprobar
  en formato string. Posteriormente creará un objeto de la clase en cuestión y llamará el método *FileOrDirectory()*.
  
  ``` typescript
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
  ``` 
  
  Esta función, a la que se le pasa la ruta del elemento como parámetro, comprobará mediante la herramienta
  *lstat* si el elemento es un fichero o un directorio, mostrando ese resultado en consola tras la comprobación.
  
  ##### Mkdir
  
  ``` typescriptcreateADirectory() {
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
  ``` 
  
  Al igual que en el caso anterior, yargs solo pide una opción, que en este caso será el nombre del nuevo directorio.
  Además, esta llama a la función *newDir()*.
  
  ``` typescript
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
  ``` 
  
  Esta función, a la que se le pasa el nombre del directorio como parámetro, creará un fichero mediante
  la herramienta *mkdir* de fs. En caso de error mostrará el mensaje de error y en caso de no haber problemas
  mostrará el mensaje de que todo ha ido bien.
  
  ##### Ls
  
  ``` typescript
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
  ``` 
  En este caso, vuelve a suceder que *yargs* pide únicamente una opción, que en este caso será la ruta 
  del directorio que se desea mostrar su contenido. Además, llama a la función *list()*.
  
  ``` typescript
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
  ```
  
  En este caso, también se hace uso de *lstat* para comprobar si es un fichero o un directorio, para informar
  del error en caso de que sea del primero. En caso de que sea un direcrotio, mediante *spawn* se hace un ls
  de la ruta en cuestión.
  
  ##### Cat
  
  En este caso, el comando cat es prácticamente igual al del ejercicio 2.
  
  ``` typescript
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
  ``` 
  Esta sería la función que hace uso de yargs, para realizar el semejante del comando cat, como vemos es un comando
  que se la va a pasar únicamente una opción, la cual se ha denominado *file* y será la ruta del fichero que queremos
  mostrar en formato string. Posteriormente, en el *handler* se crea un objeto de la clase en cuestión para llamar
  al método *catFunction()*, el cual explicaremos a continuación:
  
  ``` typescript
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
```

En este caso, se comprueba que la ruta sea un fichero, para que si no es el caso informar del error. En caso de que sí
sea un fichero pues se hace uso de *spawn*, el cual realizará el comando cat sobre la ruta en cuestión.

##### Remove

``` typescript
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
```
En este caso, también se pasa una opción al comando, la cual contendrá la ruta del elemento que se desea eliminar. 
Esta llamará a la función *remove()*:

``` typescript
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
```

En este caso, se comprueba si es un fichero o un directorio, para que, si es un fichero se haga uso de la herramienta
*unlink* de *fs* y si es un directorio, *rmdir*. En ambos casos, si hay algún error se mostrará un mensaje conteniendo
el mismo y si no, mostrará un mensaje informando de que todo ha salido correctamente.

##### Mv

``` typescript
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
```
En este caso, serán necesarias tres opciones, la ruta de origen, la ruta de destino y un flag que nos dirá
si copiamos o movemos el elemento. Esta llamará a la función *move()*:

``` typescript
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
``` 
En la ejecución, dependiendo del flag, realizaremos el comando *mv* o el comando *cp*, ambos generados 
por *spawn* de la misma manera. En caso de que haya errores se informará al usuario y en caso de que todo
haya salido bien también se informará al usuario.


  




