var express = require("express");
var router = express.Router();

var scraping = require("../modules/scraping");

/* GET home page. */
router
	.get("/", function (req, res, next) {
		res.render("index", { title: "Express" });
	})
	.post("/", function (req, res, next) {
		const msg = req.body.message;
		var result = scraping(msg);
		//res.render("index", result);
	});

module.exports = router;
