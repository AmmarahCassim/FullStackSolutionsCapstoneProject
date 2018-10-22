var Cloud = require('mocha-cloud');
var cloud = new Cloud('pidgeysync', 'AmmarahCassim', '24302255-f2d7-46f5-ac1c-9c90ec0eff11');
cloud.browser('iphone', '5.0', 'Mac 10.6');
cloud.browser('ipad', '6', 'Mac 10.8');
cloud.url('http://localhost:5000/');

cloud.on('init', function(browser){
  console.log('  init : %s %s', browser.browserName, browser.version);
});

cloud.on('start', function(browser){
  console.log('  start : %s %s', browser.browserName, browser.version);
});

cloud.on('end', function(browser, res){
  console.log('  end : %s %s : %d failures', browser.browserName, browser.version, res.failures);
});

cloud.start();