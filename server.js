const express = require ('express');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require ('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;

    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    
    res.on('finish', () => {
        console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
        console.log('-'.repeat(50));
    });
    next();
});

app.use('/images', (req, res, next) => {
    const imagePath = path.join(__dirname, 'public/images', req.path);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`[${new Date().toISOString()}] Image not found:${req.path}`);
            return res.status(404).json({
                message: 'Image not Found',
                requestedPath: req.path
            });
        }
        next()
    })
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db

async function startServer() {
    try {
        await client.connect();
        db = client.db('lessonshop');
        console.log('Connected to Mongo db atlas');

        
        app.get('/api/lessons', async (req, res) => {
    try{
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        // Build case-insensitive regex for partial match
        const regex = new RegExp(query, 'i');
        const filter = {
            $or: [
                { subject: regex },
                { location: regex }
            ]
        };
        const results = await db.collection('lessons').find(query ? filter : {}).toArray();
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});