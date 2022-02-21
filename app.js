let express = require('express')
let app = express();
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
//const mongoUrl = "mongodb://localhost:27017"
const mongoUrl="mongodb+srv://test:test123@cluster0.p7mvq.mongodb.net/evento?retryWrites=true&w=majority"
const dotenv=require('dotenv')
dotenv.config();
const bodyParser=require('body-parser')
const cors=require('cors')
let port=process.env.PORT || 8200;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

/* Main Page */
app.get('/',(req,res)=>{
    res.send('Welcome to the database of EVENTO')
})

/* Get Location */
app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err, result) =>{
        if(err) throw err;
        res.send(result)
    })
})

/* Get Restaurant Location */
app.get('/restaurants',(req,res) => {
    db.collection('restaurantlocation').find().toArray((err, result) =>{
        if(err) throw err;
        res.send(result)
    })
})

/* Cateogory */
app.get('/category',(req,res)=>{
    db.collection('category').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

/* products as per categories */
app.get('/products',(req,res)=>{
    let catId=Number(req.query.category_id);
    let query={};
    if(catId){
        query={category_id:catId}
    }
    console.log(">>>catId",catId)
    db.collection('catdata').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Get all Orders 
app.get('/orders',(req,res) => {
    let email = req.query.email
    let query = {};
    if (email){
        query = {"email":email};
    }

    db.collection('order').find(query).toArray((err, result) =>{
        if(err) throw err;
        res.send(result)
    })
})

/* Place Order */
app.post('/placeOrder', (req, res) => {
    //console.log(req.body)
    db.collection('order').insert(req.body, (err, result) =>{
        if(err) throw err;
        res.send('Order Added Successfully')
    })
})

/* Delete Orders */
app.delete('/deleteOrder', (req, res) => {
    db.collection('order').remove({}, (err, result)  =>{
        if(err) throw err;
        res.send(result)
    })
})

/* Update with Bank Name */
app.put('/updateOrder/:id', (req, res) => {
    let oId = mongo.ObjectId(req.params.id)
    let status = req.query.status?req.query.status:'Pending'
    db.collection('order').updateOne(
        {_id: oId},
        {$set:{
            "status":status,
            "bank_name":req.body.bank_name,
            "bank_status":req.body.bank_status,
        }}, (err, result) =>{
            if(err) throw err;
            res.send(`Status updated to ${status}`)
        })
})


MongoClient.connect(mongoUrl, (err, connection) => {
    if(err) console.log('Error While Connecting');
    db = connection.db('evento')
    app.listen(port,() => {
        console.log(`Listening to the port ${port}`)
    });
})