const express=require("express");
const request=require("request");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.post("/",function(req,res){
    const firstName=req.body.fn;
    const lastName=req.body.ln;
    const email=req.body.email;
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const api="27cb6b1d866be8d7db1b0571653614b6-us9";
    const lisid="74352c98a2";
    const url="https://us9.api.mailchimp.com/3.0/lists/"+lisid;
    const options={
        method:"POST",
        auth:"hitesh:"+api
    }
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            const errors=JSON.parse(data).errors;
            console.log(errors);
            if(errors.length==0)
                res.sendFile(__dirname+"/success.html")
            else{ 
                res.sendFile(__dirname+"/failure.html")
            }
        })
    })
    request.write(jsonData);
    request.end();
})
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.post("/back",function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(){
    console.log("Connected")
})