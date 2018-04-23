var assert = require("assert");
var webdriver = require("selenium-webdriver");

describe("testing javascript in the browser", function() {
  beforeEach(function() {
    if (process.env.user_name != undefined) {
      this.browser = new webdriver.Builder()
      .usingServer('http://'+ process.env.user_name+':'+process.env.access_key+'@ondemand.saucelabs.com:80/wd/hub')
      .withCapabilities({
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        username: process.env.user_name,
        accessKey: process.env.access_key,
        browserName: "chrome"
      }).build();
    } else {
      this.browser = new webdriver.Builder()
      .withCapabilities({
        browserName: "chrome"
      }).build();
    }

    return this.browser.get("http://localhost:3000/page/index.html");
  });

  afterEach(function() {
    return this.browser.quit();
  });

  it("should handle clicking on a headline", function(done) {
    var headline = this.browser.findElement(webdriver.By.css('h1'));

    headline.click();

    headline.getText().then(function(txt) {
      assert.equal(txt, "awesome");
      done();
    });
  });
});
