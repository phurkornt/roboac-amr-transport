const ip = require('../config/ip');
const activity_state = require('../config/activity_manage');
const { exec } = require('child_process');

exports.route = (req, res) => {
    console.log(activity_state.getData());
    res.render('main_page',{
        page:"page_routes",
        activity_state:activity_state.getData(),
        my_ip:ip.address,
        title:"ROBOAC"
    });
};

exports.routeShutdown = (req, res) => {
    res_data = ""
    if(req.query.mode === 'shutdown'){
        exec(`sudo shutdown -h now`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error starting service: ${error}`);
              return;
            }
            console.log(`Service started successfully.`);
        });
    }else if(req.query.mode === 'restart'){
        exec(`sudo reboot`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error starting service: ${error}`);
              return;
            }
            console.log(`Service started successfully.`);
        });
    }

};