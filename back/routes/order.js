const express = require("express")
const router = express.Router()

const{
    isSignedIn,
    isAdmin,
    isAuthenticated } =require('../controllers/auth')
const{
    getUserById ,
    userPurchaseList,
    pushOrderInPurchaseList
    } =require('../controllers/user')
const{updateStock}=require("../controllers/product")
    
const{getOrderById,createOrder,getAllOrders,updateStatus,getOrderStatus}=require("../controllers/order")

//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)
// actual routes
//create
router.post("/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder) 
//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)
//status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)



module.exports=router;