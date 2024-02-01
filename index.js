require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const http = require('http');
const helmet = require("helmet")
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const compression = require('compression');
const { connectDB } = require('./server');
const userRouter = require('./routes/userroute');
const groceryitemRouter = require('./routes/groceryitemroute');
const orderRouter = require('./routes/orderroute');
const orderdetailsRouter = require('./routes/orderdetailroute');
const authRouter = require('./routes/authroute');

const app = express(); 
const PORT = 3000; 

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
app.options('*', cors());

app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);authRouter
app.use('/api/v1/groceryitem', groceryitemRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/orderdetails', orderdetailsRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});
app.use(globalErrorHandler);

const server = http.createServer(app);
server.listen(PORT);
server.on('error', err => {
    // utils.writeErrorLog(err, req);
    console.error(err);
  });
  server.on('listening', async () => {
    console.log(`Server listening on port ${PORT}`);
    await connectDB();
  });