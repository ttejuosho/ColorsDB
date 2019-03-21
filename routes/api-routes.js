// Requiring our models
var db = require("../models");

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

app.get("/api/colors/charts", (req,res) => {
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
    db.Color.create({
        colorName: req.body.colorName,
        category: req.body.category,
        colorType: req.body.colorType,
        hex: req.body.hex
    }).then( (dbColor) => {
        res.json(dbColor);
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

}