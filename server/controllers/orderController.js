const Order = require('../model/Order')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { OrderItems, usingMethod, totalPrice, userName } = req.body

  if (OrderItems && OrderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      OrderItems,
      usingMethod,
      totalPrice,
      userName,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    order.orderStatus = 'delivered'

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const order = await Order.findById(req.params.id)

  if (order) {
    order.orderStatus = status

    // Update timestamps based on status
    if (status === 'preparing') {
      order.preparedAt = Date.now()
    } else if (status === 'ready') {
      order.readyAt = Date.now()
    } else if (status === 'delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    } else if (status === 'paid') {
      order.isPaid = true
      order.paidAt = Date.now()
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Private
const getOrdersByStatus = async (req, res) => {
  const orders = await Order.find({ orderStatus: req.params.status }).sort({ createdAt: -1 })
  res.json(orders)
}

// @desc    Get pending orders (for kitchen/bar)
// @route   GET /api/orders/pending
// @access  Private
const getPendingOrders = async (req, res) => {
  const orders = await Order.find({ 
    orderStatus: { $in: ['pending', 'preparing'] } 
  }).sort({ createdAt: 1 })
  res.json(orders)
}

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user._id })
//   res.json(orders)
// }

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({})
  res.json(orders)
}

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrdersByStatus,
  getPendingOrders,
  getOrders,
}
