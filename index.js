const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const houseHunterUserCollection = client.db('houseHunterDatabase').collection('houseHunterUserCollection');
        const houseCollection = client.db('houseHunterDatabase').collection('houseHunterCollection');
        const houseBookCollection = client.db('houseHunterDatabase').collection('houseBookCollection');

        // get api for user collection
        app.get("/user", async (req, res) => {
            const result = await houseHunterUserCollection.find().toArray();
            res.send(result);
        });

        // post user data
        app.post('/userPost', async (req, res) => {
            const user = req.body;
            const result = await houseHunterUserCollection.insertOne(user);
            res.send(result);
        });

        // get api for all houses
        app.get("/allHouse", async (req, res) => {
            const result = await houseCollection.find().toArray();
            res.send(result);
        });

        // post house api
        app.post('/allHouse', async (req, res) => {
            const house = req.body;
            const result = await houseCollection.insertOne(house);
            res.send(result);
        });

        // delete house api
        app.delete('/allHouse/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await houseCollection.deleteOne(query);
            res.send(result)
        });

        // single house api
        app.get('/allHouse/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await houseCollection.findOne(query);
            res.send(result)
        });

        // all house update section
        app.put('/allHouse/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const data = {
                $set: {
                    name: update.name,
                    address: update.address,
                    city: update.city,
                    bedrooms: update.bedrooms,
                    bathrooms: update.bathrooms,
                    roomSize: update.roomSize,
                    picture: update.picture,
                    date: update.date,
                    price: update.price,
                    phone: update.phone,
                    description: update.description,
                }
            }
            const result = await houseCollection.updateOne(filter, data, options);
            res.send(result);
        });

        // booking get api
        app.get("/booking", async (req, res) => {
            const result = await houseBookCollection.find().toArray();
            res.send(result);
        });

        // booking post api
        app.post('/bookingPost', async (req, res) => {
            const house = req.body;
            const result = await houseBookCollection.insertOne(house);
            res.send(result);
        });

        // booking delete api
        app.delete('/bookingDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await houseBookCollection.deleteOne(query);
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