const {Order,ProductCart} =require("../models/order")

exports.getOrderById=(req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                err:"NO order Found"
            })
        }
        req.order=order;
        next();
    })
}

exports.createOrder=(req,res)=>{
    req.body.order.user=req.profile;
    const order = new Order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                err:"failed to save order in db"
            })
        }
        res.json(order)
    })
}
exports.getAllOrders=(req,res)=>{
    Order.find().populate("user","_id name ").exec((err,orders)=>{
        if(err){
            return res.status(400).json({
                err:"No Orders Found"
            })
        }
        res.json(orders)
    })
}
//Status
exports.getOrderStatus=(req,res)=>{
    res.json(Order.schema.path("status").enumValues)
}
exports.updateStatus=(req,res)=>{
    Order.updateOne(
        {
            _id:req.body.orderId
        },
        {$set:{stutus:req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                    err:"cannot update order status"
                })
            }
            res.json(order)
        }
    )
}