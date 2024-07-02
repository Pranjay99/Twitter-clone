import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/Database.js";
import cookieParser from "cookie-parser";
import router from "./routes/userRoute.js";
import tweetrouter from "./routes/tweetRoute.js";
import cors from "cors";
import axios from 'axios';
import bodyParser from 'body-parser';

dotenv.config({
    path: ".env"
});

databaseConnection();

const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://twitter-clone-frontend-wxkr.onrender.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
const NEWS_API_KEY = '45f508153be0483dbfcd6987476bfc06';
const BASE_URL = 'https://newsapi.org/v2';

app.get('/api/news', async (req, res) => {
    const category = req.query.category || 'general';
    const apiKey = NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).send('Error fetching news');
    }
  });

// const TWITTER_API_KEY = 'HQ1tBfLWLvmzn8ioOHApR1Yt5';
// const TWITTER_API_SECRET_KEY = 'bd2h1AVRw4gu4Sg20bJeD23SGNYdJ9axftTGD0H5VP4c5j3OdO';
// const TWITTER_ACCESS_TOKEN = '1289870947910967296-lZ3601QMngTUZZvvg0ur3ebJ6AS3S9';
// const TWITTER_ACCESS_TOKEN_SECRET = 'iHpXxvKcMk0ve9G84TaJIOf4lXPTQ03AODKc1bPVeoSfM';

// const oauth = {
//     consumer_key: TWITTER_API_KEY,
//     consumer_secret: TWITTER_API_SECRET_KEY,
//     token: TWITTER_ACCESS_TOKEN,
//     token_secret: TWITTER_ACCESS_TOKEN_SECRET,
// };

// // Route to fetch trending topics from Twitter API
// app.get('/trending', async (req, res) => {
//     try {
//         const trendsPlaceUrl = 'https://api.twitter.com/1.1/trends/place.json?id=1';

//         const response = await axios.get(trendsPlaceUrl, {
//             headers: {
//                 Authorization: `OAuth ${oauthToString(oauth)}`,
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//         });

//         const trendingTopics = parseTrendingTopics(response.data);
//         res.status(200).json(trendingTopics);
//     } catch (error) {
//         console.error('Error fetching trends:', error);
//         res.status(500).json({ error: 'Failed to fetch trends' });
//     }
// });

// // Helper function to convert oauth object to string
// function oauthToString(oauth) {
//     return Object.keys(oauth).map(key => `${key}="${oauth[key]}"`).join(', ');
// }

// // Function to parse trending topics from Twitter API response
// const parseTrendingTopics = (data) => {
//     if (data && data[0] && data[0].trends) {
//         return data[0].trends.map(trend => trend.name);
//     }
//     return [];
// };

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// API routes
app.use("/api/v1/user", router);
app.use("/api/v1/tweet", tweetrouter);

// Example home endpoint
app.get("/home", (req, res) => {
    res.status(200).json({
        message: "coming from backend...."
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
