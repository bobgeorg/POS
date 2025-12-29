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
      unpaidValue: totalPrice,
      paidValue: 0,
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

// @desc    Update order items
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderItems = async (req, res) => {
  try {
    console.log('Updating order items for order ID:', req.params.id);
    console.log('Received OrderItems:', req.body.OrderItems);
    console.log('Received isPaid:', req.body.isPaid);
    
    const { OrderItems, isPaid, paidAt } = req.body
    const order = await Order.findById(req.params.id)

    if (order) {
      console.log('Order found, current items:', order.OrderItems);
      console.log('Current paidValue:', order.paidValue, 'unpaidValue:', order.unpaidValue);
      
      // Update items if provided
      if (OrderItems) {
        const newTotalPrice = OrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
        console.log('Old total price:', order.totalPrice, 'New total price:', newTotalPrice);
        
        order.OrderItems = OrderItems
        order.totalPrice = newTotalPrice
        
        // Update unpaidValue: if order was paid, new items become unpaid
        // unpaidValue = totalPrice - paidValue
        order.unpaidValue = newTotalPrice - order.paidValue
        console.log('Updated unpaidValue:', order.unpaidValue);
      }
      
      // Update payment status if provided
      if (isPaid !== undefined) {
        if (isPaid && !order.isPaid) {
          // Marking as paid: move unpaidValue to paidValue
          order.paidValue += order.unpaidValue
          order.unpaidValue = 0
          console.log('Marked as paid. New paidValue:', order.paidValue);
        } else if (!isPaid && order.isPaid) {
          // Marking as unpaid: move everything to unpaidValue
          order.unpaidValue = order.totalPrice
          order.paidValue = 0
          console.log('Marked as unpaid. New unpaidValue:', order.unpaidValue);
        }
        order.isPaid = isPaid
        order.paidAt = paidAt || (isPaid ? Date.now() : null)
      }
      
      const updatedOrder = await order.save()
      console.log('Order saved successfully:', updatedOrder);
      res.json(updatedOrder)
    } else {
      console.log('Order not found with ID:', req.params.id);
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (error) {
    console.error('Error in updateOrderItems:', error);
    res.status(500).json({ message: error.message })
  }
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
  updateOrderItems,
}
