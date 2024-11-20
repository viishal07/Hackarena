const express = require("express");
const app = epress();
const port = 3000;
const path = require("path");

app.set("view engine","ejs");
app.set("view",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended : true}));

app.listen(port,(req,res)=>{
    console.log(`server is listening at http://localhost:${post}`);
})
