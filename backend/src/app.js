import express from 'express';
import cors from 'cors';
import db from './config/dbConnect.js';
import routes from './routes/index.js';
import seed from './seeds/index.js';
import dotenv from 'dotenv';
import './models/associations.js';
dotenv.config();


const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const port = process.env.PORT;

try {
    await db.sync();
    console.warn('All models were synchronized successfully.');
} catch (error) {
    console.error(error);
}

const app = express();
app.use(cors());
app.use(express.json());

seed()
    .then(() => {
        console.log('Seeds feitas com sucesso');
    })
    .catch((error) => {
        console.error('Erro ao fazer seeds: ', error);
    });

routes(app);

export default app;
