var assert = require('assert');

describe('PidgeySync Prototype', function() {
    it('should have the right title - the fancy generator way', function () {
        browser.url('https://pidgeysync.me/');
        var title = browser.getTitle();
        assert.equal(title, 'PidgeySync');
    });

    it('should have a link to an About page', function(){
    	browser.url('https://pidgeysync.me/');
    	var hasAAboutLink = browser.isExisting('=About');
    	assert(hasAAboutLink);
    });
});