window.Ply={VERSION:"0.4.2"},Ply.core=function(){"use strict";var e={},t=0,n=!1;return{notify:function(t,n,s){for(var o=e[t]||(e[t]=[]),r=0,a=o.length;a>r;r++)o[r].handler.call(o[r].listener,t,n,s)},listen:function(n,s,o){var r=e[n]||(e[n]=[]),a=n.split(/\s/),i=a.length,u=0;{if(!(i>1))return r.push({id:t+=1,handler:s,listener:o}),[n,t];for(;i>u;u++)this.listen(a[u],s,o)}},ignore:function(t){var n=t[0];e[n]&&e[n].forEach(function(s){this.id===t[1]&&e[n].splice(s,1)})},log:function(e,t){if(n&&window.console)switch(t){case"warn":window.console.warn(e);break;case"info":window.console.info(e);break;default:window.console.log(e)}},error:function(e,t){if(Ply.config.core.onError&&"function"==typeof Ply.config.core.onError)return void Ply.config.core.onError(e,t);throw e},debug:function(e){n="undefined"==typeof e?!0:e,n?(this.log("debugging...","info"),this.debugOn=!0):this.debugOn=!1},debugOn:function(){return!!n}()}}();var DrivePass=DrivePass||{};DrivePass.Browser={isChrome:function(){return/Chrome/.test(navigator.userAgent)},isFirefox:function(){return/Firefox/.test(navigator.userAgent)},sendToPage:function(e){var t=e||{};return 2!==Object.keys(t).length?!1:void(this.isChrome()&&chrome.tabs.getSelected(null,function(e){chrome.tabs.sendMessage(e.id,{password:t.password,username:t.username},function(e){console.log(e.dom)})}))},getActiveTab:function(e){this.isChrome()&&chrome.tabs.query({active:!0,lastFocusedWindow:!0},function(t){var n=t[0];this.activeTabUrl=utils.getHostname(n.url),"function"==typeof e&&e()}.bind(this))},oAuthSendRequest:function(e,t,n){if(this.isChrome()){var s=chrome.runtime.getBackgroundPage();s.oauth.sendSignedRequest(e,t,n)}}};var DrivePass=DrivePass||{};DrivePass.GoogleSpreadsheet=function(){var e,t={},n=function(e){var n=JSON.parse(e),s=0,o={},r=n.feed.entry,a=t.columns;for(var i in r){o[s]={};for(var u=0;u<a.length;u++){var c="gsx$"+a[u];o[s][a[u]]=r[i][c].$t}s++}return o},s=function(s,o){return 200!==o.status?(e={success:!1,message:o.status+": Connection Failed"},console.warn(o)):(e={success:!0,message:"spreadsheet successfully loaded"},e.sheetData=n(s)),localStorage.setItem("_data",JSON.stringify(e)),null!==t.cb&&t.cb(e),e},o=function(e){t.cb="function"==typeof e?e:null;var n={headers:{"GData-Version":"3.0"},parameters:{alt:"json",showfolders:"true"}};DrivePass.Browser.oAuthSendRequest(t.jsonListUrl,s,n)},r=function(e,n){t.cb="function"==typeof n?n:null;var s={method:"POST",headers:{"GData-Version":"3.0","Content-Type":"application/atom+xml"},body:a(e)};DrivePass.Browser.oAuthSendRequest(t.jsonListUrl,i,s)},a=function(e){for(var n='<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">\n',s=t.columns,o=0;o<s.length;o++)n+="<gsx:"+s[o]+">"+e[o]+"</gsx:"+s[o]+">\n";return n+="</entry>"},i=function(n,s){return 201!==s.status?(e={success:!1,message:s.status+": error saving"},console.warn(s)):e={success:!0,message:"saved successfully"},o(),null!==t.cb&&t.cb(e),e},u=function(e){if(t=e||{},"string"!=typeof t.sheet_url||"object"!=typeof t.columns)throw new Error("Missing sheet_url or columns from init options");var n,s,o=t.sheet_url;if(o.match(/http(s)*:/)){n=o;try{s=n.match(/key=(.*?)(&|#)/)[1]}catch(r){s=n.match(/(cells|list)\/(.*?)\//)[2]}}else s=o;return t.jsonListUrl="https://spreadsheets.google.com/feeds/list/"+s+"/od6/private/full",t.jsonCellsUrl="https://spreadsheets.google.com/feeds/cells/"+s+"/od6/private/basic",this};return{init:u,load:o,add:r}};var DrivePass=DrivePass||{};DrivePass.Generator=function(){var e=document.getElementById("uppercase"),t=document.getElementById("lowercase"),n=document.getElementById("numbers"),s=document.getElementById("show_symbols"),o=document.getElementById("symbols"),r=document.getElementById("pw"),a=function(){var r="",a=0,i="",u=document.getElementById("digits").value||15;if(2>u&&(u=7),[e,t,n].forEach(function(e){if(e.checked===!0){i+=e.value;var t=e.value.length;r+=e.value.charAt(Math.floor(Math.random()*t)),a++}}),s.checked===!0){i+=o.value;var c=o.value.length;r+=o.value.charAt(Math.floor(Math.random()*c)),a++}return[u,i,r,a]},i=function(e){e.preventDefault();for(var t=a(),n=t[0]-t[3],s=t[1],o="",i=0,u=s.length;n>i;++i)o+=s.charAt(Math.floor(Math.random()*u));return o+=t[2],r.textContent=o,r.className="generated",!0},u=function(){document.getElementById("makePassword").addEventListener("click",i,!1)};return{init:u}};var DrivePass=DrivePass||{};DrivePass.Popup=function(){var e,t=document.getElementById("loading"),n=document.getElementById("status"),s=document.getElementById("un"),o=document.getElementById("pw"),r=document.getElementById("add"),a=document.getElementById("theInfo"),i=JSON.parse(localStorage.getItem("_data")),u=new DrivePass.GoogleSpreadsheet;u.init({sheet_url:localStorage.getItem("sheet_url"),columns:["site","username","password"]}),null===i&&(u.load(),i=JSON.parse(localStorage.getItem("_data")));var c=function(e,t){var n=e||{};if(Object.keys(n).length){for(var s in n)if(-1!==t.indexOf(n[s].site)){var o=[];return o.push(n[s].username,n[s].password),o}}else console.warn("findPW: data not an object")},l=function(e,t){var s=e||"",o=t||"";""!==s&&""!==o&&(n.textContent=o,n.className=s,n.style.display="block")},d=function(e){t.style.display="none",l("success","password found"),s.textContent=e[0],o.textContent=e[1],DrivePass.Browser.sendToPage({username:e[0],password:e[1]}),r.textContent="update"},f=function(){t.style.display="none",l("error","password not found"),utils.toggle(a)},m=function(){r.addEventListener("click",function(){var t=document.getElementById("un").textContent,n=document.getElementById("pw").textContent,s=[e,t,n];u.add(s,function(e){e.success===!1?l("error",e.message):l("success",e.message)})},!1)},g=function(){e=DrivePass.Browser.activeTabUrl;var t=c(i.sheetData,e);"undefined"==typeof t?f():d(t)},h=function(){DrivePass.Browser.getActiveTab(g),m()};return{init:h}};var DrivePass=DrivePass||{};DrivePass.Router=function(){function e(e){this.methods=e,this.process()}return e.prototype.process=function(){this.methods.universal();var e=document.body.dataset.route;if("undefined"!=typeof e){var t=this.methods[e];"function"==typeof t&&t()}},e}();var utils={toggle:function(e){e.classList.contains("show")?e.classList.remove("show"):e.classList.add("show")},toggler:function(e,t){var n=this,s=document.getElementById(t);document.getElementById(e).addEventListener("click",function(){n.toggle(s)},!1)},getHostname:function(e){var t=e||"",n=document.createElement("a");return""!==t?(n.href=t,n.hostname):(console.warn("url undefined"),!1)}},DrivePass=DrivePass||{};DrivePass.ext=new DrivePass.Router({universal:function(){DrivePass.Settings=JSON.parse(localStorage.getItem("options"))||{},DrivePass.Settings.route=document.body.dataset.route},popup:function(){var e=function(){utils.toggler("showGPoptions","gpOptions"),utils.toggler("showInfo","theInfo"),utils.toggler("show_symbols","hidden_symbols")},t=new DrivePass.Popup,n=new DrivePass.Generator;document.addEventListener("DOMContentLoaded",function(){this.bDone||(this.bDone=!0,n.init(),t.init(),e())})},chrome_options:function(){function e(){localStorage.setItem("sheet_url",document.getElementById("sheet_url").value),document.getElementById("status").textContent="Options Saved."}function t(){var e=localStorage.getItem("sheet_url");if(!e||""===e)return!1;document.getElementById("sheet_url").value=e,document.getElementById("save").textContent="update";var t=document.getElementById("goToSheet");t.href=e,t.style.display="block"}document.addEventListener("DOMContentLoaded",t),document.getElementById("save").addEventListener("click",e)}});