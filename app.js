var express = require('express');
var http = require('http');
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/listProducts/:id?', function (req, res) {
   if(req.params.id!=undefined){
      fs.readFile( __dirname + "/" + "products.json", 'utf8', function (err, data) {
         var products = JSON.parse( data );
         var product = products["product" + req.params.id] 
         console.log( product );
         res.end( JSON.stringify(product));
      });
   } else {
      fs.readFile( __dirname + "/" + "products.json", 'utf8', function (err, data) {
         console.log( data );
         res.end( data );
      });
   }
});

app.post('/addProduct', function (req, res) {
   fs.readFile( __dirname + "/" + "products.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      for (let [key, value] of Object.entries(req.body)) {
         data[`${key}`] = JSON.parse(`${value}`);
         fs.writeFile(__dirname + "/" + "products.json", JSON.stringify(data), err1 => {
            if (err1) {
               res.end( JSON.stringify({"status":"Unable to add/update product, " + err1} ));
            } else {
               res.end( JSON.stringify({"status":"Product added/updated successfully."}));
            }
         });
      }
   });
})

app.delete('/deleteProduct/:id', function (req, res) {
   if(req.params.id!=undefined){
      fs.readFile( __dirname + "/" + "products.json", 'utf8', function (err, data) {
         data = JSON.parse( data );
         delete data["product" + req.params.id];
         console.log(data)
         fs.writeFile(__dirname + "/" + "products.json", JSON.stringify(data), err1 => {
            if (err1) {
            console.error(err1)
            }
         }) 
         res.end( JSON.stringify({"status":"Product Deleted"}));
      });
   } else {
         res.end( JSON.stringify({"status":"Invalid Delete Request"} ));
   }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));