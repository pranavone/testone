const Cart = require("../Module/AddtoCart");
const Product = require("../Module/test");

async function getdatas(userid) {
  const cartdatas = await Cart.findOne({ userid: userid }).populate({
    path: "cartitem",
    populate: {
      path: "product",
    },
  });

  return cartdatas;
}

exports.addtocart = async (req, res) => {
  console.log(req.body);
  if (req.body.size) {
    const checkuser = await Cart.findOne({ userid: req.userid });
    if (checkuser === null) {
      const cartinfo = new Cart({
        userid: req.userid,
        cartitem: [
          {
            product: req.body.product,
            quantity: req.body.quantity,
            size: req.body.size,
          },
        ],
      });
      cartinfo
        .save()
        .then((resp) => {
          Cart.findOne({ userid: req.userid }).then((response) => {
            res.json({
              messeage: "add to bag successfuly",
              noofproduct: response.cartitem.length,
            });
          });
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      const checkproduct = await Cart.findOne({
        userid: req.userid,
        cartitem: {
          $elemMatch: { product: req.body.product, size: req.body.size },
        },
      });
      console.log(checkproduct);
      if (checkproduct === null) {
        Cart.updateOne(
          { userid: req.userid },
          {
            $push: {
              cartitem: {
                product: req.body.product,
                size: req.body.size,
              },
            },
          }
        )
          .then((resp) => {
            Cart.findOne({ userid: req.userid }).then((response) => {
              res.json({
                messeage: "add to bag successfuly",
                noofproduct: response.cartitem.length,
              });
            });
          })
          .catch((resp) => {
            res.json({ messeage: "something went wrong" });
          });
      } else if (checkproduct !== null && checkproduct._id) {
        const find = {
          userid: req.userid,
          cartitem: {
            $elemMatch: { product: req.body.product, size: req.body.size },
          },
        };
        const update = {
          $inc: { "cartitem.$.quantity": 1 },
        };
        Cart.updateOne(find, update)
          .then((resp) => {
            res.json({
              messeage: "product exist increment by 1",
            });
          })
          .catch((res) => {
            res.json({ messeage: "something went wrong" });
          });
      }
    }
  } else {
    res.json({ messeage: " please select size" });
  }
};

exports.getcart = async (req, res) => {
  if (req.userid) {
    if (req.body.productid && req.body.size && req.body.quantity) {
      console.log("psq");
      const find = {
        userid: req.userid,
        cartitem: {
          $elemMatch: { product: req.body.productid, size: req.body.size },
        },
      };
      const update = {
        "cartitem.$.quantity": req.body.quantity,
      };
      Cart.updateOne(find, update)
        .then((respons) => {
          getdatas(req.userid).then((respo) => {
            const cartvalue = {
              cartvalue: 0,
              total: 0,
            };
            respo.cartitem.map((i) => {
              cartvalue["cartvalue"] += i.product.price * i.quantity;
              cartvalue["total"] += i.product.mrp * i.quantity;
            });
            res.json({ products: respo, summery: cartvalue });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (req.body.productid) {
      console.log("only productid");
    } else {
      console.log("nothing");
      getdatas(req.userid).then((response) => {
        const cartvalue = {
          cartvalue: 0,
          total: 0,
        };
        response &&
          response.cartitem &&
          response.cartitem.map((i) => {
            cartvalue["cartvalue"] += i.product.price * i.quantity;
            cartvalue["total"] += i.product.mrp * i.quantity;
          });

        res.json({ products: response, summery: cartvalue });
      });
    }
  }

  // if (req.userid) {
  //   if (req.body.productid) {
  //     const find = {
  //       userid: req.userid,
  //       cartitem: {
  //         $elemMatch: { product: req.body.productid, size: req.body.size },
  //       },
  //     };
  //     const update = {
  //       $inc: { "cartitem.$.quantity": 1 },
  //     };
  //     const respons = await Cart.updateOne(find, update);
  //     const userids = await Cart.findOne({ userid: req.userid });
  //     const result = await Promise.all(
  //       userids.cartitem.map(async (i) => {
  //         const info = await Product.findOne({ _id: i.product }).select(
  //           "price searchImage brand"
  //         );
  //         return {
  //           products: info,
  //           productid: i.product,
  //           quantity: i.quantity,
  //           size: i.size,
  //           price: info.price * i.quantity,
  //         };
  //       })
  //     );

  //     res.json({ products: result });
  //   } else {
  //     console.log("error");
  //     const userids = await Cart.findOne({ userid: req.userid });
  //     const result = await Promise.all(
  //       userids.cartitem.map(async (i) => {
  //         const info = await Product.findOne({ _id: i.product }).select(
  //           "price searchImage brand"
  //         );
  //         return {
  //           products: info,
  //           productid: i.product,
  //           quantity: i.quantity,
  //           size: i.size,
  //           price: info.price * i.quantity,
  //         };
  //       })
  //     );
  //     res.json({ products: result });
  //   }
  // } else {
  //   res.json({ messeage: " login required" });
  //   console.log("login required");
  // }
};

exports.deletecartproduct = async (req, res) => {
  Cart.updateOne(
    {
      userid: req.userid,
      cartitem: {
        $elemMatch: { product: req.body.productid, size: req.body.size },
      },
    },
    {
      $pull: { cartitem: { product: req.body.productid, size: req.body.size } },
    }
  )
    .then((response) => {
      getdatas(req.userid)
        .then((response) => {
          const cartvalue = {
            cartvalue: 0,
            total: 0,
          };
          response &&
            response.cartitem &&
            response.cartitem.map((i) => {
              cartvalue["cartvalue"] += i.product.price * i.quantity;
              cartvalue["total"] += i.product.mrp * i.quantity;
            });

          res.json({
            products: response,
            summery: cartvalue,
            noofproduct: response === null ? 0 : response.cartitem.length,
          });
        })
        .catch((error) => {
          console.log("EROOr");
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
/*
const result = await Promise.all(
        userids.cartitem.map(async (i) => {
          const info = await Product.findOne({ _id: i.product }).select(
            "price searchImage brand"
          );
          return {
            products: info,
            productid: i.product,
            quantity: i.quantity,
            size: i.size,
            price: info.price * i.quantity,
          };
        })
      );
      res.json({ products: result });
    }



products ":[{"
landingPageUrl ":"
tshirts\u002Fhrx - by - hrithik - roshan\u002Fhrx - by - hrithik - roshan - running - men - white--french - blue - rapid - dry - pack - of -2 - solid - t - shirts\u002F15331724\u002Fbuy ","
loyaltyPointsEnabled ":false,"
adId ":"
","
isPLA ":false,"
productId ":15331724,"
product ":"
HRX By Hrithik Roshan Running Men White & French Blue Rapid - Dry Pack of 2 Solid T - shirts ","
productName ":"
HRX By Hrithik Roshan Running Men White & French Blue Rapid - Dry Pack of 2 Solid T - shirts ","
rating ":0,"
ratingCount ":0,"
isFastFashion ":false,"
futureDiscountedPrice ":0,"
futureDiscountStartDate ":"
","
discount ":0,"
brand ":"
HRX by Hrithik Roshan ","
searchImage ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F45ae842f - 1474 - 44 d4 - 8 dc5 - 7e1 a34da71ef1640769504491 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 1. jpg ","
effectiveDiscountPercentageAfterTax ":0,"
effectiveDiscountAmountAfterTax ":0,"
buyButtonWinnerSkuId ":49825809,"
buyButtonWinnerSellerPartnerId ":4027,"
relatedStylesCount ":0,"
relatedStylesType ":"
","
productVideos ":[],"
inventoryInfo ":[{"
skuId ":49825809,"
label ":"
S ","
inventory ":36,"
available ":true},{"
skuId ":49825814,"
label ":"
M ","
inventory ":108,"
available ":true},{"
skuId ":49825816,"
label ":"
L ","
inventory ":104,"
available ":true},{"
skuId ":49825812,"
label ":"
XL ","
inventory ":69,"
available ":true},{"
skuId ":49825810,"
label ":"
XXL ","
inventory ":31,"
available ":true}],"
sizes ":"
S, M, L, XL, XXL ","
images ":[{"
view ":"
default ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F45ae842f - 1474 - 44 d4 - 8 dc5 - 7e1 a34da71ef1640769504491 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 1. jpg "},{"
view ":"
front ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F699088b0 - 04 a1 - 4e24 - 8 c8b - f6f3601e24cd1640769504471 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 2. jpg "},{"
view ":"
right ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002Fa11a4b12 - 2642 - 4 d31 - 81 ed - 287 ffd3328961640769504427 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 4. jpg "},{"
view ":"
search ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F45ae842f - 1474 - 44 d4 - 8 dc5 - 7e1 a34da71ef1640769504491 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 1. jpg "},{"
view ":"
top ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F1a532e7a - 4506 - 4168 - 81 a4 - be4dbc7a80351640769504385 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 6. jpg "},{"
view ":"
left ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002Fbb43d7fa - a432 - 47 f8 - 965 b - fb644c893b851640769504407 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 5. jpg "},{"
view ":"
size_representation ","
src ":"
"},{"
view ":"
back ","
src ":"
http: \u002F\u002Fassets.myntassets.com\u002Fassets\u002Fimages\u002F15331724\u002F2021\u002F12\u002F29\u002F9f117b02 - c796 - 4 bba - b3af - 2 f9e4131c3a21640769504450 - HRX - By - Hrithik - Roshan - Running - Men - French - Blue - Rapid - Dry - Soli - 3. jpg "}],"
gender ":"
Men ","
primaryColour ":"
Blue ","
discountLabel ":"
","
discountDisplayLabel ":"
","
additionalInfo ":"
Pack of 2 Rapid - Dry T - shirts ","
category ":"
Tshirts ","
mrp ":1699,"
price ":1699,"
advanceOrderTag ":"
","
colorVariantAvailable ":false,"
productimagetag ":"
","
listViews ":0,"
discountType ":"
","
tdBxGyText ":"
","
catalogDate ":"
1640822400000 ","
season ":"
Fall ","
year ":"
2021 ","
isPersonalised ":false,"
eorsPicksTag ":"
","
personalizedCoupon ":"
","
personalizedCouponValue ":0,"
productMeta ":"
","
systemAttributes ":[],"
attributeTagsPriorityList ":[],"
preferredDeliveryTag ":"
"}],"
sortOptions ":["
new ","
price_desc ","
popularity ","
discount ","
price_asc ","
Customer Rating "],"
nbr ":[],"
storefrontId ":"
test1 ","
upsInfo ":{"
personalizationSortAlgoUsed ":"
","
numPersonalizedProductShown ":0,"
isPersonalized ":false},"
changeLog ":[],"
appliedParams ":{"
selectAllChecked ":"
","
 */
