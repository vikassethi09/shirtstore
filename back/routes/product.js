const express = require("express")
const router = express.Router()




const{
    isSignedIn,
    isAdmin,
    isAuthenticated } =require('../controllers/auth')
const{
    getUserById 
    } =require('../controllers/user')
const{ 
    getProductById,
    createProduct,
    getProduct,
    photo,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getAllUniqueCategories} =require('../controllers/product')

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//actual routes
//create routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct )
//read routes
router.get("/product/:productId",getProduct )
router.get("/product/photo/:productId",photo )
//delete and update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct )
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct )

//listing route
router.get("/products",getAllProducts)


router.get("/products/categories",getAllUniqueCategories)




module.exports=router;