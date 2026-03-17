require('dotenv').config();
const http= require('http');
const express = require('express');
const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const cors = require('cors');

app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
client.connect()
  .then(async () => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

  app.get('/watchlist', async (req, res) => {
    const sample = client.db('ASS3'); 
    const collection1 = sample.collection('Watchlist'); 
    try {
      const docs = await collection1.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error('Failed to fetch data from sample', err);
      res.status(500).send('Server error');
    }
  });

  app.get('/addToWatchlist', async (req, res) => {
    const { ticker, stockname } = req.query;
    const sample = client.db('ASS3'); 
    const collection1 = sample.collection('Watchlist'); 
    try {
        const result = await collection1.insertOne({ ticker, stockname });
        res.json(result);
      } catch (err) {
        console.error('Failed to insert data into watchlist', err);
        res.status(500).send('Server error');
      }
  });

app.get('/removeWatchlist', async (req, res) => {
    const { ticker } = req.query;
    const sample = client.db('ASS3'); 
    const collection1 = sample.collection('Watchlist'); 
    try {
        const result = await collection1.deleteOne({ ticker });
        res.json(result);
    } catch (err) {
      console.error('Failed to remove data from watchlist', err);
        res.status(500).send('Server error');
    }
});

app.get('/portfolio', async (req, res) => {
  const portfolio = client.db('ASS3'); 
  const collection = portfolio.collection('Portfolio'); 
  try {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error('Failed to fetch data from sample', err);
    res.status(500).send('Server error');
  }
});

app.get('/addToPortfolio', async (req, res) => {
  const { ticker, stockname, quantity, avgPrice } = req.query;
  const portfolio = client.db('ASS3'); 
  const collection = portfolio.collection('Portfolio'); 
  try {
    console.log("quantity from backend: ",quantity)
    if (quantity != 0) {
      const result = await collection.updateOne({ ticker }, { $set: { stockname, quantity, avgPrice } }, { upsert: true });
      res.json(result);
    } else {
      await collection.deleteOne({ ticker });
    }
 } catch (err) {
    console.error('Failed to insert data into watchlist', err);
    res.status(500).send('Server error');
  }
});

app.get('/removePortfolio', async (req, res) => {
  const { ticker } = req.query;
  const portfolio = client.db('ASS3'); 
  const collection = portfolio.collection('Portfolio'); 
  try {
      const result = await collection.deleteOne({ ticker, quantity: 0 });
      res.json(result);
  } catch (err) {
    console.error('Failed to remove data from watchlist', err);
      res.status(500).send('Server error');
  }
});

app.get('/walletMoney', async (req, res) => {
  const money = client.db('ASS3'); 
  const collection = money.collection('Wallet'); 
  try {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error('Failed to fetch data from sample', err);
    res.status(500).send('Server error');
  }
});

app.get('/walletMoneyUpdate', async (req, res) => {
  const { totalValue } = req.query; 
  const money = client.db('ASS3'); 
  const collection = money.collection('Wallet'); 
  try {
      const filter = {};
      const updateDocument = {
          $set: {
              "moneyInWallet": parseInt(totalValue),
          },
      };
      const result = await collection.updateOne(filter, updateDocument);
      res.json(result);
  } catch (err) {
    console.error('Failed to update data in Wallet', err);
      res.status(500).send('Server error');
  }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})