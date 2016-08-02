# iottalkDA-scratch document

> Note: not all ScratchX extension are credible  


1. Open [scratchX](http://scratchx.org/)
2. Click `Open Extension URL`
3. paste the extension code's url [https://sunset1995.github.io/snp/extensions/iottalkDA-scratch.js](https://sunset1995.github.io/snp/extensions/iottalkDA-scratch.js)
4. Click `Open`




## ScratchX extention block

The device profile and data will be stored in local as *cache*

- set IoTtalk server `ip` `port`
    - setting IoTtalk server url as `http://ip:port`


- create device `d_name` by model `dm_name`
    - create a device in local *cache*
    - if device instance already existed in local *cache*, replaced it


- add feature `df_name` to device `d_name`
    - add feature to device in local *cache*
    - if device not exists in *cache*, do nothing


- register device `d_name`
    - register device in *cache* to remote IoTtalk server
    - if device instance not exist in local *cache*, do nothing
    - if IoTtalk server already have the device, replaced it
    - **blocking** until all works done


- detach device `d_name`
    - detach device on IoTtalk server
    - don't care about local *cache*
    - **blocking** until all works done


- update `d_name`'s feature `df_name` `key` = `val`
    - update device's feature in local *cache*, and push `d_name` to *update queue*
    - every **200ms**, *update queue* will pop one `d_name` and put the new data to IoTtalk server


- get device `d_name`'s feature `df_name` `key`
    - get device's feature from IoTtalk server, and update to local *cache*
    - because all datas on IoTtalk server are stored as array(list in python), so `key` are required to be integer
    - if `d_name` not exist, return `device instance not exist`
    - if `df_name` not exist for specific device, return `device feature not exist`
    - if `key` not exist, return `-1`
    - **blocking** until all works done
    - **Note!!** please make sure get interval at least **200ms**. All get within threshold(200ms) will only look for local *cache* and never issue request.




## Possible scenario
