const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const hostName = '127.0.0.1';
const port = 3000;

function readFile(fileName,res,callback,result){
    fs.readFile(fileName,"utf8",function(err,data){
        if(!err){
            let fData = JSON.parse(data);
            fData = callback(fData);
            console.log(fData);
            fs.writeFile("./data.json",JSON.stringify(fData),function(){
                res.statusCode = 200;
                if(result!=undefined){
                    result();
                }else{
                    res.end();
                }
            });
        }else{
            console.log(err);
        }
    })
}


let server = http.createServer(function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Custom-Header');
    console.log(req.url, req.method);

    if(req.method === "OPTIONS"){
        res.end();
    }

    if(req.url === "/" && req.method === "GET"){
        fs.readFile("./public/index.html",function(err,data){
            if(!err){
                res.end(data);
            }
        })
    }
    if(req.url === "/index.css" && req.method === "GET"){
        console.log("javascript file");
        fs.readFile("./public/index.css","utf-8",function(err,data){
            if(!err){
                res.end(data);
            }
        })
    }
    if(req.url === "/index.js" && req.method === "GET"){
        fs.readFile("./public/index.js","utf8",function(err,data){
            if(!err){
                res.setHeader("Content-Type","application/javascript");
                res.end(data);
            }
        })
    }

    if(req.url === "/getData" && req.method === "GET"){
        fs.readFile("./data.json","utf8",function(err,data){
            res.setHeader("Content-Type","application/json");
            if(!err){
                res.end(data);
            }else{
                res.end("Error");
            }
        })
    }

    if(req.url === "/getData" && req.method === "PUT"){
        let body = "";
        req.on("data",(char)=>{
            body+=char;
        })
        req.on("end",()=>{
            let data = JSON.parse(body);
            console.log(data);
            readFile("./data.json",res,function(fileData){
                fileData =fileData.map((element)=>{
                    if(element.id == data.id){
                        element.statu = data.stat;
                    }
                    return element;
                })
                return fileData;
            },function(){
                res.end();
            })
        })
    }

    if(req.url === "/getData" && req.method === "DELETE"){
        let body = "";
        req.on("data",function(element){
            body+=element;
        })
        req.on("end",function(){
            let data = JSON.parse(body);
            console.log(data);
            res.statusCode = 101;
            readFile("./data.json",res,function(fileData){
                fileData = fileData.filter((element)=>{
                    if(element.id == data.id){
                        return false;
                    }
                    return true;
                })
                return fileData;
            })
        })
    }

    if(req.url === "/getData" && req.method === "POST"){
        console.log("Test");
        let body = "";
        req.on("data",function(element){
            body+=element;
        })
        req.on("end",function(){
            console.log(body);
            let data = JSON.parse(body);
            console.log(data);
            let id = 'a'+crypto.randomBytes(5).toString('hex');
            let obj={
                title   :data.title,
                id      :id,
                statu: false
            }
            console.log(obj);
            let dataToReturn  = JSON.stringify(obj)
            console.log(dataToReturn);
            readFile("./data.json",res,function(fileData){
                fileData.push(obj);
                return fileData;
            },function(){
                res.setHeader("Content-Type","application/JSON");
                res.end(dataToReturn);
            })
        })

    }

})

server.listen(port,hostName);