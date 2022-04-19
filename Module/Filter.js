const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const FilterSchma = new Shema({
  name: {
    type: String,
  },
  Filtervalue: [
    {
      type: {
        type: String,
      },
      _id: mongoose.Schema.Types.ObjectId,
      idez: { type: mongoose.Schema.Types.ObjectId, ref: "productdata" },
    },
  ],
});

module.exports = mongoose.model("filter", FilterSchma);
