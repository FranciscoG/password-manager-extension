var DrivePass = DrivePass || {};

DrivePass.Popup = (function() {

  // caching DOM elements
  // I'm not using jQuery so the $ represents element IDs only
  var $loading = document.getElementById('loading'),
      $status = document.getElementById('status'),
      $un = document.getElementById('un'),
      $pw = document.getElementById('pw'),
      $add = document.getElementById('add'),
      $update = document.getElementById('update'),
      $theInfo = document.getElementById('theInfo'),
      $hiddenSite = document.getElementById('hdnSite'),
      theData = JSON.parse(localStorage.getItem('_data')),
      fullData = JSON.parse(localStorage.getItem('_full')),
      activeUrl;

  var Sheet = new DrivePass.GoogleSpreadsheet();

  Sheet.init({
    sheet_url : localStorage.getItem('sheet_url'),
    columns : ['site','username','password']
  });

 /**
  * Searches through the spreadsheet data for the matching domain
  * @param  {object}  data - json object
  * @param  {string}  tabDomain
  * @return {array}   [username,password]
  */
  var findPW = function(data,tabDomain) {
    var _data = data || {};
    if (Object.keys(_data).length) {
      for (var prop in _data) {
        if (tabDomain.indexOf(_data[prop].site) !== -1) {
          var result = [];
          result.push(_data[prop].username,_data[prop].password,_data[prop].site);
          return result;
        }
      }
    } else {
      console.warn('findPW: data not an object');
    }
  };

  /**
   * Updates the status element ID and displays it
   * @param  {string} status
   * @param  {string} message
   */
  var handleStatus = function(status,message) {
    var stat = status || '';
    var msg = message || '';
    if (stat !== '' && msg !== '') {
      $status.textContent = msg;
      $status.className = stat;
      $status.style.display = "block";
    }
  };

  /**
   * run on successful load of google spreadsheet
   * @param  {object} result  - json object
   */
  var onSuccess = function(result){
    $loading.style.display = "none";
    handleStatus('success','password found');
    $un.textContent = result[0];
    $pw.textContent = result[1];
    $hiddenSite.value = result[2];
    
    DrivePass.Browser.sendToPage({username: result[0], password: result[1]});
    
    utils.toggle($add);
    utils.toggle($update);
  };

  /**
   * handle UI updates when password not found
   */
  var pwNotFound = function(){
    $loading.style.display = "none";
    handleStatus('error','password not found');
    utils.toggle($theInfo);
  };

  /**
   * bind the event listener that handles adding a new entry into the google spreadheet
   */
  var bindAdd = function(){
    $add.addEventListener('click', function(evt) {
      var un = document.getElementById('un').textContent;
      var pw = document.getElementById('pw').textContent;
      var data = [activeUrl,un,pw];
      Sheet.add(data,function(result){
        if (result.success === false){
          handleStatus('error',result.message);
        } else {
          handleStatus('success', result.message);
        }
      });
    },false);
  };

  var bindUpdate = function(){
    $update.addEventListener('click', function(evt){
      var _site = $hiddenSite.value;
      var entry = findEntry(_site);
      var un = document.getElementById('un').textContent;
      var pw = document.getElementById('pw').textContent;
      var data = [_site,un,pw];
      Sheet.update(entry,data);
    }, false);
  };

  /**
   * Get Object key that matches site name, used when update information
   * @param  {string} site      the website that you're trying to change data for
   * @return {string}           the object key
   */
  var findEntry = function(site){
    for (var entry in fullData.feed.entry) { 
      if (fullData.feed.entry[entry].gsx$site.$t === site){
        return fullData.feed.entry[entry];
      }
    }
  };

  var initCb = function(){
    /*
    TODO: check local storage option and either run below or do sheet.load with callback
    */
    activeUrl = DrivePass.Browser.activeTabUrl;
    var found = findPW(theData.sheetData,activeUrl);
    if (typeof found === 'undefined') {
      pwNotFound();
    } else {
      onSuccess(found);
    }
  };

  var init = function() {
    if (theData === null) {
      DrivePass.Signal.listen('gs_data_loaded', function(topic,response_data){
        localStorage.setItem('_data', JSON.stringify(response_data));
        if (response_data.success === true) {
          theData = response_data;
          fullData = JSON.parse(localStorage.getItem('_full'));
          DrivePass.Browser.getActiveTab(initCb);
        }
      });
      Sheet.load();
    } else {
      DrivePass.Browser.getActiveTab(initCb);
    }

    bindAdd();
    bindUpdate();
  };

  return {
    init: init
  };
});