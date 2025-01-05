const express = require('express');
const mongoose = require('mongoose');
const app = express();
const shortUrl = require('./modules/shortUrl');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//For CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT,POST,GET,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, content-type, Content-Type, Accept, Authorization"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

mongoose.connect('mongodb://localhost:27017/UrlSortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.get('/shortUrls',async(req,res)=>{
    let sortUrls;
    try {
        sortUrls = await shortUrl.find();
    } catch (error) {
        console.log(error)
        return res.status(500).json({"message": error.message})
    }
    return res.status(200).json({"message":"shortUrls received successfully",data: sortUrls})
})

app.post('/shortUrl',async(req,res)=>{
    try{
        let originalUrl = req.body.originalUrl;

        let urlll = await shortUrl.findOne({shortUrl: req.params.originalUrl})

        //check whether string already exists in db or not and if exists display message and return the same data
        if(originalUrl === urlll?.originalUrl){
            return res.status(201).json({"message": "sortUrl already exists"});
        }

        if(!originalUrl){
            return res.status(400).json({"message": "missing Url from the request"});
        }

        console.log("originalUrl==",originalUrl)
        await shortUrl.create({
            originalUrl: originalUrl
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({"message": err.message})
    }
    return res.status(200).json({"message": "shortUrl created successfully"})
})

app.get('/:shortUrl',async(req,res)=>{
    let shortUrl1;
    try {
        shortUrl1 = await shortUrl.findOne({sortUrl: req.params.shortUrl});
        if(shortUrl1 == null){
            return res.status(404).json({"message":"shortUrl not there"});
        }

        console.log("shortUrl12",shortUrl1)
        shortUrl1.clicks++;
        await shortUrl1.save();
        console.log("shortUrl13",shortUrl1)
    } catch (error) {
        console.log(error)
        return res.status(500).json({"message": error.message})
    }
    return res.status(200).json({"message":"shortUrls received successfully",data: shortUrl1.originalUrl})
})

app.listen(process.env.Port || 3000);