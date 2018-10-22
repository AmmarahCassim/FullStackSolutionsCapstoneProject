var assert = require('assert');

describe('PidgeySync', function() {
    it('uploads a file and fills the form with it', async function () {
    browser.url('https://www.pidgeysync.me/');
    var toUpload = '/home/ammarah/Desktop/FullStackSolutionsCapstoneProject/public/audio/letsparty.wav';

    browser.chooseFile('#file', toUpload)

    var val = browser.getValue('#file')
    expect(/letsparty.wav/.test(val)).to.be.equal(true)
})
});