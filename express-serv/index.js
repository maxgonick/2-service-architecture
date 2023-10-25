const express = require('express')
const app = express()
const port = 8000
const { createClient } = require('redis')

const client = createClient({
url: "redis://redis-service:6379"
});
client.on('error', err => console.log('Redis Client Error', err));

const redisInit = async () => {
    await client.connect();
    client.set('counter', 0, (err) => {
        if (err) {
          console.error('Error setting counter:', err);
        } else {
          console.log('Counter initialized');
        }
      });
    return client;
}


app.get('/', async (req, res) => {
    await client.incr('counter');
    const counter = await client.get('counter');
    res.send(`Counter: ${counter}`)
})

try {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    redisInit();
  });
} catch (err) {
  console.error('Error starting the server:', err);
}


