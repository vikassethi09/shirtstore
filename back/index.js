require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');

//Routers
const authRoutes = require("./routes/auth.js")
const userRoutes = require("./routes/user.js")
const categoryRoutes = require("./routes/category.js")
const productRoutes = require("./routes/product.js")
const orderRoutes = require("./routes/order")



const app = express();
//Port
const port =process.env.PORT || 3000;
//DB Connections
mongoose.connect( process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
            
    }
).then(()=>{
            console.log("Mongo running Smoothly");
});
//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//My Routes
app.use("/api", authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)

app.get('/',(req,res)=>{
            //res.send("<h1 style={text-align:center}>Welcome to T-shirt Store Backend</h1> ")
            res.sendFile(path.join(__dirname, '/index.html'));
});


//Starting a server
app.listen(port, ()=>{console.log("app listening on port " + port)})
