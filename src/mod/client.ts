import * as net from 'net';

const client = net.connect({port: 60302});

client.on('data', (dataJSON) => {
  const message = dataJSON;
  

  if (message) {
    console.log(message.toString("utf-8"));
  } else {
    console.log(`Connection unestablished correctly`);
  }
});	