import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*', // Allow all origins for dev/production flexibility
  credentials: true
}));

app.use(express.json());

// Mount API routes under /api
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[THRYVE Backend] Server running on http://localhost:${PORT}`);
});

export default app;
