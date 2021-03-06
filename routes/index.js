var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

AWS.config.update({
  region: "paris",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// tri pays européens
router.get('/europe', function(req,res){
  var params = {
    TableName: "Countries",
    ProjectionExpression: "#nom, langues, #superficie",
    KeyConditionExpression:"#reg = :reg",
    ExpressionAttributeNames: {
        "#nom": "nom",
        "#superficie": "superficie",
        "#reg":"regionc"
    },
    ExpressionAttributeValues: {
      ":reg": "Europe"
  }
  };
  docClient.query(params, function(err, data) {
    res.render('europe', {
      "countries" : data.Items
    });
  });
});

// tri superficie pays africain
router.get("/tri", function (req, res) {
  var params = {
      TableName: "Countries",
      IndexName: "SuperficieIndex",
      ProjectionExpression:"#nom, #superficie",
      KeyConditionExpression: "#rg = :rgvalue AND #superficie > :value",
      ExpressionAttributeNames: {
          "#rg": "regionc",
          "#nom":"nom",
          "#superficie": "superficie"
      },
      ExpressionAttributeValues: {
          ":rgvalue": "Africa",
          ":value": 0
      },
      Limit:21,
  };
  docClient.query(params, function(err, data) {
    res.render('tri', {
      "countries" : data.Items
    });
  });
});

//All infos

/* Info d'un pays */
router.get("/info", function (req, res) {
  var params = {
      TableName: "Countries",
      FilterExpression: "#nm = :nom",
      ExpressionAttributeNames: {
          "#nm": "nom",
      },
      ExpressionAttributeValues: {
          ":nom": "France",
      },
  };
  docClient.scan(params, function (err, data) {
      console.log(data.Items);
      res.render("info", {
          "countries": data.Items,
      });
  });
});

// Néerlendais
router.get('/nld', function(req,res){
  var params = {
    TableName: "Countries",
    FilterExpression: "langues.nld = :lang",
    ExpressionAttributeValues: {
      ":lang": "Dutch"
  }
  };
  docClient.scan(params, function(err, data) {
    res.render('nld', {
      "countries" : data.Items
    });
  });
});

// superficie entre deux valeurs
router.get("/btw", function (req, res) {
  var params = {
      TableName: "Countries",
      IndexName: "SuperficieIndex",
      ProjectionExpression:"#nom, #superficie",
      ExpressionAttributeNames: {
          "#nom":"nom",
          "#superficie": "superficie"
      },
  };
  docClient.scan(params, function(err, data) {
    res.render('btw', {
      "countries" : data.Items
    });
  });
});

// lettre donnée
router.get("/letter", function (req, res) {
  var params = {
      TableName: "Countries",
      ProjectionExpression:"#nom",
      ExpressionAttributeNames: {
          "#nom": "nom",
      },
  };
  docClient.scan(params, function (err, data) {
      console.log(data.Items);
      res.render("letter", {
          "countries": data.Items
      });
  });
});

module.exports = router;
