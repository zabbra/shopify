/************************************/
/*** Import des modules nécessaires */
const express = require('express');
const cors = require('cors')
require("dotenv").config({path:"./app/config/.env"})
const swagger = require ('./swagger');


global.__basedir = __dirname

const app = express();



var corsOptions ={
   origin:"http://localhost:5173"
}





app.use(cors(corsOptions));


app.use(express.json())


app.use(express.urlencoded({ extended: true }))

const db = require("./app/models")
const Role = db.role;

const categoryRoutes = require("./app/routes/category.routes");
const productRoutes = require("./app/routes/product.routes");
const userRoutes = require("./app/routes/user.routes");
const roleRoutes = require("./app/routes/role.routes");
const authRoutes = require("./app/routes/auth.routes");
const cartRoutes = require("./app/routes/cart.routes");
const imageRoutes = require("./app/routes/image.routes");
const cartItemRoutes = require("./app/routes/cartItem.routes");
//const userRoutes = require("./app/routes/user.routes")(app,express)





// route
app.get('/', (req, res) => {
   res.json({ message:"Welcome to my API"}); 
});

app.use("/api/categories",categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/carts",cartRoutes);
app.use("/api/images",imageRoutes)
app.use("/api/cartItems",cartItemRoutes)


//require("./app/routes/auth.routes")(app,express)
//app.use('/api/auth', authRoutes)
//app.use('/api/test', userRoutes)

swagger (app);
app.get('*',(req,res) => res.status(501).send('What the hell are you doing !!!'))

//force: true 
db.sequelize.sync({force:true}).then(() =>{
   console.log("Drop and Resync Db")
   initial();
})

function initial() {
   Role.create({
     id: 1,
     name: "user"
   });
  
   Role.create({
     id: 2,
     name: "moderator"
   });
  
   Role.create({
     id: 3,
     name: "admin"
   });
 }


//port
const PORT = process.env.PORT || 8080;

db.sequelize.authenticate()
.then(() => console.log('Database connected...'))
.then(() =>{
   app.listen(PORT , (err) =>{
      if(err){
         process.exit(1);
      }
      console.log(`server is running on port ${PORT}!`)
   });
})
.catch(err => console.log('Database Error', err))



