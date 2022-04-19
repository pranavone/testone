const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderShema = new Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "fule",
          unique: true,
        },
        Size: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("order", OrderShema);
