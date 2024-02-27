const puppeteer = require("puppeteer");
const xlsx = require('xlsx');

let browser;
let page;

const launchBrowser = async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: false,
    defaultViewport: null,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--user-data-dir=C:\\Users\\Shreyansh\\AppData\\Local\\Google\\Chrome\\User Data ", "--start-maximized", "--mute-audio"],
  });
  const pagesArr = await browser.pages();
  page = pagesArr[0];
};

const performActions = async () => {
    await page.goto("https://business.facebook.com/latest/inbox/messenger");
    await page.waitForSelector(".xh8yej3.x2izyaf", { visible: true });


    // const cancelbtn = await page.$('span.xmi5d70.x1fvot60.xxio538.x1heor9g.xq9mrsl.x1h4wwuj.x1pd3egz.xeuugli.xh8yej3');
    // if (cancelbtn) {
    //     await cancelbtn.click();
    // }

    // const wb = xlsx.utils.book_new();
    // const ws = xlsx.utils.json_to_sheet([]);

    const data = [];

    const scrollableSection = await page.$('div[style="position: relative; height: 446px; overflow: auto; will-change: transform; direction: ltr;"]');
    if (scrollableSection) {
        await scrollableSection.click();

        for(let i=0;i<3;i++){
            await page.waitForSelector('._a6ag._a6ah.clearfix._ikh', { visible: true });
            const children = await page.$$('._a6ag._a6ah.clearfix._ikh');

            console.log(children.length);
    
            for(let j=0;j<children.length;j++){
                // click on each child
                const child = children[j];

                await child.evaluate((e) => {
                    e.scrollIntoView();
                    e.click();
                })
                await page.waitForTimeout(2000);
    
                const rowData = [];
    
                const anchor = await page.$('div.clearfix._ikh > div._4bl7 > a');
                if(anchor){
                    const href = await page.evaluate((e) => {
                        return e.getAttribute('href');
                    }, anchor);
                    rowData.push(href);
                }
    
                const profileInfo = await page.$$('div.x14vqqas > div.x17ddzgb.x11r6d5e.x1jlp1m6.x14vqqas');
                if(profileInfo){
                    for(let i=0;i<profileInfo.length;i++){
                        const span = await profileInfo[i].$('span');
                        if(span){
                            const text = await page.evaluate((e) => {
                                return e.textContent;
                            }, span);
                            rowData.push(text);
        
                            const aTag = await span.$('a');
                            if(aTag){
                                const href = await page.evaluate((e) => {
                                    return e.getAttribute('href');
                                }, aTag);
                                rowData.push(href);
                            }
                        }
                    }
                }
    
                if(rowData.length > 0)  data.push(rowData);
            }

            // if(data.length > 0){
            //     data.forEach((row) => {
            //         xlsx.utils.sheet_add_json(ws, row);
            //     });
            //     data.length = 0;
            // }

            await scrollableSection.evaluate((e) => {
                e.scrollTop = e.scrollHeight;
            });

            await page.waitForTimeout(500); 
        }
    }    

      // Convert data to Excel and save
    const ws = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
    xlsx.writeFile(wb, 'chatsData.xlsx');
}

launchBrowser()
    .then(performActions)
    .catch((error) => console.error(error));