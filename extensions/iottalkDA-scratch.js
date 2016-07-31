"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};!function e(t,o,n){function r(c,i){if(!o[c]){if(!t[c]){var u="function"==typeof require&&require;if(!i&&u)return u(c,!0);if(s)return s(c,!0);throw new Error("Cannot find module '"+c+"'")}var l=o[c]={exports:{}};t[c][0].call(l.exports,function(e){var o=t[c][1][e];return r(o?o:e)},l,l.exports,e,t,o,n)}return o[c].exports}for(var s="function"==typeof require&&require,c=0;c<n.length;c++)r(n[c]);return r}({1:[function(e,t,o){function n(e,t,o,n){$.ajax({type:"POST",url:e+"/"+t,contentType:"application/json; charset=utf-8",data:JSON.stringify({profile:o}),success:function(e){console.log(e),console.log("register success")},error:function(e,t){console.log(e),console.log(t),console.log("register failed")},complete:function(){"function"==typeof n&&n()},dataType:"text"})}function r(e,t,o){$.ajax({type:"DELETE",url:e+"/"+t,success:function(e){console.log(e),console.log("Detach success")},error:function(e,t){console.log(e),console.log(t),console.log("Detach failed")},complete:function(){"function"==typeof o&&o()},dataType:"text"})}function s(e,t,o,n,r){$.ajax({type:"PUT",url:e+"/"+t+"/"+o,contentType:"application/json; charset=utf-8",data:JSON.stringify({data:n}),success:function(e){console.log(e),console.log("Update success")},error:function(e,t){console.log(e),console.log(t),console.log("Update failed")},complete:function(){"function"==typeof r&&r()},dataType:"text"})}function c(e,t,o,n){var r=-1;$.ajax({type:"GET",cache:!1,url:e+"/"+t+"/"+o,success:function(e){r=e,console.log(e),console.log("Get success")},error:function(e,t){console.log(e),console.log(t),console.log("Get failed")},complete:function(){"function"==typeof n&&n(r)},dataType:"text"})}window&&(window.IoTtalk={register:n,detach:r,update:s,get:c}),t.exports={register:n,detach:r,update:s,get:c}},{}],2:[function(e,t,o){var n={_shutdown:function(){},_getStatus:function(){return{status:2,msg:"Ready"}}},r={blocks:[]};t.exports={add:function(e,t,o,s){n[s]=e,r.blocks.push([t,o,s]);for(var c=r.blocks.length-1,i=4;i<arguments.length;++i)r.blocks[c].push(arguments[i])},ext:n,descriptor:r}},{}],3:[function(e,t,o){!function(t){function o(e){u.url=e}function n(e,t){if(null!==u.mac)return void t();u.mac=e;var o=function(){u.registered=!0,t()};c.register(u.url,e,a,o)}function r(e,t,o){if(l[e]=t,null===u.url)return void o();var n=JSON.stringify(l);c.update(u.url,u.mac,"General_input",[n],o)}function s(e,t,o,n){if(null===u.url)return void n();var r=function(e){if("object"===("undefined"==typeof e?"undefined":_typeof(e))&&e.samples&&e.samples[0]&&e.samples[0][1]){var t=JSON.parse(e.samples[0][1]);n(t[o]||-1)}else n(-1)};c.get(u.url,e,t,r)}var c=e("__iottalk_api.js"),i=e("__scratchX-register.js"),u={url:null,mac:null,registered:!1},l={},a={d_name:"ScratchX",dm_name:"ScratchX",is_sim:!1,df_list:["General_input","General_output"]};i.add(o," ","set remote server as %s","setServer","url"),i.add(n,"w","register mac address as %s","register","mac"),i.add(r,"w","update %s %s","update","key","val"),i.add(s,"R","get %s %s %s","get","mac","feature","key"),ScratchExtensions.register("Chatroom extension",i.descriptor,i.ext)}({})},{"__iottalk_api.js":1,"__scratchX-register.js":2}]},{},[3]);