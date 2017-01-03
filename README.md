# redis_ui
# README #

Redis UI is a web-based administration tool for redis. It is compatible with predix and can be configured with a redis service instance on Predix.

### Contents ###

* Prerequisites
* Steps to use this application
* Contribute
* Issues

### Prerequisites ###

* Cloud Foundry client - ( Download appropriate installer for your platform - https://github.com/cloudfoundry/cli/releases) 
* Predix Account
* Git client **(optional)** ( Download appropriate installer for your platform - https://git-scm.com/downloads)

### Steps to use this application ###
**### Important: Connect to GE Network before attempting the following steps ###**



* Clone the repository in your local system. Use the following command to clone the repository
```
git clone https://github.build.ge.com/212576700/redis_ui.git
```


* Alternatively you can also download the zip of the repository using the **Download Zip** option and extract the zip contents into a folder.
* Create a redis service instance on predix if one doesn't exist **(optional)**

  * Set proxy
  ```
  On MAC/Linux:
  export https_proxy=http://3.28.29.241:88
  export http_proxy=http://3.28.29.241:88
  
  On Windows:
  set https_proxy=http://3.28.29.241:88
  set https_proxy=http://3.28.29.241:88
  ```
  You can use proxy settings of your own choice if the above proxy settings don't work for you.
  
  * Create redis service instance on predix 
  ```
  cf create-service redis-13 <plan_name> <service_instance_name>
  ```
  Sample usage:
  ```
  cf create-service redis-13 shared-vm predix_redis
  ```
  To get a complete list of plans available for redis use 
  ```
  cf m
  ```
* Open the folder where the repo contents have been cloned / extracted. There are some configuration changes which need to be made before pushing the application is to be pushed to predix.
* Open the ***config.js*** in the text editor of your choice.
* On the first line ,
```
var service_instance_name = '<your_redis_service_instance_name>';
```
replace <your_redis_service_instance_name> with your actual redis service instance name. E.g:
```
var service_instance_name = 'predix_redis';
```
* Now, open the manifest.yml file in a text editor and make the following changes:
  ```
  * Replace <your_application_name> with the application name of your choice
  * Replace <memory_allocation_for_app> with memory allocation of your choice. (I use 512M)
  * Replace <your_redis_service_instance_name> with your redis service instance name, 
    the same name which was used in the previous step for the config.js file.
  ```
  * Sample manifest.yml file:
  ```
  ---
applications:
- name: predixredis_dev
  memory: 256M
  instances: 1
  command: npm install && npm start
  services:
  - predix_redis

  ```
* Now open terminal/cmd and navigate to the directory containing the repo contents and fire **cf push** to push the app to predix
* Navigate to the app Url and login using the redis service instance name and password.
  * You can find the password and app url using:
  ```
  cf env <app_name>
  Eg: 
  cf env predixredis_dev
Getting env variables for app predixredis_dev in org shubham.patil@ge.com / space dev as shubham.patil@ge.com...
OK

System-Provided:
{
 "VCAP_SERVICES": {
  "redis-13": [
   {
    "credentials": {
     "host": "10.72.6.29",
     **"password": "<your password will be here>#credential 2",**
     "port": 37555
    },
    "label": "redis-13",
    "name": "<redis-service-instance-name>#credential 1",
    "plan": "shared-vm",
    "provider": null,
    "syslog_drain_url": null,
    "tags": [
     "pivotal",
     "redis"
    ],
    "volume_mounts": []
   }
  ]
 }
}

{
 "VCAP_APPLICATION": {
  "application_id": "144f9156-2b55-4710-a0d5-ad659386f601",
  "application_name": "predixredis_dev",
  "application_uris": [
   "predixredis-dev.run.aws-usw02-pr.ice.predix.io"
  ],
  "application_version": "e956d495-94bf-4524-9f4a-087d77e0febc",
  "limits": {
   "disk": 1024,
   "fds": 16384,
   "mem": 256
  },
  "name": "predixredis_dev",
  "space_id": "35500348-8ae4-4304-b9b1-44109194d1b9",
  "space_name": "dev",
  "uris": [
   "<app url will be here>"
  ],
  "users": null,
  "version": "e956d495-94bf-4524-9f4a-087d77e0febc"
 }
}

No user-defined env variables have been set

No running env variables have been set

No staging env variables have been set

  ```
  
### Contribute ###
* If you wish to contribute feel free to reach out to me.

### Issues ###

* If you find any issues please report them in Issues.
