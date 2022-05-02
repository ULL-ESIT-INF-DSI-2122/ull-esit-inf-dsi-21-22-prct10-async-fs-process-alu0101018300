import * as net from 'net';

import {spawn} from 'child_process';
import {lstat} from 'fs';

if (process.argv.length !== 4) {
  console.log('Please, provide an order and a filename.');
} else {
  const fileName: string = process.argv[3];
  const order: string = process.argv[2];

  net.createServer((connection) => {
    console.log('A client has connected.');


    if (order === 'cat') {

      lstat(`${fileName}`, (err, stats) => {
        if (err) {
          return console.log(err);
        }
        
        if (stats.isDirectory()) {
          console.log(`Your path is not a Directory`);
        }
    
        else {
          const cat = spawn('cat', [`${fileName}`]);
          cat.stdout.on('data', (catResult) => {
            const result: string = catResult.toString("utf8");
            console.log(result)
            connection.write(result);
            connection.end();
          });
        }
      });
    }
    
    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60302, () => {
    console.log('Waiting for clients to connect.');
  });
}

