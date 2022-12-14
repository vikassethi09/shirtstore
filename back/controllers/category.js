
const Category =require("../models/category")

exports.getCategoryById=(req,res,next,id)=>{
    
    Category.findById(id).exec((err, category)=>{
        if(err){
            return res.status(400).json({
                error:"Category not found"
            })
        }
        req.category=category;
    })
    next();
}

exports.createCategory=(req,res)=>{
    const category = new Category(req.body)

    category.save((err, category)=>{
     if(err){
         return res.status(400).json({
             error:"not able to save category in DB"
         })
     };
     res.json({category});
    });
 }


exports.getCategory=(req,res)=>{
    return res.json(req.Category)
}
exports.getAllCategories=(req,res)=>{
    Category.find({}).exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"no category found in DB"
            })
        };
        res.json({categories});
    })
}
exports.updateCategory=(req,res)=>{
    const category =req.category;
    
    category.name=req.body.name;
    category.save((err,updatedcategory)=>{
        if(err){
            return res.status(400).json({
                error:"failed to update category"
            })
        };
        res.json({updatedcategory});
    })
}
exports.removeCategory=(req,res)=>{
    const category =req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"failed to remove category"
            })
        };
        res.json({msg:`category deleted successfully ${category}`});
    })
}