const axios = require("axios");
const cron = require("node-cron")
const os = require("os")
const {foobar} = require("./ipprint")
const ARCHAEIC_URL = process.env.SERVER_URL;
const PORT = process.env.SERVER_PORT
const AUTH_TOKEN = 'bearer'
const localip  = foobar("http","0.0.0.0",PORT).localUrlForTerminal;


axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

console.log("NODE SPINNING UP");



cron.schedule('*/1 * * * *', function(){
  console.log("FIRING ANALYTICS");
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
  axios({
    method: 'post',
    url: `http://${ARCHAEIC_URL}:${PORT}/analytics/uptime`,
    data: {
      cpus,
      'osName': `${os.type()}/${os.platform()}`,
      load: os.loadavg()[1],
      submask: localip,
      'process-uptime': process.uptime(),
      'os-uptime': require('os').uptime(),
    }}
  )
  .then(function(){
    return
  })
  .catch(function(e){
    console.log(PORT,ARCHAEIC_URL);
    console.log(e.code);
  })
});
