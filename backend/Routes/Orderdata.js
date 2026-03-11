// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Orders");

// router.post("/orderData", async (req, res) => {
//   try {
//     const { email, order_data, order_date } = req.body;

//     let existingOrder = await Order.findOne({ email });

//     if (existingOrder) {
//       await Order.findOneAndUpdate(
//         { email },
//         { $push: { order_data: { order_data, order_date } } }
//       );
//       res.json({ success: true });
//     } else {
//       await Order.create({
//         email,
//         order_data: [{ order_data, order_date }]
//       });
//       res.json({ success: true });
//     }
//   } catch (error) {
//     console.error("Order Error:", error);
//     res.json({ success: false });
//   }
// });

// router.post('/myOrderData', async (req, res) => {
//   try {
//     const myData = await Order.findOne({ email: req.body.email });
//     res.json({ orderData: myData });
//   } catch (error) {
//     res.send("Server Error");
//   }
// });

// module.exports = router;
