const launchType = {
  CREATE_MAP: "roslaunch ~/Desktop/roboac-amr-transport/launch/createmap.launch",
  SAVE_MAP:   "rosrun map_server map_saver -f ~/Desktop/roboac-amr-transport/manager/map",
  OPEN_MAP:   "rosrun map_server map_server ~/Desktop/roboac-amr-transport/manager/map",
  NAVIGATION: "roslaunch ~/Desktop/roboac-amr-transport/launch/nav3-dwa/robot_navigation.launch"
}


module.exports.launchType = launchType;