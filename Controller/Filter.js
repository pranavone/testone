const newdatas = require("../Module/test");
let convertreg = function (category) {
  for (i = 0; i < category.length; i++) {
    category[i] = new RegExp(
      category[i].charAt(0).toUpperCase() + category[i].substring(1)
    );
  }
  return category;
};

let isSelecte = function (req, category, gender) {
  let categoryquery = {
    $and: [
      {
        category: category,
      },
      {
        gender: gender.charAt(0).toUpperCase() + gender.substring(1),
      },
    ],
  };
  return categoryquery;
};

exports.getfilter = async (req, res) => {
  let categoryquery = {};
  let slug = req.params.slug.split("-");
  let gender = slug.shift();
  let category = convertreg(slug);
  let query = {};
  console.log(req.body);
  query = {
    $and: [
      req.body.primaryColour && req.body.primaryColour.length >= 1
        ? {
            primaryColour: { $in: req.body.primaryColour },
          }
        : {},
      gender === "Men" || "Women"
        ? {
            gender: gender.charAt(0).toUpperCase() + gender.substring(1),
          }
        : {},
      req.body.brand && req.body.brand.length >= 1
        ? {
            brand: { $in: req.body.brand },
          }
        : {},
      req.body.season && req.body.season.length >= 1
        ? {
            season: { $in: req.body.season },
          }
        : {},

      req.body.price
        ? {
            price: { $lt: req.body.price },
          }
        : {},
      {
        category: category,
      },
      req.body.category && req.body.category.length >= 1
        ? {
            category: { $in: req.body.category },
          }
        : {},
    ],
  };

  categoryquery = isSelecte(req, category, gender);
  console.time("hello");
  const datas = await newdatas
    .find(categoryquery)
    .select("primaryColour brand  season category gender")
    .lean();
  console.timeEnd("hello");
  console.time("hi");
  const productsdats = await newdatas.find(query).lean();
  console.timeEnd("hi");
  let counter = {};
  let count = [counter];

  datas.map((i) => {
    for (props in i) {
      if (props !== "_id") {
        if (counter[props]) {
          counter[props][i[props]] = (counter[props][i[props]] || 0) + 1;
        } else {
          counter[props] = {};
          counter[props][i[props]] = (counter[props][i[props]] || 0) + 1;
        }
      }
    }
  });

  let puredata = [];
  for (props in count) {
    for (props1 in count[props]) {
      let data = [];

      puredata.push({
        name: props1,
        filterdata: data,
      });
      for (props2 in count[props][props1]) {
        data.push({
          category: props1,
          name: props2,
          count: count[props][props1][props2],
        });
      }
    }
  }

  res.json({
    filterdata: puredata,
    products: productsdats,
    numberofitems: productsdats.length,
  });
};

/* g.map((id) => {
    return id.products.reduce((h, i) => {
      count[i.brand] = (count[i.brand] || 0) + 1;
    });npm start
  });



  exports.createFilter = async (req, res) => {
  const dub = await Filter.findOne({ name: req.body.name });

  if (dub === null) {
    const filterObj = new Filter({
      name: req.body.name,
      Filtervalue: req.body.Filtervalue,
    });
    filterObj.save().then((resp) => {
      console.log(resp);
    });
  } else {
    Filter.findOneAndUpdate(
      { name: req.body.name },
      { $push: { Filtervalue: req.body.Filtervalue } }
    ).then((resp) => res.json(resp));
  }
};

*

 Filters: {
      primaryFilter: [
        {
          name: "season",
          Filtervalue: [countseason],
        },
        {
          name: "brand",
          Filtervalue: [countbrand],
        },
      ],
    },
  });
/
/*secondaryFilters: [{id: "Pattern",…}, {id: "Sleeve Length",…},…]
0: {id: "Pattern",…}
filterValues: [{id: "Printed", value: "Printed", count: 24059, pLevel: "pop", src: ""},…]
0: {id: "Printed", value: "Printed", count: 24059, pLevel: "pop", src: ""}
count: 24059
id: "Printed"
pLevel: "pop"
src: ""
value: "Printed"
1: {id: "Solid", value: "Solid", count: 4524, pLevel: "pop", src: ""}
count: 4524
id: "Solid"
pLevel: "pop"
src: ""
value: "Solid"
2: {id: "Yoke Design", value: "Yoke Design", count: 3078, pLevel: "pop", src: ""}
count: 3078
id: "Yoke Design"
pLevel: "pop"
src: ""
value: "Yoke Design"
3: {id: "Checked", value: "Checked", count: 1057, pLevel: "", src: ""}
count: 1057
id: "Checked"
pLevel: ""
src: ""
value: "Checked"
4: {id: "Colourblocked", value: "Colourblocked", count: 421, pLevel: "", src: ""}
count: 421
id: "Colourblocked"
pLevel: ""
src: ""
value: "Colourblocked"
5: {id: "Dyed", value: "Dyed", count: 175, pLevel: "", src: ""}
count: 175
id: "Dyed"
pLevel: ""
src: ""
value: "Dyed"
6: {id: "Embellished", value: "Embellished", count: 305, pLevel: "", src: ""}
count: 305
id: "Embellished"
pLevel: ""
src: ""
value: "Embellished"
7: {id: "Embroidered", value: "Embroidered", count: 4332, pLevel: "", src: ""}
count: 4332
id: "Embroidered"
pLevel: ""
src: ""
value: "Embroidered"
8: {id: "Striped", value: "Striped", count: 2459, pLevel: "", src: ""}
count: 2459
id: "Striped"
pLevel: ""
src: ""
value: "Striped"
9: {id: "Woven Design", value: "Woven Design", count: 2067, pLevel: "", src: ""}
count: 2067
id: "Woven Design"
pLevel: ""
src: ""
value: "Woven Design"
id: "Pattern"
isVisual: false
1: {id: "Sleeve Length",…}
filterValues: [{id: "Three-Quarter Sleeves", value: "Three-Quarter Sleeves", count: 34492, pLevel: "",…},…]
0: {id: "Three-Quarter Sleeves", value: "Three-Quarter Sleeves", count: 34492, pLevel: "",…}
count: 34492
id: "Three-Quarter Sleeves"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/4/29/43c63ab3-49bb-4830-b3c4-ec1a583ca5501619683335823-1_SLEEVE-LENGTH-THREE-QUARTERS.png"
value: "Three-Quarter Sleeves"
1: {id: "Short Sleeves", value: "Short Sleeves", count: 3702, pLevel: "",…}
count: 3702
id: "Short Sleeves"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/4/29/ea4cfac6-7b45-4fe0-8bc0-6d7afafa11501619683335848-1_SLEEVE-LENGTH-REGULAR-SLEEVES.png"
value: "Short Sleeves"
2: {id: "Long Sleeves", value: "Long Sleeves", count: 2207, pLevel: "",…}
count: 2207
id: "Long Sleeves"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/04ac9319-8bcb-4743-8f53-2eca071db3801611747005976-SLEEVE-LENGTH-LONG-SLEEVES.png"
value: "Long Sleeves"
3: {id: "Sleeveless", value: "Sleeveless", count: 2196, pLevel: "",…}
count: 2196
id: "Sleeveless"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/4/29/7636b73c-d9be-4ed8-9a58-dca7d65f94ae1619683335835-1_SLEEVE-LENGTH-SLEEVES.png"
value: "Sleeveless"
id: "Sleeve Length"
isVisual: true
2: {id: "Shape", filterValues: [{id: "Straight", value: "Straight", count: 26722, pLevel: "",…},…],…}
filterValues: [{id: "Straight", value: "Straight", count: 26722, pLevel: "",…},…]
0: {id: "Straight", value: "Straight", count: 26722, pLevel: "",…}
count: 26722
id: "Straight"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/0c7bee35-2295-4066-a5c7-810be0eb7c211622114421636-KURTA-SHAPE-TYPE-STRAIGHT.png"
value: "Straight"
1: {id: "A-Line", value: "A-Line", count: 12181, pLevel: "",…}
count: 12181
id: "A-Line"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/aa81dc39-1a29-4703-ac7f-6bc388fb9c2b1622114421691-KURTA-SHAPE-TYPE-A-LINE.png"
value: "A-Line"
2: {id: "Anarkali", value: "Anarkali", count: 3219, pLevel: "",…}
count: 3219
id: "Anarkali"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/f4f8ce99-2cff-40f6-9272-b90e2adc97551622114421626-KURTA-SHAPE-TYPE-ANARKALI.png"
value: "Anarkali"
3: {id: "Kaftan", value: "Kaftan", count: 132, pLevel: "",…}
count: 132
id: "Kaftan"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/e84102d4-4201-4e50-b2eb-e0a65f6a84c11622114421659-KURTA-SHAPE-TYPE-KAFTAN.png"
value: "Kaftan"
4: {id: "Pakistani Style", value: "Pakistani Style", count: 10, pLevel: "",…}
count: 10
id: "Pakistani Style"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/76e96bf7-7bec-43f0-9c38-7a8b324ef56a1622114421652-KURTA-SHAPE-TYPE-PAKISTANI.png"
value: "Pakistani Style"
5: {id: "Pathani", value: "Pathani", count: 261, pLevel: "",…}
count: 261
id: "Pathani"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/5/27/c3197566-f6b6-4b2f-bee9-d4a2e23c65fd1622114421644-KURTA-SHAPE-TYPE-PATHANI.png"
value: "Pathani"
id: "Shape"
isVisual: true
3: {id: "Weave Pattern",…}
filterValues: [{id: "Regular", value: "Regular", count: 41821, pLevel: "pop", src: ""},…]
0: {id: "Regular", value: "Regular", count: 41821, pLevel: "pop", src: ""}
count: 41821
id: "Regular"
pLevel: "pop"
src: ""
value: "Regular"
1: {id: "Jacquard", value: "Jacquard", count: 334, pLevel: "pop", src: ""}
count: 334
id: "Jacquard"
pLevel: "pop"
src: ""
value: "Jacquard"
2: {id: "Dobby", value: "Dobby", count: 245, pLevel: "pop", src: ""}
count: 245
id: "Dobby"
pLevel: "pop"
src: ""
value: "Dobby"
3: {id: "Brasso", value: "Brasso", count: 2, pLevel: "", src: ""}
count: 2
id: "Brasso"
pLevel: ""
src: ""
value: "Brasso"
4: {id: "Brocade", value: "Brocade", count: 15, pLevel: "", src: ""}
count: 15
id: "Brocade"
pLevel: ""
src: ""
value: "Brocade"
5: {id: "Denim", value: "Denim", count: 32, pLevel: "", src: ""}
count: 32
id: "Denim"
pLevel: ""
src: ""
value: "Denim"
6: {id: "Khadi", value: "Khadi", count: 81, pLevel: "", src: ""}
count: 81
id: "Khadi"
pLevel: ""
src: ""
value: "Khadi"
id: "Weave Pattern"
isVisual: false
4: {id: "Sleeve Styling",…}
filterValues: [{id: "Regular Sleeves", value: "Regular Sleeves", count: 33497, pLevel: "pop", src: ""},…]
0: {id: "Regular Sleeves", value: "Regular Sleeves", count: 33497, pLevel: "pop", src: ""}
count: 33497
id: "Regular Sleeves"
pLevel: "pop"
src: ""
value: "Regular Sleeves"
1: {id: "Roll-Up Sleeves", value: "Roll-Up Sleeves", count: 3491, pLevel: "pop", src: ""}
count: 3491
id: "Roll-Up Sleeves"
pLevel: "pop"
src: ""
value: "Roll-Up Sleeves"
2: {id: "No Sleeves", value: "No Sleeves", count: 1953, pLevel: "pop", src: ""}
count: 1953
id: "No Sleeves"
pLevel: "pop"
src: ""
value: "No Sleeves"
3: {id: "Bell Sleeves", value: "Bell Sleeves", count: 746, pLevel: "", src: ""}
count: 746
id: "Bell Sleeves"
pLevel: ""
src: ""
value: "Bell Sleeves"
4: {id: "Cap Sleeves", value: "Cap Sleeves", count: 132, pLevel: "", src: ""}
count: 132
id: "Cap Sleeves"
pLevel: ""
src: ""
value: "Cap Sleeves"
5: {id: "Cold-Shoulder Sleeves", value: "Cold-Shoulder Sleeves", count: 244, pLevel: "", src: ""}
count: 244
id: "Cold-Shoulder Sleeves"
pLevel: ""
src: ""
value: "Cold-Shoulder Sleeves"
6: {id: "Extended Sleeves", value: "Extended Sleeves", count: 118, pLevel: "", src: ""}
count: 118
id: "Extended Sleeves"
pLevel: ""
src: ""
value: "Extended Sleeves"
7: {id: "Flared Sleeves", value: "Flared Sleeves", count: 1667, pLevel: "", src: ""}
count: 1667
id: "Flared Sleeves"
pLevel: ""
src: ""
value: "Flared Sleeves"
8: {id: "Puff Sleeves", value: "Puff Sleeves", count: 383, pLevel: "", src: ""}
count: 383
id: "Puff Sleeves"
pLevel: ""
src: ""
value: "Puff Sleeves"
9: {id: "Shoulder Straps", value: "Shoulder Straps", count: 144, pLevel: "", src: ""}
count: 144
id: "Shoulder Straps"
pLevel: ""
src: ""
value: "Shoulder Straps"
id: "Sleeve Styling"
isVisual: false
5: {id: "Occasion", filterValues: [{id: "Daily", value: "Daily", count: 32970, pLevel: "pop", src: ""},…],…}
filterValues: [{id: "Daily", value: "Daily", count: 32970, pLevel: "pop", src: ""},…]
0: {id: "Daily", value: "Daily", count: 32970, pLevel: "pop", src: ""}
count: 32970
id: "Daily"
pLevel: "pop"
src: ""
value: "Daily"
1: {id: "Festive", value: "Festive", count: 6006, pLevel: "pop", src: ""}
count: 6006
id: "Festive"
pLevel: "pop"
src: ""
value: "Festive"
2: {id: "Fusion", value: "Fusion", count: 3408, pLevel: "pop", src: ""}
count: 3408
id: "Fusion"
pLevel: "pop"
src: ""
value: "Fusion"
3: {id: "Maternity", value: "Maternity", count: 97, pLevel: "", src: ""}
count: 97
id: "Maternity"
pLevel: ""
src: ""
value: "Maternity"
id: "Occasion"
isVisual: false
6: {id: "Fabric Purity",…}
filterValues: [{id: "Blended", value: "Blended", count: 12703, pLevel: "pop", src: ""},…]
0: {id: "Blended", value: "Blended", count: 12703, pLevel: "pop", src: ""}
count: 12703
id: "Blended"
pLevel: "pop"
src: ""
value: "Blended"
1: {id: "Synthetic", value: "Synthetic", count: 7500, pLevel: "pop", src: ""}
count: 7500
id: "Synthetic"
pLevel: "pop"
src: ""
value: "Synthetic"
2: {id: "Pure", value: "Pure", count: 22273, pLevel: "pop", src: ""}
count: 22273
id: "Pure"
pLevel: "pop"
src: ""
value: "Pure"
id: "Fabric Purity"
isVisual: false
7: {id: "Stitch",…}
filterValues: [{id: "Made to Measure", value: "Made to Measure", count: 91, pLevel: "", src: ""},…]
0: {id: "Made to Measure", value: "Made to Measure", count: 91, pLevel: "", src: ""}
count: 91
id: "Made to Measure"
pLevel: ""
src: ""
value: "Made to Measure"
1: {id: "Ready to Wear", value: "Ready to Wear", count: 41198, pLevel: "", src: ""}
count: 41198
id: "Ready to Wear"
pLevel: ""
src: ""
value: "Ready to Wear"
id: "Stitch"
isVisual: false
8: {id: "Hemline", filterValues: [{id: "Straight", value: "Straight", count: 27484, pLevel: "",…},…],…}
filterValues: [{id: "Straight", value: "Straight", count: 27484, pLevel: "",…},…]
0: {id: "Straight", value: "Straight", count: 27484, pLevel: "",…}
count: 27484
id: "Straight"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/bcbbcab4-db68-4ef4-b384-d9961d17f8471611746648415-DRESS-KURTA-HEMLINES-STRAIGHT.png"
value: "Straight"
1: {id: "Flared", value: "Flared", count: 9960, pLevel: "",…}
count: 9960
id: "Flared"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/1b646f0d-358e-447e-a540-1ff77068fb4b1611746648481-DRESS-KURTA-HEMLINES-FLARED.png"
value: "Flared"
2: {id: "Curved", value: "Curved", count: 2400, pLevel: "",…}
count: 2400
id: "Curved"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/abdaaf11-428f-44dc-b5b6-320aef3af6f51611746648498-DRESS-KURTA-HEMLINES-CURVED.png"
value: "Curved"
3: {id: "Asymmetric", value: "Asymmetric", count: 1503, pLevel: "",…}
count: 1503
id: "Asymmetric"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/544158e4-66bc-4c47-a9ed-a975b45674fc1611746648513-DRESS-KURTA-HEMLINES-ASYMMETRIC.png"
value: "Asymmetric"
4: {id: "High-Low", value: "High-Low", count: 1141, pLevel: "",…}
count: 1141
id: "High-Low"
pLevel: ""
src: "http://assets.myntassets.com/assets/images/retaillabs/2021/1/27/c99174ce-eac1-4a11-ae7d-20b7856e85451611746648450-DRESS-KURTA-HEMLINES-HIGH-LOW.png"
value: "High-Low"
id: "Hemline"
isVisual: true
9: {id: "Main Trend",…}
filterValues: [{id: "Asymmetric", value: "Asymmetric", count: 549, pLevel: "", src: ""},…]
0: {id: "Asymmetric", value: "Asymmetric", count: 549, pLevel: "", src: ""}
count: 549
id: "Asymmetric"
pLevel: ""
src: ""
value: "Asymmetric"
1: {id: "Block Print", value: "Block Print", count: 647, pLevel: "", src: ""}
count: 647
id: "Block Print"
pLevel: ""
src: ""
value: "Block Print"
2: {id: "Floral", value: "Floral", count: 3706, pLevel: "", src: ""}
count: 3706
id: "Floral"
pLevel: ""
src: ""
value: "Floral"
3: {id: "Frills Bows and Ruffles", value: "Frills Bows and Ruffles", count: 20, pLevel: "", src: ""}
count: 20
id: "Frills Bows and Ruffles"
pLevel: ""
src: ""
value: "Frills Bows and Ruffles"
4: {id: "Grandeur & Majestic Artwork", value: "Grandeur & Majestic Artwork", count: 2, pLevel: "",…}
count: 2
id: "Grandeur & Majestic Artwork"
pLevel: ""
src: ""
value: "Grandeur & Majestic Artwork"
5: {id: "Indie Prints", value: "Indie Prints", count: 71, pLevel: "", src: ""}
count: 71
id: "Indie Prints"
pLevel: ""
src: ""
value: "Indie Prints"
6: {id: "Indigo", value: "Indigo", count: 218, pLevel: "", src: ""}
count: 218
id: "Indigo"
pLevel: ""
src: ""
value: "Indigo"
7: {id: "NA", value: "NA", count: 33650, pLevel: "", src: ""}
count: 33650
id: "NA"
pLevel: ""
src: ""
value: "NA"
8: {id: "Pastels", value: "Pastels", count: 276, pLevel: "", src: ""}
count: 276
id: "Pastels"
pLevel: ""
src: ""
value: "Pastels"
9: {id: "Quirky", value: "Quirky", count: 305, pLevel: "", src: ""}
count: 305
id: "Quirky"
pLevel: ""
src: ""
value: "Quirky"
10: {id: "Tiering", value: "Tiering", count: 126, pLevel: "", src: ""}
count: 126
id: "Tiering"
pLevel: ""
src: ""
value: "Tiering"
11: {id: "White Romance", value: "White Romance", count: 41, pLevel: "", src: ""}
count: 41
id: "White Romance"
pLevel: ""
src: ""
value: "White Romance"
id: "Main Trend"
isVisual: false
10: {id: "Print or Pattern Type",…}
11: {id: "Wash Care",…}
12: {id: "Ornamentation",…}
13: {id: "Number of Pockets", filterValues: [{id: "1", value: "1", count: 883, pLevel: "", src: ""},…],…}
14: {id: "Design Styling", filterValues: [{id: "Regular", value: "Regular", count: 32116, pLevel: "",…},…],…}
15: {id: "Colour Family",…}
16: {id: "Weave Type",…}
17: {id: "Length", filterValues: [{id: "Knee Length", value: "Knee Length", count: 6844, pLevel: "",…},…],…}
18: {id: "Fabric 2", filterValues: [{id: "NA", value: "NA", count: 40403, pLevel: "pop", src: ""},…],…}
19: {id: "Technique",…}
20: {id: "Neck",…}
filterValues: [{id: "Round Neck", value: "Round Neck", count: 22900, pLevel: "pop", src: ""},…]
0: {id: "Round Neck", value: "Round Neck", count: 22900, pLevel: "pop", src: ""}
count: 22900
id: "Round Neck"
pLevel: "pop"
src: ""
value: "Round Neck"
1: {id: "Mandarin Collar", value: "Mandarin Collar", count: 9720, pLevel: "pop", src: ""}
count: 9720
id: "Mandarin Collar"
pLevel: "pop"
src: ""
value: "Mandarin Collar"
2: {id: "V-Neck", value: "V-Neck", count: 2791, pLevel: "pop", src: ""}
count: 2791
id: "V-Neck"
pLevel: "pop"
src: ""
value: "V-Neck"
3: {id: "Band Collar", value: "Band Collar", count: 469, pLevel: "", src: ""}
count: 469
id: "Band Collar"
pLevel: ""
src: ""
value: "Band Collar"
4: {id: "Boat Neck", value: "Boat Neck", count: 1803, pLevel: "", src: ""}
count: 1803
id: "Boat Neck"
pLevel: ""
src: ""
value: "Boat Neck"
5: {id: "Cowl Neck", value: "Cowl Neck", count: 9, pLevel: "", src: ""}
count: 9
id: "Cowl Neck"
pLevel: ""
src: ""
value: "Cowl Neck"
6: {id: "Halter Neck", value: "Halter Neck", count: 13, pLevel: "", src: ""}
count: 13
id: "Halter Neck"
pLevel: ""
src: ""
value: "Halter Neck"
7: {id: "Keyhole Neck", value: "Keyhole Neck", count: 2607, pLevel: "", src: ""}
count: 2607
id: "Keyhole Neck"
pLevel: ""
src: ""
value: "Keyhole Neck"
8: {id: "Off-Shoulder", value: "Off-Shoulder", count: 22, pLevel: "", src: ""}
count: 22
id: "Off-Shoulder"
pLevel: ""
src: ""
value: "Off-Shoulder"
9: {id: "Scoop Neck", value: "Scoop Neck", count: 299, pLevel: "", src: ""}
count: 299
id: "Scoop Neck"
pLevel: ""
src: ""
value: "Scoop Neck"
10: {id: "Shawl Neck", value: "Shawl Neck", count: 27, pLevel: "", src: ""}
count: 27
id: "Shawl Neck"
pLevel: ""
src: ""
value: "Shawl Neck"
11: {id: "Shirt Collar", value: "Shirt Collar", count: 1211, pLevel: "", src: ""}
count: 1211
id: "Shirt Collar"
pLevel: ""
src: ""
value: "Shirt Collar"
12: {id: "Square Neck", value: "Square Neck", count: 315, pLevel: "", src: ""}
count: 315
id: "Square Neck"
pLevel: ""
src: ""
value: "Square Neck"
13: {id: "Stylised Neck", value: "Stylised Neck", count: 2, pLevel: "", src: ""}
count: 2
id: "Stylised Neck"
pLevel: ""
src: ""
value: "Stylised Neck"
14: {id: "Sweetheart Neck", value: "Sweetheart Neck", count: 106, pLevel: "", src: ""}
count: 106
id: "Sweetheart Neck"
pLevel: ""
src: ""
value: "Sweetheart Neck"
15: {id: "Tie-Up Neck", value: "Tie-Up Neck", count: 315, pLevel: "", src: ""}
count: 315
id: "Tie-Up Neck"
pLevel: ""
src: ""
value: "Tie-Up Neck"
id: "Neck"
isVisual: false*/
