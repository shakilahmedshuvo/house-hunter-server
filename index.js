const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhesy5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // get the database
        // const houseHunterCollection = client.db('houseHunterDatabase').collection('houseHunterCollection');
        const houseHunterUserCollection = client.db('houseHunterDatabase').collection('houseHunterUserCollection');

        // get api for chef collection
        app.get("/user", async (req, res) => {
            const result = await houseHunterUserCollection.find().toArray();
            res.send(result);
        });

        // admission post api
        app.post('/userPost', async (req, res) => {
            const user = req.body;
            const result = await houseHunterUserCollection.insertOne(user);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('house is running');
});

app.listen(port, () => {
    console.log(`house is running on port: ${port}`);
});