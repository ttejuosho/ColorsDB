// Requiring our models
var db = require("../models");
const fs = require('fs')
const https = require('https');

// Routes
// =============================================================
module.exports = function(app) {
   // GET route for getting all of the Colors
   app.get("/api/colors", (req, res) => {
    // findAll returns all entries for a table when used with no options
    db.Color.findAll({}).then(function(dbColor) {
      // We have access to the colors as an argument inside of the callback function
      res.json(dbColor);
    });
  });   

app.get("/api/colors/typechart", (req,res) => {
    var dr = [];
    db.Color.count({
        where: {
            colorType: "Primary"
        }
    }).then(num => {
        dr.push(num);
    });
    db.Color.count({
        where: {
            colorType: "Secondary"
        }
    }).then(num => {
        dr.push(num);
    });
    db.Color.count({
        where: {
            colorType: "Tertiary"
        }
    }).then(num => {
        dr.push(num);
    });
    db.Color.count({
        where: {
            colorType: "None"
        }
    }).then(num => {
        dr.push(num);
        res.json(dr);
    });
});

app.get("/api/colors/categorychart", (req,res) => {
    var categoryChartArrary = [];
    db.Color.count({
        where: {
            category: "Monochromatic"
        }
    }).then(num => {
        categoryChartArrary.push(num);
    });

    db.Color.count({
        where: {
            category: "Complementary"
        }
    }).then(num => {
        categoryChartArrary.push(num);
    });

    db.Color.count({
        where: {
            category: "Color Triads"
        }
    }).then(num => {
        categoryChartArrary.push(num);
    });

    db.Color.count({
        where: {
            category: "Split Complementary"
        }
    }).then(num => {
        categoryChartArrary.push(num);
    });

    db.Color.count({
        where: {
            category: "Warm Colors"
        }
    }).then(num => {
        categoryChartArrary.push(num);
    });

    db.Color.count({
        where: {
            category: "Cool Colors"
        }
    }).then(num => {
        categoryChartArrary.push(num);
        res.json(categoryChartArrary);
    });
});

  app.get('/api/colors/name/:colorName', (req,res) => {
    db.Color.findOne({
        where: {
            colorName:req.params.colorName
        }
    }).then((dbColor) => {
        res.json(dbColor);
    });
  });

  app.get('/api/colors/:id', (req,res) => {
    db.Color.findOne({
        where: {
            id:req.params.id
        }
    }).then((dbColor) => {
        res.json(dbColor);
    });
  });

  app.post('/api/colors', (req,res) => {
    db.Color.findOne({
        where: {
            colorName:req.body.colorName
        }
    }).then((dbColor) => {
        if (dbColor == null){
            db.Color.create({
                colorName: req.body.colorName,
                category: req.body.category,
                colorType: req.body.colorType,
                hex: req.body.hex
            }).then( (dbColor) => {
                res.json(dbColor);
            });
        } else {
            res.json("Color Already Exists");
        }
    });
  });

  app.put('/api/colors/', (req,res) => {
    db.Color.update({
        colorName: req.body.colorName,
        category: req.body.category,
        colorType: req.body.colorType,
        hex: req.body.hex
    }, {
        where: {
            id: req.body.id
        }
    }).then( (dbColor) => {
        res.json(dbColor);
    });
  });

  app.delete('/api/colors/:id', (req,res) => {
      db.Color.destroy({
          where: {
              id: req.body.id
          }
      }).then( (dbColor) => {
          res.json(dbColor);
      });
  });

  app.get('/api/getActiveBusinesses', (req,res)=>{
    db.Business.findAll({}).then(function(dbBusiness) {
        // We have access to the colors as an argument inside of the callback function
        res.json(dbBusiness);
      });
  });

  app.get('/api/loadOdata', (req,res)=>{
    //let jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    https.get('https://data.cityofchicago.org/api/odata/v4/uupf-x98q?$top=5', (response)=>{
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
          });
        response.on('end', ()=>{
            //res.json(JSON.parse(data));
            let dataArray = JSON.parse(data);
            //console.log(dataArray.value.length);
            for (var i = 0; i < dataArray.value.length; i++){
                db.Business.create(dataArray.value[i]);
            }
            res.json(JSON.parse(data));
        }).on('error', (err) => {
            console.log("Error: " + err.message);
        });
    });   
  });

}