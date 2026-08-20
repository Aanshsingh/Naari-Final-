import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product}`);
    }

    if (!product.isActive) {
      throw new ApiError(400, `${product.name} is currently unavailable`);
    }

    if (product.stock < item.qty) {
      throw new ApiError(
        400,
        `Only ${product.stock} units of ${product.name} are available`,
      );
    }

    // Use discount price if available, otherwise regular price
    const price = product.discountPrice ?? product.price;

    const itemTotal = price * item.qty;

    itemsPrice += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || product.images?.[0] || "",
      price,
      qty: item.qty,
      size: item.size,
    });
  }

  const shippingPrice = itemsPrice > 5000 ? 0 : 99;

  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
    orderStatus: "placed",
    paymentInfo: {
      status: "pending",
    },
    statusHistory: [{ status: "placed", note: "Order placed" }],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res.status(200).json(new ApiResponse(200, order, "Order Fatched"));
});

const getMyOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("items.product", "name slug images")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      orders,
      "Orders fetched successfully"
    )
  );
});

const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = status
    ? { orderStatus: status }
    : {};

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product", "name slug images")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      orders,
      "Orders fetched successfully"
    )
  );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const ValidStatuses = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!ValidStatuses.includes(orderStatus)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      order,
      "Order status updated"
    )
  );
});

// controllers/order.controller.js — add this
const getOrderStats = asyncHandler(async (req, res) => {
  const [revenueResult, orderCount, pendingCount] = await Promise.all([
    Order.aggregate([
      { $match: { "paymentInfo.status": "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: "placed" }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue: revenueResult[0]?.total || 0,
        totalOrders: orderCount,
        pendingOrders: pendingCount,
      },
      "Stats fetched",
    ),
  );
});

// controllers/order.controller.js — add this
const getSalesOverview = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailySales = await Order.aggregate([
    {
      $match: {
        "paymentInfo.status": "paid",
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, dailySales, "Sales overview fetched"));
});

export {
  createOrder,
  getOrderById,
  getMyOrder,
  updateOrderStatus,
  getAllOrdersAdmin,
  getOrderStats,
  getSalesOverview,
};
