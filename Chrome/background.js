var oauth,
  oauth_config = {
    'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key': 'anonymous',
    'consumer_secret': 'anonymous',
    'scope': 'https://spreadsheets.google.com/feeds/'
  };

/*
 * Chrome Extension oAuth source: http://developer.chrome.com/extensions/tut_oauth
 */

var app_name = localStorage.getItem('app_name');
var sheet_url = localStorage.getItem('sheet_url');

function onAuthorized() {
  if (sheet_url === null || sheet_url === "") {
    chrome.tabs.create({
      url: "options.html"
    });
  }
}

/**
 * Shows the options page to the user if they haven't added their spreadsheet url or app name yet
 */
if (app_name === null || app_name === "") {
  chrome.tabs.create({
    url: "options.html"
  });
} else {
  oauth_config.app_name = "DrivePass Chrome Extension - " + app_name;
  oauth = ChromeExOAuth.initBackgroundPage(oauth_config);
  oauth.authorize(onAuthorized);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.url === sender.tab.url && request.method === "getPW") {
    if (DrivePass.DB().get().length > 0) {
      var tabUrl = utils.getHostname(sender.url);
      var deets = DrivePass.DB({
        site: tabUrl.replace('www.', "")
      }).get();
      if (deets.length > 0) {
        sendResponse({
          username: deets[0].username,
          password: deets[0].password,
          url: sender.url
        });
      }
    }
  }
});

/*
 * setting up the right-click menu item
 */

function contextMenusOnclick(arg1, arg2) {
  switch (arg1.menuItemId) {
    case "refresh":
      console.log('reseting local cache');
      DrivePass.ResetLocal().init();
      break;
    case "gotodb":
      console.log('open DB');
      if (typeof localStorage.sheet_url === 'undefined') {
        chrome.tabs.create({
          url: "options.html"
        });
      } else {
        chrome.tabs.create({
          url: "dp_user.html"
        });
      }
      break;
  }
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "title": "refresh local data",
    "contexts": ["all"],
    "id": "refresh"
  }, function() {
    if (chrome.extension.lastError) {
      console.log("contextmenu error: " + chrome.extension.lastError.message);
    }
  });
  chrome.contextMenus.create({
    "title": "open spreadsheet",
    "contexts": ["all"],
    "id": "gotodb"
  }, function() {
    if (chrome.extension.lastError) {
      console.log("contextmenu error: " + chrome.extension.lastError.message);
    }
  });
});
chrome.contextMenus.onClicked.addListener(contextMenusOnclick);