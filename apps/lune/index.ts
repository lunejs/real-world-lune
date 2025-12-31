import {
  AdminUiServerPlugin,
  AssetServerPlugin,
  DefaultImageProcessor,
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
import { PaypalPlugin } from '@lunejs/paypal-plugin';
import { S3StorageProvider } from '@lunejs/s3';

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
    storageProvider: new S3StorageProvider({
      bucketName: process.env.AWS_BUCKET_NAME as string,
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
      }
    }),
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
    new PaypalPlugin({
      devMode: true,
      clientId: process.env.PAYPAL_CLIENT_ID as string,
      secret: process.env.PAYPAL_SECRET as string,
    })
  ],
});

luneServer.start();
