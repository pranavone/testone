const Product = require("../Module/test");

exports.getProductById = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  res.json({ product: [product] });
};
