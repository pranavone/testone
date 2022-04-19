const Category = require("../Module/Category");
const slugify = require("slugify");
const mysql = require("mysql");
const axios = require("axios");

function createcategary(resp, parentId = null) {
  const categorylist = [];
  let newdata;
  if (parentId == null) {
    newdata = resp.filter((cat) => cat.parentId == undefined);
  } else {
    newdata = resp.filter((cat) => cat.parentId === parentId);
  }

  for (let cate of newdata) {
    {
      categorylist.push({
        _id: cate.id,
        name: cate.name,
        slug: cate.slug,
        subcategory: createcategary(resp, cate.id),
      });
    }
  }

  return categorylist;
}

exports.createcategary = (req, res) => {
  const categaoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}`,
    img: req.body.img,
  };
  if (req.body.parentId) {
    categaoryObj.parentId = req.body.parentId;
  }
  const newcate = new Category(categaoryObj);
  newcate.save().then((response) => {
    res.status(200).json(response);
  });
};
exports.getcategory = (req, res) => {
  Category.find().then((resp) => {
    const categorylist = createcategary(resp);
    res.status(200).json({ Category: categorylist });
  });
};

/* const productvalue = [
    1, 3, 4, 0, 6, 6, 6,

    2, 2, 4, 4, 4, 2, 1, 5, 8, 3, 3, 1, 2, 2, 2,
  ];
  let count = 0;
  for (i = 0; i < productvalue.length; i++) {
    count = 1;
    for (j = i + 1; j < productvalue.length; j++) {
      if (productvalue[i] === productvalue[j]) {
        count++;
      }
    }
    console.log(count);
  } 
  understand callback function  
  function getfiltervalue(response) {
  function getenrolledStudent() {
    console.log("hey");
  }
  function getstudent(callback) {
    console.log("bye");
    callback();
  }

  getstudent(getenrolledStudent);
   promise
    function fun() {
    return new Promise(function (resolve, reject) {
      const error = true;
      if (!error) {
        resolve("problume resolved");
      } else {
        reject("sorry");
      }
    });
  }
  fun()
    .then((yes) => {
      console.log(`${yes} you can go further`);
    })
    .catch((error) => {
      console.log(`${error} somthing went wrong`);
    });

    **************************** conncect************************
    // var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "pranav76",
//   database: "bitnami_wordpress",
// });
// connection.connect();
// g.map((i) => {
//   i.price = [i.pirceo, i.pricec, i.priceh].sort((i, h) => {
//     return i - h;
//   })[0];
// });

1.softwre testing verification techniques = https://www.geeksforgeeks.org/verification-methods-in-software-verification/
2.testing process = https://www.geeksforgeeks.org/general-steps-of-software-testing-process/
3.black box testing = https://www.javatpoint.com/black-box-testing
4.v-model = https://www.javatpoint.com/v-model
5.risk management = :https://www.javatpoint.com/software-engineering-risk-management: https://www.geeksforgeeks.org/software-engineering-risk-management/ ,https://www.geeksforgeeks.org/risk-management-steps-in-software-engineering/
6.debugging = https://www.javatpoint.com/testing-vs-debugging#:~:text=As%20opposed%20to%20Testing%2C%20Debugging,errors%20in%20a%20software%20program.
7.constrol structure testing =https://www.geeksforgeeks.org/control-structure-testing/
8.performance testing = https://www.javatpoint.com/performance-testing
9.pair testing = https://www.geeksforgeeks.org/pair-testing-in-software-testing/
10.senacrio testing = https://www.geeksforgeeks.org/software-testing-scenario-testing/
11.unit testing = https://www.javatpoint.com/unit-testing
12.server/client arcitecture= https://www.ques10.com/p/38789/explain-client-server-testing-or-with-the-help-of-/?#:~:text=In%20Client%2Dserver%20testing%20there,are%20connected%20by%20real%20connection.
13.software quality = https://www.javatpoint.com/software-quality-assurance
*/
/*
web mining = https://www.geeksforgeeks.org/web-mining/#:~:text=Data%20Mining%20is%20the%20process,extract%20information%20from%20web%20documents.&text=Data%20Mining%20is%20very%20useful%20for%20web%20page%20analysis.
data mining preprosesser = https://www.geeksforgeeks.org/data-preprocessing-in-data-mining/
olap opartion = https://www.geeksforgeeks.org/olap-operations-in-dbms/
data mart = https://www.geeksforgeeks.org/data-marts-storage-component-of-hdfs/
data mining = https://www.javatpoint.com/data-mining
desion tree = https://www.geeksforgeeks.org/decision-tree/
data cube = https://www.javatpoint.com/data-warehouse-what-is-data-cube
attribute selction measure = https://www.geeksforgeeks.org/attribute-subset-selection-in-data-mining/
data whrehouse charctersitcs = https://www.geeksforgeeks.org/characteristics-and-functions-of-data-warehouse/
market basket analysis =https://www.tutorialspoint.com/what-is-market-basket-analysis
clssification dision tree =
Classification and Predication=https://www.javatpoint.com/classification-and-predication-in-data-mining
k-means method = https://www.javatpoint.com/k-means-clustering-algorithm-in-machine-learning
 */
