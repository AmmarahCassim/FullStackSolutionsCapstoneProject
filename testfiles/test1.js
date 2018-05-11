
var webdriver = require("selenium-webdriver");

describe("testing javascript in the browser", function() {
  beforeEach(function() {
    if (process.env."AmmarahCassim" != undefined) {
      this.browser = new webdriver.Builder()
      .usingServer('http://'+ process.env."AmmarahCassim"+':'+process.env."24302255-f2d7-46f5-ac1c-9c90ec0eff11"+'@ondemand.saucelabs.com:80/wd/hub')
      .withCapabilities({
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        username: process.env."AmmarahCassim",
        accessKey: process.env."24302255-f2d7-46f5-ac1c-9c90ec0eff11",
        browserName: "chrome"
      }).build();
    } else {
      this.browser = new webdriver.Builder()
      .withCapabilities({
        browserName: "chrome"
      }).build();
    }

    return this.browser.get("http://localhost:3000/");
  });

  afterEach(function() {
    return this.browser.quit();
  });
});
