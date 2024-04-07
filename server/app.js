const express = require('express')
const app = express()
const mongoose=require('mongoose')
const cors = require('cors')
app.use(cors({
    origin:"*",
    credentials:true
}))



const PORT = process.env.PORT || 5000
const {MONGOURI}=require('../config/keys')
// mongoose.connect(MONGOURI)


mongoose.connect(MONGOURI,{
    useNewUrlparser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeh")

})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting ",err)

})

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routh/auth'))
app.use(require('./routh/post'))
app.use(require('./routh/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}





// const customMiddleware =(req,res,next)=>{
//     console.log(" middleware executed!")
//     next()
// }

// app.use(customMiddleware)

// app.get('/', (req, res) => {
//     console.log("haloo")
//     res.send("hello world")
// })

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})