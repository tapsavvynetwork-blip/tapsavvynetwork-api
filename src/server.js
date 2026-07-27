import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/index.js';

connectDB(config.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
