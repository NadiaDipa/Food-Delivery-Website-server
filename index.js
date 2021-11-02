const express = require('express');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.5icft.mongodb.net:27017,cluster0-shard-00-01.5icft.mongodb.net:27017,cluster0-shard-00-02.5icft.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-gpihsg-shard-0&authSource=admin&retryWrites=true&w=majority`;
// console.log(uri)


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


async function run() {
    try {
        await client.connect();
        const database = client.db('food_delivery');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users')
        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // get email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const result = await servicesCollection.find({
                email: email
            }).toArray();
            res.json(result);

        })

        // post users
        app.post('/users', async (req, res) => {
            const users = req.body;
            // console.log('hit users')
            const result = await usersCollection.insertOne(users);
            res.json(result);
        })


        // get single api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api')
            const result = await servicesCollection.insertOne(service)
            res.json(result)
        })

        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('food delivery');
});

app.listen(port, () => {
    console.log('food delivery listening on the port', port)
})


// =========================

// const express = require('express');
// const app = express();
// const {
//     MongoClient
// } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
// require('dotenv').config()
// const cors = require('cors');
// const port = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icwz7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // console.log(uri)

// async function run() {
//     try {
//         await client.connect();
//         const database = client.db('food_delivery');
//         const servicesCollection = database.collection('services');
//         const usersCollection = database.collection('users')
//         // get api
//         app.get('/services', async (req, res) => {
//             const cursor = servicesCollection.find({});
//             const services = await cursor.toArray();
//             res.send(services)
//         })

//         // get users
//         app.get('/users', async (req, res) => {
//             const cursor = usersCollection.find({});
//             const users = await cursor.toArray();
//             res.send(users)
//         })

//         // get email
//         app.get('/users/:email', async (req, res) => {
//             const email = req.params.email;
//             const result = await servicesCollection.find({
//                 email: email
//             }).toArray();
//             res.json(result);

//         })

//         // post users
//         app.post('/users', async (req, res) => {
//             const users = req.body;
//             // console.log('hit users')
//             const result = await usersCollection.insertOne(users);
//             res.json(result);
//         })


//         // get single api
//         app.get('/services/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = {
//                 _id: ObjectId(id)
//             };
//             const service = await servicesCollection.findOne(query);
//             res.json(service)
//         })

//         // post api
//         app.post('/services', async (req, res) => {
//             const service = req.body;
//             // console.log('hit the post api')
//             const result = await servicesCollection.insertOne(service)
//             res.json(result)
//         })

//         // delete api
//         app.delete('/users/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = {
//                 _id: ObjectId(id)
//             };
//             const result = await usersCollection.deleteOne(query);
//             res.json(result);
//         })

//     } finally {
//         // await client.close();
//     }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('World travel server');
// });

// app.listen(port, () => {
//     console.log('Word travel listening on the port', port)
// })