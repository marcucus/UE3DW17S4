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

module.exports = router;
