import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;
import { AllExceptionsFilter } from './lib/allexeptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter()); 
  await app.listen(process.env.PORT ? Number.parseInt(process.env.PORT) : 3000);
  /*
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  */
}
bootstrap();
