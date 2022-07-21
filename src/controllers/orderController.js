const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMessage = require("../helpers/sendMessage");

exports.createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await OrderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
    email: req.user.email,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// * get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// * get login user order

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// * get all order -- Admin

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await OrderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// * update order status -- Admin

exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // product and quantity update
  // order.product it is a id
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  const { phoneNumber } = order.shippingInfo;
  await sendMessage(phoneNumber);
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await ProductModel.findById(id);
  product.stock -= quantity;
  if (product.stock < 0) product.stock = 0;
  await product.save({ validateBeforeSave: false });
}

// * delete order -- Admin

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});
