const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/fetch-data', async (req, res) => {
    try {
        const search = req.query.search;
        const url = `https://finnhub.io/api/v1/search?q=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching data');
    }
});

app.get('/api/data/profile', (req, res) => {
    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/stockprice', (req, res) => {
    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/quote?symbol=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/rtrends', (req, res) => {
    const search = req.query.ticker;
    const url = `  https://finnhub.io/api/v1/stock/recommendation?symbol=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/sentiments', (req, res) => {
    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${search}&from=2022-01-01&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/peers', (req, res) => {
    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/stock/peers?symbol=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/earnings', (req, res) => {

    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${search}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

  app.get('/api/data/companynews', (req, res) => {
    const date = new Date();
    const toDate = date.toISOString().split('T')[0];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(date.getDate() - 7);
    const fromDate = sevenDaysAgo.toISOString().split('T')[0];

    const search = req.query.ticker;
    const url = `https://finnhub.io/api/v1/company-news?symbol=${search}&from=${fromDate}&to=${toDate}&token=cn8rl8pr01qocbph3220cn8rl8pr01qocbph322g`;
    axios.get(url).then(response => {
        return res.json(response.data);
    }).catch(error => {
    });
  });

app.get('/api/data/highcharts', (req, res) => {
    const date = new Date();
    const toDate = date.toISOString().split('T')[0];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setFullYear(date.getFullYear() - 2);
    sixMonthsAgo.setDate(date.getDate() - 1);
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];

    const search = req.query.ticker;
    const url = `https://api.polygon.io/v2/aggs/ticker/${search}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=94GYmeFAD3Jf1tWiRNN2PG7BEwDfxPzl`;
    axios.get(url).then(response => {
        return res.json(response.data.results);
    }).catch(error => {
    });
  });

  app.get('/api/data/highchartsummary', (req, res) => {

    let to = new Date();
    todayDate = dateFormatted(to);

    let from = new Date();
    from.setDate(to.getDate() - 1);
    fromDate = dateFormatted(from);

    const search = req.query.ticker;
    const url = `https://api.polygon.io/v2/aggs/ticker/${search}/range/1/hour/${fromDate}/${todayDate}?adjusted=true&sort=asc&apiKey=94GYmeFAD3Jf1tWiRNN2PG7BEwDfxPzl`;
    axios.get(url).then(response => {
        return res.json(response.data.results);
    }).catch(error => {
    });

});

const dateFormatted = (date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth()+1).padStart(2, '0');
  const year = date.getFullYear();

  return year + "-" + month + "-" + d;
}




module.exports = app;