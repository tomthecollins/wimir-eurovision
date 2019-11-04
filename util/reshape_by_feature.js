const csv = require("csvtojson");
const fs = require("fs");
const featureNames = require("./feature_names").default;

const csvFilePath = __dirname + "/../../../Documents/Homepage/research/data/" +
"eurovision/CSV/features.csv";
const jsonDir = __dirname + "/../../../Documents/Homepage/research/data/" +
"eurovision/JSON_features/";

csv()
.fromFile(csvFilePath)
.then((jsonObj) => {
  featureNames
  // .slice(0, 10)
  .map(function(fn, idx){
    if (idx%10 == 0){
      console.log("Working on feature " + (idx + 1) + " of " + featureNames.length);
    }
    let currFeatureVals = [];
    let featArr = fn.split(".");
    jsonObj
    // .slice(0, 10)
    .map(function(row){
      let loadPath;
      if (row.country.includes("North Macedonia")){
        loadPath = __dirname + "/../../../Documents/Homepage/research/" +
        "data/eurovision/JSON/" + row.year +
        "_North MacedoniaNorth MacedoniaN.json"
      }
      else if (row.country.includes("United Kingdom")){
        loadPath = __dirname + "/../../../Documents/Homepage/research/" +
        "data/eurovision/JSON/" + row.year + "_United KingdomUK.json";
      }
      else {
        loadPath = __dirname + "/../../../Documents/Homepage/research/" +
        "data/eurovision/JSON/" + row.year + "_" + row.country + ".json";
      }
      let otherInfo = require(loadPath);
      let featVal = row[featArr[0]];
      let i = 1;
      while (i < featArr.length){
        featVal = featVal[featArr[i]];
        i++;
      }
      if (!isNaN(parseFloat(featVal))){
        featVal = parseFloat(featVal);
      }
      currFeatureVals.push({
        "year": parseInt(row.year),
        "country": row.country,
        "val": featVal,
        "mp3Name": otherInfo.metadata.tags.file_name
      });
    });
    // Write to JSON.
    fs.writeFileSync(
      jsonDir + fn + ".json",
      JSON.stringify(currFeatureVals, null, 2)
    );
  });
  /**
  * [
  * 	{a:"1", b:"2", c:"3"},
  * 	{a:"4", b:"5". c:"6"}
  * ]
  */
})
