const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipq6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected");
    const database = client.db("blog-experience");
    const placeCollection = database.collection("place");

    // get place data

    app.get("/", async (req, res) => {
      // console.log("hitting blog");

      const cursor = await placeCollection.find({});

      const result = await cursor.toArray();
      //    console.log(result);
      res.json(result);
    });

    // get dynamic single data

    app.get("/bookingDetails/:id", async (req, res) => {
      console.log("hitting details");
      const Singleid = req.params.id;
      // console.log("hiting details", Singleid);

      const query = { _id: ObjectId(Singleid) };

      const result = await placeCollection.findOne(query);
      // console.log(result);
      res.json(result);
    });

    // post blog

    app.post("/postBlog",async(req,res)=>{

      postBlog= req.body;
      // console.log("hitting post",postBlog);

      const result  = await placeCollection.insertOne(postBlog);
      res.json(result);
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
