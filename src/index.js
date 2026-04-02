require('dotenv').config();

// === ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ ОШИБОК ===
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const { initBot } = require('./telegram');
const { initEmailListener } = require('./services/emailListener');

const app = express();
const PORT = process.env.PORT || 3001;

// === БЕЗОПАСНОСТЬ: Заголовки ===
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://mc.yandex.ru'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", '', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.telegram.org', 'https://mc.yandex.ru'],
      frameSrc: ["'self'", 'https://yandex.ru'],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));

// === БЕЗОПАСНОСТЬ: Rate Limiting ===
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов с одного IP
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 10, // макс 10 заказов в час с одного IP
  message: { success: false, error: 'Too many orders, please try again later' }
});

// === CORS ===
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4321'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// === Body Parsing ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// === Static files с заголовками ===
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 часа
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true
}));

// === Logging ===
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path} from ${req.ip}`);
    next();
  });
}

// === Routes с лимитерами ===
app.use('/api/products', apiLimiter, productsRouter);
app.use('/api/orders', orderLimiter, ordersRouter);
app.use('/api/reviews', apiLimiter, reviewsRouter);

// === Health ===
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// === API Info ===
app.get('/api', (req, res) => {
  res.json({
    name: 'ProZhalyuzi API',
    version: '1.0.0',
    endpoints: {
      products: 'GET /api/products',
      createOrder: 'POST /api/orders',
      reviews: 'GET /api/reviews, POST /api/reviews',
      health: 'GET /health'
    }
  });
});

// === 404 ===
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// === Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  // Не отправляем детали ошибки клиенту
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// === Start ===
app.listen(PORT, async () => {
  console.log('\n🚀 Backend running on port ' + PORT);
  console.log('🔐 Security: Helmet + Rate Limiting enabled');
  console.log('📁 Uploads: http://localhost:' + PORT + '/uploads/products');
  console.log('📡 CORS: ' + (process.env.CORS_ORIGIN || 'http://localhost:4321'));
  console.log('🤖 Telegram: ' + (process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'));
  console.log('📍 API: http://localhost:' + PORT + '/api\n');
  
  initBot();
  setTimeout(() => initEmailListener(), 3000);
});
