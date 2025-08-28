import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger boladao
  const config = new DocumentBuilder()
    .setTitle('API Divide aí')
    .setDescription('Documentação da API para o rastreador de despesas compartilhadas.')
    .setVersion('1.0')
    .addTag('auth', 'Operações de Autenticação') // Tags para organizar as parada
    .addTag('users', 'Operações relacionadas a Usuários')
    .addTag('groups', 'Operações relacionadas a Grupos')
    .addTag('expenses', 'Operações relacionadas a Despesas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

}
bootstrap();
