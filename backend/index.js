require('dotenv').config();
const dbConnection = require('./db/db');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth.route');
const foodRoute = require('./routes/food.route');
const foodPartnerRoutes = require('./routes/food-partner.route')
const cors = require('cors')




const app = express();
app.use(cors({
    origin: [
      "http://localhost:5173",        // dev
      "https://favfood-kea0.onrender.com" // prod
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('https://favfood-kea0.onrender.com/api/auth', authRoute);
app.use('/api/food', foodRoute);
app.use('/api/food-partner', foodPartnerRoutes);


// DB connection
dbConnection();

// 🔹 Frontend dist serve karna
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log(frontendPath);

// app.use(express.static(frontendPath));

// Agar koi unknown route aaye to React ka index.html serve karna
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);

});
