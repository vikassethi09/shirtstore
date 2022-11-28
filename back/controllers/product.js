const Product =require('../models/product')
const formidable =require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { sortBy } = require('lodash')




exports.getProductById =(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                err:"Product not found"
            })
        }
        res.product = product;
        next();
    })
}
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //destructure the fields
      const { name, description, price, category, stock } = fields;
  
      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({
          error: "Please include all fields"
        });
      }
  
      let product = new Product(fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.filepath);
        product.photo.contentType = file.photo.mimetype;
      }
      // console.log(product);
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };

exports.getProduct=(req,res)=>{

    req.product.photo=undefined;
    return res.json(req.product);
}
//middleware
exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

//update
exports.updateProduct=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
  
      let product = req.product;
      product= _.extend(product,fields)
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.filepath);
        product.photo.contentType = file.photo.mimetype;
      }
      // console.log(product);
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
}
//delete
exports.deleteProduct=(req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                err:"failed to delete product"
            })
        }
        res.json({
            msg:"deletion was a success",
            deletedProduct
        })
    })
}

//Product listing
exports.getAllProducts=(req,res)=>{
    let limit=req.query.limit? parseInt(req.query.limit): 8;
    let sortBy=req.query.sortBy?req.query.sortBy:"_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                err:"No PRODUCT FOUND"
            })
        }
        res.json(products);
    });
}

//update stock or inventory
exports.updateStock=(req,res,next)=>{
    let myOperations =req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter:{_id: prod._id},
                update:{$inc:{stock:-prod.count,sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperation,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                err:"Bulk operation failed"
            })
        }
        next();
    })
}
exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                err:"No category Found"
            })
        }
        res.json(category);
    })
}