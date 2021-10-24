const axios = require("axios");
const cron = require("node-cron")
const os = require("os")
const {foobar} = require("./ipprint")
const ARCHAEIC_URL = process.env.COLLECTION_URL;
const PORT = process.env.COLLECTION_PORT
const AUTH_TOKEN = 'bearer'
const localip  = foobar("http","0.0.0.0",PORT).lanUrlForTerminal;
console.log(foobar("http","0.0.0.0",PORT));



axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let cpus = {}
os.cpus().forEach(function(cpu){
  if( cpus[`${cpu.model}`] ){
      cpus[`${cpu.model}`].count += 1;
  }
  else{
     cpus[`${cpu.model}`] = {
       count: 1,
       speed: `${cpu.speed} Mhz`,
     }
  }
})
let initialPing = {
    cpus: JSON.stringify(cpus),
    arch: os.arch(),
    submask: localip,
    hostname: os.hostname(),
    release: os.release(),
    version: os.version(),
    ostype: os.type(),
}
console.log(initialPing);
axios({
  method: 'post',
  url: `http://${ARCHAEIC_URL}:${PORT}/api/pies/ping`,
  data: initialPing,
})
.then(function(){
  console.log("ssad;ifj");
})
.catch(function(e){
  console.log('connection failed to arhcaeic server');
})



cron.schedule('*/0.5 * * * *', function(){
  let recent =  {
    load: os.loadavg()[1],
    submask: localip,
    'process-uptime': process.uptime(),
  }
  console.log(recent);
  axios({
    method: 'post',
    url: `http://${ARCHAEIC_URL}:${PORT}/api/analytics/uptime`,
    data: recent,
  }
  )
  .then(function(){
    return
  })
  .catch(function(e){
    console.log(PORT,ARCHAEIC_URL);
    console.log(e.code);
  })
});
