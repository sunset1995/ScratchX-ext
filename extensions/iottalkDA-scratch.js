"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};!function e(o,t,n){function s(r,i){if(!t[r]){if(!o[r]){var a="function"==typeof require&&require;if(!i&&a)return a(r,!0);if(c)return c(r,!0);throw new Error("Cannot find module '"+r+"'")}var f=t[r]={exports:{}};o[r][0].call(f.exports,function(e){var t=o[r][1][e];return s(t?t:e)},f,f.exports,e,o,t,n)}return t[r].exports}for(var c="function"==typeof require&&require,r=0;r<n.length;r++)s(n[r]);return s}({1:[function(e,o,t){function n(e,o,t,n){$.ajax({type:"POST",url:e+"/"+o,contentType:"application/json; charset=utf-8",data:JSON.stringify({profile:t}),success:function(e){console.log(e),console.log("register success")},error:function(e,o){console.log(e),console.log(o),console.log("register failed")},complete:function(){"function"==typeof n&&n()},dataType:"text"})}function s(e,o,t){$.ajax({type:"DELETE",url:e+"/"+o,success:function(e){console.log(e),console.log("Detach success")},error:function(e,o){console.log(e),console.log(o),console.log("Detach failed")},complete:function(){"function"==typeof t&&t()},dataType:"text"})}function c(e,o,t,n,s){$.ajax({type:"PUT",url:e+"/"+o+"/"+t,contentType:"application/json; charset=utf-8",data:JSON.stringify({data:n}),success:function(e){console.log(e),console.log("Update success")},error:function(e,o){console.log(e),console.log(o),console.log("Update failed")},complete:function(){"function"==typeof s&&s()},dataType:"text"})}function r(e,o,t,n){var s=-1;$.ajax({type:"GET",cache:!1,url:e+"/"+o+"/"+t,success:function(e){s=JSON.parse(e),s="object"===("undefined"==typeof s?"undefined":_typeof(s))&&s.samples&&s.samples[0]&&s.samples[0][1]?s.samples[0][1]:[],console.log(e),console.log("Get success")},error:function(e,o){console.log(e),console.log(o),console.log("Get failed")},complete:function(){"function"==typeof n&&n(s)},dataType:"text"})}window&&(window.IoTtalk={register:n,detach:s,update:c,get:r}),o.exports={register:n,detach:s,update:c,get:r}},{}],2:[function(e,o,t){var n={_shutdown:function(){confirm("_shutdown")},_getStatus:function(){return{status:2,msg:"Ready"}}},s={blocks:[]};o.exports={add:function(e,o,t,c){n[c]=e,s.blocks.push([o,t,c]);for(var r=s.blocks.length-1,i=4;i<arguments.length;++i)s.blocks[r].push(arguments[i])},ext:n,descriptor:s}},{}],3:[function(e,o,t){!function(o){function t(e,o,t,n){console.log(e),console.log(o),console.log(t),console.log(p),n(p[e]?p[e][o]?"object"===_typeof(p[e][o])?"undefined"!=typeof p[e][o][parseInt(t,10)]?p[e][o][parseInt(t,10)]:"undefined"!=typeof p[e][o][t.toString()]?p[e][o][t.toString()]:-1:p[e][o]:"device feature not exist":"device instance not exist")}function n(e,o){d="http://"+e+":"+o}function s(e,o){p[e]={profile:{d_name:e,dm_name:o,is_sim:!1,df_list:[]}}}function c(e,o){p[o]&&p[o].profile.df_list.push(e)}function r(e,o){p[e]&&""!==d?l.register(d,e,p[e].profile,o):o()}function i(e,o){l.detach(d,e,o)}function a(e,o,t,n){}function f(e,o,n,s){if(Date.now()-y<=g)t(e,o,n,s);else{y=Date.now();try{l.get(d,e,o,function(c){console.log(c),console.log("undefined"==typeof c?"undefined":_typeof(c)),p[e]||(p[e]={}),p[e][o]=c,t(e,o,n,s)})}catch(c){s("js bug, plase report to github")}}}var l=e("__iottalk_api.js"),u=e("__scratchX-register.js"),d="",p={},g=200,y=Date.now();u.add(n," ","set IoTtalk server %s %s","setserver","ip","port"),u.add(s," ","create device %s by model %s","create","d_name","dm_name"),u.add(c," ","add feature %s to device %s","add","df_name","d_name"),u.add(r,"w","register device %s","register","d_name"),u.add(i,"w","detach device %s","detach","d_name"),u.add(a," ","update device %s's feature %s [ %s ] = %s","update","d_name","df_name","key","val"),u.add(f,"R","get device %s's feature %s [ %d ] ","get","d_name","df_name","0"),ScratchExtensions.register("Chatroom extension",u.descriptor,u.ext)}({})},{"__iottalk_api.js":1,"__scratchX-register.js":2}]},{},[3]);