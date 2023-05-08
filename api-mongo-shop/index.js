const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 3500;

const uri =
  "mongodb+srv://admin:kkshowpow123@cluster0.goabpew.mongodb.net/shopdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/store/create", async (req, res) => {
  const store = {
    store_id: parseInt(req.body.store_id),
    store_name: req.body.store_name,
    store_detail: req.body.store_detail,
    store_address: req.body.store_address,
    store_profile: req.body.store_profile,
  };

  try {
    await client.connect();
    const database = client.db("shopdb");
    const result = await database.collection("store").insertOne(store);
    console.log(`Inserted a document with id: ${result.insertedId}`);
    res.status(200).send({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.get("/stores", async function (req, res, next) {
  try {
    await client.connect();
    const database = client.db("shopdb");
    const stores = await database.collection("store").find().toArray();
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.put("/store/update", async (req, res) => {
  const { store_id, store_name, store_detail, store_address, store_profile } =
    req.body;
  try {
    await client.connect();
    const database = client.db("shopdb");
    const result = await database
      .collection("store")
      .updateOne(
        { store_id: parseInt(store_id) },
        { $set: { store_name, store_detail, store_address, store_profile } }
      );
    console.log(`Modified ${result.modifiedCount} documents`);
    res.status(200).send({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.delete("/store/delete", async (req, res) => {
  try {
    const storeId = parseInt(req.body.store_id);
    await client.connect();
    const database = client.db("shopdb");
    const result = await database
      .collection("store")
      .deleteOne({ store_id: storeId });
    console.log(`Deleted ${result.deletedCount} document(s).`);
    res.status(200).send({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.post("/product/create", async (req, res) => {
  const product = {
    product_id: req.body.product_id,
    store_id: req.body.store_id,
    product_name: req.body.product_name,
    product_detail: req.body.product_detail,
    product_price: req.body.product_price,
    product_total: req.body.product_total,
    product_img: req.body.product_img,
  };

  try {
    await client.connect();
    const database = client.db("shopdb");
    const result = await database.collection("product").insertOne(product);
    console.log(`Inserted a document with id: ${result.insertedId}`);
    res.status(200).send({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});
app.get("/stores/:storeId", async (req, res) => {
  const storeId = req.params.storeId;
  try {
    await client.connect();
    const db = client.db("shopdb");
    const products = await db
      .collection("product")
      .find({ store_id: parseInt(storeId) })
      .toArray();
    res.send(products);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error retrieving products");
  }
});

app.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('shopdb');
    const result = await db.collection('product').findOne({ product_id: parseInt(id) });
    res.json(result);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("ERR");
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
