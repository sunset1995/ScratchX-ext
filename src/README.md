# iottalkDA-scratch document




## ScratchX extention block

- set IoTtalk server `ip` `port`
    - setting IoTtalk server url as `http://ip:port`


- create device `d_name` by model `dm_name`
    - create a device instance **locally**
    - if device instance already existed, replaced it


- add feature `df_name` to device `d_name`
    - add feature to device instance **locally**
    - if device instance not yet created, do nothing


- register device `d_name`
    - register local device instance to remote IoTtalk server
    - if device instance not yet created, do nothing
    - if device instance already on the IoTtalk server, replaced it
    - **blocking** until all works done


- detach device `d_name`
    - detach device on IoTtalk server
    - won't check local device instance, detach even if device not created by current ScratchX session
    - **blocking** until all works done


- update `d_name`'s feature `df_name` `key` = `val`


- get device `d_name`'s feature `df_name` `key`
    - get device's feature
    - because all datas on IoTtalk server are stored as array(list in python), so _key_ are required to be integer
    - if _d\_name_ not exist, return `device instance not exist`
    - if _df\_name_ not exist for specific device, return `device feature not exist`
    - if _key_ not exist, return `-1`
    - **blocking** until all works done
    - **Note!!** please make sure get interval at least 200ms, or it will return according local cache
