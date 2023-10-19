#include <ros/ros.h>
#include <tf/transform_broadcaster.h>
#include <nav_msgs/Odometry.h>
#include <geometry_msgs/Twist.h>
#include "std_msgs/String.h"

//float v_linear,v_angular;
double posX,posY,posQuat ,v_linear , v_angular;

void callback(const geometry_msgs::Twist::ConstPtr& odom_msg)
{
	  posX = odom_msg->linear.x;
   	posY = odom_msg->linear.y;  
    posQuat = odom_msg->linear.z;  
    v_linear = odom_msg->angular.x;
    v_angular = odom_msg->angular.y;
}


int main(int argc, char** argv){

  ros::init(argc, argv, "odometry_publisher");
  ros::NodeHandle n;
 
  ros::Publisher odom_pub = n.advertise<nav_msgs::Odometry>("odom", 50);
  tf::TransformBroadcaster odom_broadcaster;

  ros::Subscriber sub_left = n.subscribe("ard_odom_mode1", 10, callback);

  
  ros::Time current_time, last_time;
  current_time = ros::Time::now();
  last_time = ros::Time::now();

  ros::Rate r(10.0);
  while(n.ok()){
      
      ros::spinOnce();               // check for incoming messages

	    current_time = ros::Time::now();


       //since all odometry is 6DOF we'll need a quaternion created from yaw


       geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(posQuat);

       //first, we'll publish the transform over tf
       geometry_msgs::TransformStamped odom_trans;
       odom_trans.header.stamp = current_time;
       odom_trans.header.frame_id = "odom";
       odom_trans.child_frame_id = "base_link";

       odom_trans.transform.translation.x = posX;
       odom_trans.transform.translation.y = posY;
       odom_trans.transform.translation.z = 0.0;
       odom_trans.transform.rotation = odom_quat;

       //send the transform
       odom_broadcaster.sendTransform(odom_trans);

       //next, we'll publish the odometry message over ROS
       nav_msgs::Odometry odom;
       odom.header.stamp = current_time;
       odom.header.frame_id = "odom";

       //set the position

       odom.pose.pose.position.x = posX;
       odom.pose.pose.position.y = posY;
       odom.pose.pose.position.z = 0.0;
       odom.pose.pose.orientation = odom_quat;

       //set the velocity
       odom.child_frame_id = "base_link";
       odom.twist.twist.linear.x = v_linear;	 
       odom.twist.twist.linear.y = 0;	 
       odom.twist.twist.angular.z = v_angular;     

       //publish the message
       odom_pub.publish(odom);

       last_time = current_time;

       r.sleep();
     }
   }