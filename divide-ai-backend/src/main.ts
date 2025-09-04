import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // A origem do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //swagger boladao
  const config = new DocumentBuilder()
    .setTitle('API Divide aí')
    .setDescription('Documentação da API para o rastreador de despesas compartilhadas.')
    .setVersion('1.0')
    .addTag('Auth', 'Operações de Autenticação') // Tags para organizar as parada
    .addTag('Users', 'Operações relacionadas a Usuários')
    .addTag('Groups', 'Operações relacionadas a Grupos')
    .addTag('Expenses', 'Operações relacionadas a Despesas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

}
bootstrap();
