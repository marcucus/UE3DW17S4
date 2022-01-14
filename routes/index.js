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

router.get('/tri', function(req,res){
  var params = {
    TableName: "Countries",
    ProjectionExpression: "#nom, #superficie",
    Limit:"12",
    KeyConditionExpression:"#reg = :reg",
    ExpressionAttributeNames: {
        "#nom": "nom",
        "#superficie": "superficie",
        "#reg":"regionc"
    },
    ExpressionAttributeValues: {
      ":reg": "Africa"
  },
  };
  docClient.query(params, function(err, data) {
    res.render('tri', {
      "countries" : data.Items
    });
  });
});

//All infos

router.get('/info', function(req,res){
  var params = {
    TableName: "Countries",
    ProjectionExpression: "#nom.common",
    KeyConditionExpression:"#reg = :reg",
    ExpressionAttributeNames: {
        "#nom": "nom",
        "#superficie": "superficie",
        "#reg":"regionc"
    },
    ExpressionAttributeValues: {
      ":reg": "France"
  },
  };
  docClient.query(params, function(err, data) {
    res.render('info', {
      "countries" : data.Items
    });
  });
});

// Néerlendais
router.get('/nld', function(req,res){
  var params = {
    TableName: "Countries",
    ProjectionExpression: "#languages.nld",
    KeyConditionExpression:"#reg = :reg",
    ExpressionAttributeNames: {
        "#name.official": 1,
        "_id":0,
    },
    ExpressionAttributeValues: {
      ":reg": "Dutch"
  },
  };
  docClient.query(params, function(err, data) {
    res.render('nld', {
      "countries" : data.Items
    });
  });
});
module.exports = router;
