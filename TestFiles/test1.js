var webdriver = require('selenium-webdriver'),
    username = "AmmarahCassim",
    accessKey = "24302255-f2d7-46f5-ac1c-9c90ec0eff11",
    driver;

driver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'chrome',
    'platform': 'Windows XP',
    'version': '43.0',
    'username': username,
    'accessKey': accessKey,
    'public': true
  }).
  usingServer("http://" + username + ":" + accessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();

driver.get("localhost:3000");

driver.getTitle().then(function (title) {
    console.log("title is: " + title);
});

driver.quit();
