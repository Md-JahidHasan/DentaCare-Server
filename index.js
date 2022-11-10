const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ptptzcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollction = client.db('dentaCareDb').collection('services');
        const reviewCollection = client.db('dentaCareDb').collection('reviews');
        
        // services API
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = servicesCollction.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await servicesCollction.insertOne(service);
            res.send(result)
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await servicesCollction.findOne(query);
            res.send(service)
        })


        // reviews API
        app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result)
        })
        app.get('/reviews', async(req, res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

    }
    finally{

    }

}
run()
.catch(err=>console.log(err))

app.get('/', (req, res)=>{
    res.send('DentaCare API is running')
})
app.listen(port, ()=>{
    console.log(`DentaCare Server running on port ${port}`);
})
