// Requiring our models
var db = require("../models");
var Sequelize = require("sequelize");
const https = require("https");
var request = require("request");
var fs = require("fs");
var es = require("event-stream");

// Routes
// =============================================================
module.exports = function (app) {
  // GET route for getting all of the Colors
  app.get("/api/colors", (req, res) => {
    // findAll returns all entries for a table when used with no options
    db.Color.findAll({}).then(function (dbColor) {
      // We have access to the colors as an argument inside of the callback function
      res.json(dbColor);
    });
  });

  app.get("/api/colors/typechart", (req, res) => {
    var dr = [];
    db.Color.count({
      where: {
        colorType: "Primary",
      },
    }).then((num) => {
      dr.push(num);
    });
    db.Color.count({
      where: {
        colorType: "Secondary",
      },
    }).then((num) => {
      dr.push(num);
    });
    db.Color.count({
      where: {
        colorType: "Tertiary",
      },
    }).then((num) => {
      dr.push(num);
    });
    db.Color.count({
      where: {
        colorType: "None",
      },
    }).then((num) => {
      dr.push(num);
      res.json(dr);
    });
  });

  app.get("/api/colors/categorychart", (req, res) => {
    var categoryChartArrary = [];
    db.Color.count({
      where: {
        category: "Monochromatic",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
    });

    db.Color.count({
      where: {
        category: "Complementary",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
    });

    db.Color.count({
      where: {
        category: "Color Triads",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
    });

    db.Color.count({
      where: {
        category: "Split Complementary",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
    });

    db.Color.count({
      where: {
        category: "Warm Colors",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
    });

    db.Color.count({
      where: {
        category: "Cool Colors",
      },
    }).then((num) => {
      categoryChartArrary.push(num);
      res.json(categoryChartArrary);
    });
  });

  app.get("/api/colors/name/:colorName", (req, res) => {
    db.Color.findOne({
      where: {
        colorName: req.params.colorName,
      },
    }).then((dbColor) => {
      res.json(dbColor);
    });
  });

  app.get("/api/colors/:id", (req, res) => {
    db.Color.findOne({
      where: {
        id: req.params.id,
      },
    }).then((dbColor) => {
      res.json(dbColor);
    });
  });

  app.post("/api/colors", (req, res) => {
    db.Color.findOne({
      where: {
        colorName: req.body.colorName,
      },
    }).then((dbColor) => {
      if (dbColor == null) {
        db.Color.create({
          colorName: req.body.colorName,
          category: req.body.category,
          colorType: req.body.colorType,
          hex: req.body.hex,
        }).then((dbColor) => {
          res.json(dbColor);
        });
      } else {
        res.json("Color Already Exists");
      }
    });
  });

  app.put("/api/colors/", (req, res) => {
    db.Color.update(
      {
        colorName: req.body.colorName,
        category: req.body.category,
        colorType: req.body.colorType,
        hex: req.body.hex,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then((dbColor) => {
      res.json(dbColor);
    });
  });

  app.delete("/api/colors/:id", (req, res) => {
    db.Color.destroy({
      where: {
        id: req.body.id,
      },
    }).then((dbColor) => {
      res.json(dbColor);
    });
  });

  app.get("/api/getActiveBusinesses", (req, res) => {
    db.Business.findAll({})
      .then(function (dbBusiness) {
        res.json(dbBusiness);
      })
      .catch(function (err) {
        res.render("error", err);
      });
  });

  app.get("/api/searchBusiness/:searchBy/:searchValue", (req, res) => {
    var searchObject = {};
    searchObject[req.params.searchBy] = req.params.searchValue;
    db.Business.findAll({
      where: searchObject,
    })
      .then((dbBusiness) => {
        res.json(dbBusiness);
      })
      .catch(function (err) {
        res.render("error", err);
      });
  });

  app.get("/api/search/:searchQuery", (req, res) => {
    const Op = Sequelize.Op;
    const searchQuery = req.params.searchQuery;
    const requestStart = Date.now();
    db.Business.findAll({
      where: {
        [Op.or]: {
          legal_name: { [Op.like]: "%" + searchQuery + "%" },
          doing_business_as_name: { [Op.like]: "%" + searchQuery + "%" },
          business_activity: { [Op.like]: "%" + searchQuery + "%" },
          address: { [Op.like]: "%" + searchQuery + "%" },
          city: { [Op.like]: "%" + searchQuery + "%" },
          state: { [Op.like]: "%" + searchQuery + "%" },
          zip_code: { [Op.like]: "%" + searchQuery + "%" },
          license_id: { [Op.like]: "%" + searchQuery + "%" },
          license_description: { [Op.like]: "%" + searchQuery + "%" },
        },
      },
    })
      .then((dbBusiness) => {
        const processingTime = Date.now() - requestStart;
        var data = { results: dbBusiness, processingTime: processingTime };
        res.json(data);
      })
      .catch(function (err) {
        res.render("error", err);
      });
  });

  app.get("/api/getBusiness/:id", (req, res) => {
    db.Business.findByPk(req.params.id)
      .then((dbBusiness) => {
        res.json(dbBusiness);
      })
      .catch(function (err) {
        res.render("error", err);
      });
  });

  app.get("/api/loadOdata", (req, res) => {
    https.get(
      "https://data.cityofchicago.org/api/odata/v4/uupf-x98q?$skip=2000",
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response
          .on("end", () => {
            var dataArray = JSON.parse(data);
            for (var i = 0; i < dataArray.value.length; i++) {
              db.Business.create(dataArray.value[i]);
            }
            res.json("data migrated to the cloud");
          })
          .on("error", (err) => {
            console.log("Error: " + err.message);
          });
      }
    );
  });

  app.get("/api/loadFileData", (req, res) => {
    var biz = [];
    var s = fs
      .createReadStream("8612.csv")
      .pipe(es.split("\\"))
      .pipe(
        es.mapSync((business) => {
          //console.log(business.length);
          var businessArray = business.split(',');
          //console.log("===========");
          if (businessArray.length === 16) {

          //     var BusinessObjArray = [];
          //     businessArray[i].replace('"', '');
          //     businessArray[i].replace('/"/g', '');
          //     businessArray[i].replace('/"}/g', '');
          //     BusinessObjArray.push(businessArray[i]);
          //   }
          var BusinessObjArray = [];
            for (var j = 0; j < businessArray.length; j++ ){
              //console.log(businessArray[j].replace('"}', ''));
              //var temp = businessArray[j];
              var temp2 = businessArray[j].replace('"', '');
              var temp3 = temp2.substring(0, temp2.length - 1);
              if (temp3.includes("Business Associations")){ temp3 = temp3.substring(0, temp3.length - 1);}
              //console.log(temp3);
              BusinessObjArray.push(temp3);
            }
             
for (var k = 0; k < BusinessObjArray.length; k++ ){
        var companyName = BusinessObjArray[0].substring(1, BusinessObjArray[0].length);
        //console.log(companyName);
                var cleanObj = {
                Company: companyName,
                Address: BusinessObjArray[1],
                City: BusinessObjArray[2],
                State: BusinessObjArray[3],
                Zip: BusinessObjArray[4],
                County: BusinessObjArray[5],
                Phone: BusinessObjArray[6],
                Website: BusinessObjArray[7],
                Contact: BusinessObjArray[8],
                Title: BusinessObjArray[9],
                "Direct Phone": BusinessObjArray[10],
                Email: BusinessObjArray[11],
                Sales: BusinessObjArray[12],
                Employees: BusinessObjArray[13],
                "SIC Code": BusinessObjArray[14],
                Industry: BusinessObjArray[15],
              };

}            
              console.log(cleanObj);
              db.Business.create(cleanObj);
          }

          //biz.push(business);
        })
      )
      .on("error", (err) => {
        console.log("Error while reading file.", err);
      })
      .on("end", () => {
        console.log("Read File Successfull");
        console.log(biz);
      });
  });

  app.get("/api/covid19/:countrycode", (req, res) => {
    var options = {
      method: "GET",
      uri:
        "https://covid-19-data.p.rapidapi.com/country/code?code=" +
        req.params.countrycode,
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "IuOVhsiHnHmshp2joUkOjzNKfNl7p1sFI28jsngQEGKWsQoiuj",
      },
    };

    request(options, (err, resp, body) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(JSON.parse(body));
    });
  });

  app.get("/api/covid19/:countryname", (req, res) => {
    var options = {
      method: "GET",
      uri:
        "https://covid-19-data.p.rapidapi.com/country?name=" +
        req.params.countryname,
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "IuOVhsiHnHmshp2joUkOjzNKfNl7p1sFI28jsngQEGKWsQoiuj",
      },
    };

    request(options, (err, resp, body) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(JSON.parse(body));
    });
  });

  app.get("/api/covid/totals", (req, res) => {
    var options = {
      method: "GET",
      uri: "https://covid-19-data.p.rapidapi.com/totals",
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "IuOVhsiHnHmshp2joUkOjzNKfNl7p1sFI28jsngQEGKWsQoiuj",
      },
    };

    request(options, (err, resp, body) => {
      if (err) {
        console.log(err);
        return;
      }
      //console.log(JSON.parse(body));
      res.send(JSON.parse(body));
    });
  });
};
