# iottalkDA-scratch document




## ScratchX extention block

#### set IoTtalk server __url__ __port__
- setting IoTtalk server address


#### create device __d\_name__ by model __dm\_name__
- create a device instance *locally*
- if device instance already existed, replaced it


#### add feature __df\_name__ to device __d\_name__
- add feature to device instance *locally*
- if device instance not yet created, do nothing


#### register device __d\_name__
- register local device instance to remote IoTtalk server
- if device instance not yet created, do nothing
- if device instance already on the IoTtalk server, replaced it
- *blocking* until all works done


#### detach device __d\_name__
- detach device on IoTtalk server
- won't check local device instance, detach even if device not created by current ScratchX session
- *blocking* until all works done


#### update %s\'s feature %s[%s] = %s


#### get %s\'s feature %s[%s]
