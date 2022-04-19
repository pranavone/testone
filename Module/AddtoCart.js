const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartShema = new Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    cartitem: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "fule",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        size: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("cart", CartShema);
