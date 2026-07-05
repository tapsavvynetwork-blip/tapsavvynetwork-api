import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { config } from './config/index.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB(config.MONGO_URI);

app.use('/api', routes);

app.use(errorHandler);

const PORT = config.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
