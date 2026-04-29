const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// DB connect
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.get('/', (req, res) => {
  res.send('Split-the-Bill API is running...');
});

app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/expenses', require('./routes/expenses'));

/* ---------------- DEBUG ROUTE (ADD HERE) ---------------- */
app.get("/api/debug-env", (req, res) => {
  res.json({
    mongo: process.env.MONGO_URI ? "loaded" : "missing",
    jwt: process.env.JWT_SECRET ? "loaded" : "missing",
    alchemy: process.env.ALCHEMY_URL ? "loaded" : "missing",
    privateKey: process.env.PRIVATE_KEY ? "loaded" : "missing",
    contract: process.env.CONTRACT_ADDRESS ? "loaded" : "missing",
    port: process.env.PORT
  });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5005;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});