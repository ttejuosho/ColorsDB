var express = require("express");

var router = express.Router();
// grabbing our models
var db = require("../models");

router.get('/', (req,res) => {
    res.redirect('/index');
});

router.get('/index', (req,res) => {
    db.Color.findAll({})
            .then( (dbColor) => {
                var hbsObject = {
                    color: dbColor
                };
                // console.log(dbColor);
                return res.render("index", hbsObject);
            });
});

router.get('/table', (req,res) => {
    db.Color.findAll({})
    .then( (dbColor) => {
        var hbsObject = {
            color: dbColor
        };
        return res.render("table", hbsObject);
    });
});

router.post('/colors/create', (req,res) => {
    db.Color.create({
        colorName: req.body.colorName,
        category: req.body.category,
        colorType: req.body.colorType,
        hex: req.body.hex
    }).then((dbColor) => {
        // console.log(dbColor);
        return res.render("added", dbColor);
    });
});

router.get('/colors/:id/update', (req,res) => {
    db.Color.findById(req.params.id)
         .then((dbColor) => {
        console.log(dbColor);
        res.render('colors/update', dbColor.dataValues);
    }).catch((err) => {
        res.render('error', err);
    });
});

router.put('/colors/:id/update', (req,res) => {
    const dbColor = {
        colorName: req.body.colorName,
        category: req.body.category,
        colorType: req.body.colorType,
        hex: req.body.hex
    };

    db.Color.update( dbColor, { 
        where: {
            id: req.params.id
        }
    }).then( (dbColor) => {
        res.redirect('/table')
    }).catch((err) => {
		res.render('error', err);
	});
});


// Search Routes
// ============================================================
router.get('/colors/:id', (req,res)=>{
    db.Color.findById(req.params.id)
            .then((dbColor) => {
        res.render('colors/color', dbColor.dataValues);
    }).catch((err) => {
        res.render('error', err);
    });
});

// Search Routes Ended
// ============================================================

router.get('/colors/:id/delete', (req,res) => {
    db.Color.findById(req.params.id)
            .then( (dbColor) => {
                db.Color.destroy({
        where: {
            id: dbColor.dataValues.id
        }
    }).then( () => { res.redirect('/table');
    }).catch((err) => { res.render('error', err)
    })
    });
    });



module.exports = router;