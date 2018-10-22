var assert = require('assert');

describe('PidgeySync', function() {
    it('uploads a file and fills the form with it', async function () {
    browser.url('https://pidgeysync.me/');
    var toUpload = '/home/ammarah/Desktop/FullStackSolutionsCapstoneProject/public/audio/sample.mp3';

    browser.chooseFile('#file', toUpload)

    var val = browser.getValue('#file')
    
    browser.click('#submit');

    browser.waitForVisible("#addWave-timeline", 3000);
    
    browser.click('#generate');

    var text = browser.getText('.row');
    assert(text === 'in this house we obey the laws of thermodynamics');
})
});