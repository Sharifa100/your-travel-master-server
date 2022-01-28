const express = require('express');
require ("dotenv").config();

const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// nme:your-travel-guru
// password:rKPC8znsT3Kj1fGe

// DB_USER= your-travel-guru
// DB_PASS= rKPC8znsT3Kj1fGe

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.effps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("TravelGuru");
      const servicesCollection = database.collection("services");
      const ordersCollection = database.collection("orders");
     


// POST API

app.post('/addservices',async(req,res)=>{
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);

    console.log(result);
    // res.send('hit the post')
})


// get all services

app.get("/allservices",async(req,res)=>{
const result= await servicesCollection.find({}).toArray();
console.log(result);
res.send(result);
})


// get services

app.get("/services",async(req,res)=>{
    const result = await servicesCollection.find({}).toArray();
   console.log(result);
    res.send(result);
})

// get single service

app.get("/singleservice/:id", async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)}
    const service = await servicesCollection.findOne(query);
    console.log("load user with id",id);
    res.send(service)
//     const result = await servicesCollection.find({_id= objectId(req.params.id)}).toArray();
//     console.log(result);
//     res.send(result);
})



// Get Orders API

app.get('/orders', async(req,res)=>{
    let query = {};
const email=req.query.email;
if(email){
query = {email:email};
}
    const cursor = ordersCollection.find(query);
    const orders = await cursor.toArray();
    res.json(orders);
});

// Add orders API

app.post('/orders', async(req,res)=>{
    const order = req.body;
    order.createdAt = new Date();
    const result = await ordersCollection.insertOne(order);
    res.json(result);
})


// Get all orders API

app.get("/allorders",async(req,res)=>{
    const result= await ordersCollection.find({}).toArray();
    console.log(result);
    res.send(result);
    })

// Delete order Api

 /// delete order

 app.delete("/deleteOrder/:id", async (req, res) => {
    const result = await ordersCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

// Delete Services

 app.delete("/deleteservices/:id", async (req, res) => {
    const result = await servicesCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });



  //  // update status

  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    const options = {upsert:true};
    console.log(updatedStatus);
    ordersCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });

// delete after approved order API

app.delete("/deleteOrders/:id", async (req, res) => {
  const result = await ordersCollection.deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
});

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running my crud');
})

app.listen(port,()=>{
    console.log('listening to me ',port);
})