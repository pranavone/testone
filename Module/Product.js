const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const ProductShema = new Shema({
  Pname: {
    type: String,
  },
  Pdescription: {
    type: String,
  },

  Pprice: {
    type: Number,
  },
  Pdiscount: {
    type: String,
  },
  Pofferprice: {
    type: Number,
  },
  Pimg: {
    type: Array,
  },
  review: [
    {
      userid: {
        type: String,
      },
      review: {
        type: String,
      },
    },
  ],
  category: {
    type: String,
  },
  keyword: {
    type: String,
  },
  coller: {
    type: String,
  },
  sleeve: {
    type: String,
  },
  color: {
    type: String,
  },
  pattern: {
    type: String,
  },
  specifications: Array,
});

module.exports = mongoose.model("productdata", ProductShema);
