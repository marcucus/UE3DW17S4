var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "paris",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing countries into DynamoDB. Please wait.");

var allCountries = JSON.parse(fs.readFileSync('countries.json', 'utf8'));
allCountries.forEach(function(countrie) {
    var params = {
        TableName: "Countries",
        Item: {
            "regionc":  countrie.region,
            "nom": countrie.name.common,
            "langues":  countrie.languages,
            "superficie":  countrie.area
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", countrie.name.common, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", countrie.name.common);
       }
    });
});