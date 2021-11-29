const Order = require("../models/orderModels")
const Product = require("../models/productModels")

//Create new Order
exports.newOrder = async (req, res, next) => {
    try {
        //every name has to be same as in schema bcoz data will be saved corresponding to the corressponding name only
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body; //getting all the inputs

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })
        res.status(201).json({
            sucess: true,
            order
        })

    } catch (err) {
        res.send(err.message);
    }
}

//get single Order
exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");//by populate we can get the info about the user also not just id (visit stackoverflow)
        if (!order) {
            return res.status(404).json({
                sucess: false,
                message: `Order not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            sucess: true,
            order
        })
    } catch (err) {
        res.send(err.message);
    }
}

//get logged in user Order
exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            sucess: true,
            orders
        })
    } catch (err) {
        res.send(err.message);
    }
}

//get all Orders--ADMIN
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        let totalAmount = 0;

        orders.forEach(ele => {
            totalAmount += ele.totalPrice;
        })
        res.status(200).json({
            sucess: true,
            totalAmount,
            orders
        })
    } catch (err) {
        res.send(err.message);
    }
}

//Update Order Status--ADMIN
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                sucess: false,
                message: `Order not found with id ${req.params.id}`
            });
        }
        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                sucess: false,
                message: "You have already delivered this order"
            })
        }

        order.orderItems.forEach(async (ele) => {
            await updateStock(ele.product, ele.quantity)
        })
        order.orderStatus = req.body.status;
        if (order.orderStatus === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false })
        res.status(200).json({
            sucess: true,
        })
    } catch (err) {
        res.send(err.message);
    }
}

async function updateStock(id, quantiy){
    const product =await Product.findById(id);
    product.stock-=quantiy;
    await product.save({ validateBeforeSave: false })  
}

//delete Order--ADMIN
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                sucess: false,
                message: `Order not found with id ${req.params.id}`
            });
        }
        await order.remove();
        res.status(200).json({
            sucess: true,
        })
    } catch (err) {
        res.send(err.message);
    }
}
