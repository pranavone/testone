const Order = require("../Module/Order");
const Cart = require("../Module/AddtoCart");
exports.OrderProducts = async (req, res) => {
  const userid = await Order.findOne({ userid: req.userid });

  if (userid !== null) {
    Order.updateOne(
      {
        userid: req.userid,
      },
      {
        $push: {
          orders: req.body.product,
        },
      }
    )
      .then((result) => {
        console.log(result);
        Cart.deleteOne({ userid: req.userid }).then((res) => {
          console.log(res);
        });
        res.json({ orderresponse: req.userid });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    const odersproduct = new Order({
      userid: req.userid,
      orders: req.body.product,
    });
    odersproduct.save().then((response) => {
      Cart.deleteOne({ userid: req.userid }).then((res) => {
        console.log(res);
      });
      res.json({ orderresponse: response._id });
    });
  }
};

exports.getorderproducts = (req, res) => {
  Order.findOne({ userid: req.userid })
    .populate({
      path: "orders",
      populate: {
        path: "product",
      },
    })
    .then((response) => {
      res.json({ products: response });
    });
};
