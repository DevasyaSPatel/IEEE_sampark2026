
import express from 'express';
import cors from 'cors';
import { registerUser } from './src/controllers/registrationController';
// import { authRoutes } from './src/routes/authRoutes'; // Example

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We can define a router or mount directly for now based on the task scope.
import { getConfigLinks } from './src/controllers/configController';

const apiRouter = express.Router();

apiRouter.post('/auth/register', registerUser);
apiRouter.get('/config/links', getConfigLinks);

// Mount API
app.use('/api', apiRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', server: 'Sampark 2026 Backend' });
});

export default app;
