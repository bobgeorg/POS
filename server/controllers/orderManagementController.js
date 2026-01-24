const express = require('express');
// const ClerkRoutes = express.Router();
let Order = require('../model/Order')
let Product = require('../model/Product')
let Type = require('../model/TypeProduct')

class orderManagementController {
    // GET /ordermanagement/order
    async showOrder(req, res) {
        try {
            const { date } = req.query;
            let query = {};

            if (date) {
                // Parse the date and create start/end of day
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);

                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            } else {
                // Default to today's orders
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                query.createdAt = {
                    $gte: today,
                    $lte: endOfDay
                };
            }

            const orders = await Order.find(query).sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ message: err.message });
        }
    }
    // POST /ordermanagement/confirm
    confirmOrder(req, res) {
        Order.findOneAndUpdate({_id: req.body.idd}, {"isPaid": true}, function(err, result) {
            
            if(err){
                res.send(err)
            }
            else{
                res.json(result)
            }
        })
    }
    // GET /ordermanagement/food
    showFood(req, res) {
        Product.find(function(err, foods){
            if(err){
                console.log(err);
            }
            else {
                // orders.map(order => (
                //     {...order, SPECIAL: 'OK'}
                // ))
                res.json(foods)  
            }
        });
    }
    // GET /ordermanagement/type
    showType(req, res) {
        Type.find(function(err, types){
            if(err){
                console.log(err);
            }
            else {
                // orders.map(order => (
                //     {...order, SPECIAL: 'OK'}
                // ))
                res.json(types)  
            }
        });
    }
}

module.exports = new orderManagementController();