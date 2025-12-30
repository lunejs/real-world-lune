import {
  AdminUiServerPlugin,
  AssetServerPlugin,
  DefaultImageProcessor,
  LocalStorageProvider,
  LuneServer,
  DefaultOrderCodeStrategy,
  OrderPriceDiscountHandler,
  ProductDiscountHandler,
  FreeShippingDiscountHandler,
  FlatShippingHandler,
  DummyPaymentHandler,
  DefaultFulfillmentCodeStrategy,
} from '@lunejs/core';
import { config } from 'dotenv';
import { EmailPlugin } from '@lunejs/email-plugin';

config();

const luneServer = new LuneServer({
  app: { port: Number(process.env.PORT) ?? 8080 },
  auth: {
    jwtExpiresIn: Number(process.env.JWT_EXPIRATION) ?? 604800,
    jwtSecret: process.env.JWT_SECRET ?? 'secret',
  },
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
  assets: {
    imageProcessor: new DefaultImageProcessor(),
    storageProvider: new LocalStorageProvider(process.env.LUNE_DOMAIN as string),
  },
  discounts: {
    handlers: [
      OrderPriceDiscountHandler,
      ProductDiscountHandler,
      FreeShippingDiscountHandler,
    ],
  },
  orders: {
    codeStrategy: new DefaultOrderCodeStrategy(),
    fulfillmentCodeStrategy: new DefaultFulfillmentCodeStrategy(),
  },
  shipping: {
    handlers: [new FlatShippingHandler()],
  },
  payments: {
    handlers: [DummyPaymentHandler],
  },
  logger: {
    levels: ['*'],
  },
  plugins: [
    new AssetServerPlugin(),
    new AdminUiServerPlugin(),
    new EmailPlugin({ devMode: true }),
  ],
});

luneServer.start();
