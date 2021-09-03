let request = require("request");
let cheerio = require("cheerio");
let fs  = require("fs");
const path  = require("path");
let puppeteer = require("puppeteer");
let browserStartPromise = puppeteer.launch({
    headless : false ,
    slowMo: 10, 
    defaultViewport: null ,

    args: ['--start-maximized' , '--disable-notifications']
});
let page , browser ;
browserStartPromise
.then(function(browserObj){
    browser = browserObj;
    console.log("Browser Tab Opened");
    let browserTabOpenPromise = browser.newPage();
    return browserTabOpenPromise;
}).then(function(newTab){
    page = newTab;
    let googlePageOpenPromise = page.goto("https://www.google.com/");
    return googlePageOpenPromise;
}).then(function(){
    console.log("Google Page Opened");
    let searchTabPromise = page.waitForSelector(".gLFyf.gsfi" , {visble: true},{delay: 100});
    return searchTabPromise;
}).then(function(){
    let searchStartPromise = page.type(".gLFyf.gsfi" , "Flipkart" , {delay: 200} , {slowMo:50});
    return searchStartPromise;
}).then(function(){
    let pressEnterPromise = page.keyboard.press("Enter" , {delay: 100});
    return pressEnterPromise;
}).then(function(){
    console.log("Flipkart Searched On Google");
    let waitPromise = page.waitForSelector(".LC20lb.DKV0Md" , {visible: true}, {delay: 100});
    return waitPromise;
}).then(function(){
    let clickPagePromise = page.click(".LC20lb.DKV0Md" , {delay: 200});
    return clickPagePromise;
}).then(function(){
    console.log("Flipkart Page Opened");
    let waitCloseBarPromise = page.waitForSelector("._2KpZ6l._2doB4z" , {visible: true});
    return waitCloseBarPromise;
}).then(function(){
    let clickClosePromise = page.click("._2KpZ6l._2doB4z");
    return clickClosePromise;
}).then(function(){
    let waitSearchBarPromise = page.click(".col-12-12._2oO9oE" , {delay:100} );
    return waitSearchBarPromise;
}).then(function(){
    let searchProductPromise = page.type(".col-12-12._2oO9oE" , "HeadPhones Over The Head" , {delay: 100});
    return searchProductPromise;
}).then(function(){
    let pressEnterProductPromise = page.keyboard.press("Enter");
    return pressEnterProductPromise;
})
.then(function(){
    let urlPagePromise = page.url();
    return urlPagePromise;
}).then(function(urlPage){
    console.log("URL Extracted");
    console.log("URL IS :   " ,urlPage);
    
    let headphoneRec  =path.join(__dirname , "Records of HeadPhones");
    dirCreator(headphoneRec);
    request(urlPage,cb);
    function cb(error , response , html){
        if(error){
            console.log(error);
        }
        else if(response.statuscode == 404){
            console.log("Page Not Found");
        }
        else{
            dataExtractor(html);
        }
    }
    function dataExtractor(html){
        let searchTool = cheerio.load(html);
        let anchorElem = searchTool(".s1Q9rs");
        let anchorElem2 = searchTool("._8VNy32 ._30jeq3");
        // let anchorElem3 = searchTool("._4ddWXP ._3LWZlK");
        // console.log(anchorElem.length);\
        for(let i = 0; i <= anchorElem.length ; i++){
            let productName = searchTool(anchorElem[i]).attr("title");
            let productPrice = searchTool(anchorElem2[i]).text().split("₹");
            
            
           
            if(productPrice == ""){

            }else{
              let file = path.join(headphoneRec,  "HeadPhone" +  i + ".json");
              let arrResult = [];
              arrResult[0] = productName;
              arrResult[1] = "₹" + productPrice[1];
              let jsonWriteable = JSON.stringify(arrResult);
              fs.writeFileSync(file, jsonWriteable);
              console.log(productName + "       " + "₹" + productPrice[1]);
      
          
         
              
            }

        }
       


    }
    function dirCreator(filePath){
        if(fs.existsSync(filePath) == false){
            fs.mkdirSync(filePath);
        }
    }


})


