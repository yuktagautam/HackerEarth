const puppeteer=require("puppeteer");
const fs = require('fs');
let xlsx = require("xlsx");
let fileSend="";
let nodemailer = require('nodemailer');
let tab;
async function challenges(){
    let browserOpenPromise=puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized"],
    });
        let browser=await browserOpenPromise;
        let allTabsArr=await browser.pages();
        tab=allTabsArr[0];
        await tab.goto("https://www.hackerearth.com/companies/",{delay:90});
        let companydiv=".company-card-container";
        let list= await tab.evaluate(fetchList,companydiv);
       
        let fp=__dirname+"\\HackerearthJobs.xlsx";
        let fileName="HackerearthJobs";
        let content=excelReader(fp,fileName);
        for(let i=0;i<list.length;i++)
        {
            fileSend+=list[i].name+"   "+list[i].link+"\n";
            content.push(list[i]);
        }
       console.log(fileSend);
       await excelWriter(fp,content,fileName);
       sendEmail(); 
       return list;
}
function fetchList(divSelector){
      let datalist=document.querySelectorAll(divSelector);
     
      let ans=[];
      for(let i=0;i<datalist.length;i++){
          if(datalist[i].querySelector(".light.openings")){

            let obj={};
            let cname=datalist[i].querySelector(".company-card-container .name.ellipsis").innerText;
            let link="https://www.hackerearth.com"+datalist[i].getAttribute("link");
            obj.link=link;
            obj.name=cname;
            ans.push(obj);
          }
      }
      return ans;
}
function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return [];
    } else {
        
        let wt = xlsx.readFile(filePath);
        let excelData = wt.Sheets[name];
        let ans = xlsx.utils.sheet_to_json(excelData);
        return ans;
    }
}
function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
    // console.log(json);
    let newWS = xlsx.utils.json_to_sheet(json);
    // msd.xlsx-> msd
    //workbook name as param
    xlsx.utils.book_append_sheet(newWB, newWS, name);
    //   file => create , replace
    //    replace
    xlsx.writeFile(newWB, filePath);
    console.log("writing");
}
function sendEmail(){
    let mailOptions = {
        from: process.env.youremail,
        to: process.env.youremail,
        subject: 'Hacker Earth JOBS!',
        text: fileSend
    };
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.youremail,
          pass: process.env.password
        }
        
    });
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: wokring 2 ' + info.response);
      }
    });
}
module.exports=challenges;