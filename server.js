import express from 'express';
import Docker from 'dockerode';
import stream from 'stream';
import fs from 'fs';
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
var container = docker.getContainer('mcserve-server-1');


// create a single stream for stdin and stdout
var logStream = new stream.PassThrough();
// logStream.on('data', function (chunk) {
//   console.log(chunk.toString('utf8'));
// });

container.logs({
  follow: true,
  stdout: true,
  stderr: true,
  tail: 200
}, function (err, stream) {
  if (err) {
    return logger.error(err.message);
  }
  stream.pipe(logStream);
  stream.on('end', function () {
    logStream.end('!stop!');
  });
});




var logStream2 = new stream.PassThrough();

container.attach({
  stream: true,
  stdin: true,
  stdout: false,
  stderr: false
}, function (err, stream) {
  if (err) {
    return logger.error(err.message);
  }
  // stream.write(cmd + "\n", function (err, data) {
  //   if (err) {
  //     return logger.error(err.message);
  //   }
  //   stream.end();
  // });
  //container.modem.demuxStream(stream, logStream2, logStream2);
  logStream2.on('data', function (chunk) {
    console.log(chunk.toString('utf8'));
    stream.write(chunk.toString('utf8'), function (err, data) {
      if (err) {
        return logger.error(err.message);
      }
    });
  });
  stream.on('end', function () {
    logStream2.end('!stop!');
  });
});




const app = express()
const port = 3000

app.get('/logs', (req, res) => {
  console.log(containerLogs(container));
  res.send("hello world");
})

app.get('/send', (req, res) => {
  console.log("send");
  var cmd = req.query.cmd;
  console.log(cmd);
  if (cmd == null) {
    res.status(400);
    return;
  }
  logStream2.write(cmd + "\n");
  res.send("ok");
})


//TODO: create input and output stream via attach and keep them open


//TODO: than deliver them on two endpoints or as a single websocket stream




app.get('/logs_sse', (req, res) => {
  console.log(containerLogs(container));
  console.log("logs_sse");
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
  });
  res.flushHeaders();

  res.write('retry: 10000\n\n');

  logStream.on('data', function (chunk) {
    console.log(chunk.toString('utf8'));
    res.write("data: " + chunk.toString('utf8') + "\n\n");
  });
})

function containerLogs(container) {

  // create a single stream for stdin and stdout
  var logStream = new stream.PassThrough();
  logStream.on('data', function (chunk) {
    console.log(chunk.toString('utf8'));
  });

  container.logs({
    follow: true,
    stdout: true,
    stderr: true
  }, function (err, stream) {
    if (err) {
      return logger.error(err.message);
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', function () {
      logStream.end('!stop!');
    });

    // setTimeout(function () {
    //   stream.destroy();
    // }, 2000);
  });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})