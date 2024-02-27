const puppeteer = require("puppeteer");
let page;
console.log("before");
const browserOpenpromise = puppeteer.launch({
    headless:false,
    slowMo: true,
    defaultViewport: null,
    args: ["--start-maximized","--mute-audio"],
    
});
browserOpenpromise
    .then(function(browser){
        const pagesArrpromise = browser.pages();
        return pagesArrpromise;
    }).then(function(browserPages){
        page = browserPages[0];
        const gotoPromise = page.goto("https://www.google.com/");
        return gotoPromise;
    }).then(function(){
        let waitForelem = page.waitForSelector("input[type='text']", {visible:true});
        return waitForelem;
    })
    .then(function(){
        let keyPromise = page.type("input[type='text']","codewithharry");
        return keyPromise;
    }).then(function(){
        let enterPress = page.keyboard.press("Enter");
        return enterPress;
    }).then(function(){
        let waitForResult = page.waitForSelector("h3.LC20lb.MBeuO.DKV0Md",{visible:true});
        return waitForResult;
    }).then(function(){
        // mouse
        let keyPromise = page.click("h3.LC20lb.MBeuO.DKV0Md");
        return keyPromise;
    })
    .catch(function(err){
        console.log(err);
    })

console.log("after");