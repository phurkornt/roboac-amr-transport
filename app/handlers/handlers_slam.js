const ip = require('../config/ip');
const activity_state = require('../config/activity_manage');
const node_manager = require('../config/node_manager');

const {launchType} = require('../util/launch.type');

const fs = require('fs');
const path = require('path')



exports.slam = (req, res) => {
    console.log(activity_state.getData());
    res.render('main_page',{
        page:"page_slam",
        activity_state:activity_state.getData(),
        my_ip:ip.address,
        title:"Create Map"
    });
};


exports.slam_config = (req, res) => {
    console.log(req.query);
    let status = activity_state.getData().status;
    let mode = req.query.mode;
    let outData = 'Error'
    switch(mode){
        case 'open':
            if( status == 0){
                node_manager.send_data({
                    topic:"slam",
                    script:launchType.CREATE_MAP,
                    mode:"start"
                });
                activity_state.writeData(1);
                outData = 'OK'
            }
            break        
        case 'save':
            mapname = req.query.map_name;
            node_manager.send_data({
                topic:"save_map",
                script:`${launchType.SAVE_MAP}/${mapname}`,
                mode:"once"
            });
            mypath = path.join(__dirname , '..' ,'data','waypoint')
            const data = {
                map: mapname,
                plan:{}
            };
            const jsonData = JSON.stringify(data);
            fs.writeFileSync( `${mypath}/${mapname}.json`, jsonData);
            outData = 'OK'
            break        
        case 'close':
            node_manager.send_data({
                topic:"slam",
                mode:"stop"
            });
            activity_state.writeData(0);
            outData = 'OK'
            break        
    }
    res.send(outData);
};
