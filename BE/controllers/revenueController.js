import orderModel from "../models/orderModel.js";

const revenueTime = async (req, res) => {
  try {
    const { from, to, type = "day" } = req.query;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const formatMap = {
      day: "%Y-%m-%d",
      month: "%Y-%m",
      year: "%Y",
    };
    const groupFormat = formatMap[type] || "%Y-%m-%d";

    const result = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$state", "shipped"] }, "$total_price", 0],
            },
          },
          totalRefund: {
            $sum: {
              $cond: [{ $eq: ["$state", "returned"] }, "$refund_amount", 0],
            },
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error in revenueTime:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { revenueTime };
