const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const ejs = require('ejs')
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('index')
  });
  const async = require('async');

  app.post('/check', async (req, res) => {
    res.sendStatus(200)
    let totalProxies = proxies.length
    const proxies = req.body.proxies.replace(/\r/g, '').split('\n');
    const target = 'http://www.google.com';
  
    let workingProxies = [];
    let failedProxies = [];
    async.eachLimit(proxies, 10, (proxy, callback) => {
      const [host, port, username, password] = proxy.split(':');
      const config = {
        proxy: {
          host: host,
          port: parseInt(port),
          auth: {
            username: username,
            password: password
          }
        }
      };
  
      const start = new Date().getTime();
      axios.get(target, config)
        .then(() => {
          const elapsed = new Date().getTime() - start;
          workingProxies.push({
            proxy: proxy,
            speed: elapsed
          });
          callback();
        })
        .catch(() => {
          failedProxies.push(proxy);
          callback();
        });
    }, () => {
      res.render('results', {
        workingProxies,
        failedProxies,
        totalProxies
      });
    });
  });
  
  
   
app.listen(3003, () => {
    console.log('Server is running on port 3000');
  });
