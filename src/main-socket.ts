import { NestFactory } from '@nestjs/core';
import { WebSocketModule } from './web-socket.module';

async function bootstrapWebSocketServer() {
  const wsApp = await NestFactory.create(WebSocketModule);
  await wsApp.listen(4000);
  console.log(`WebSocket Server is running on: ${await wsApp.getUrl()}`);
}

bootstrapWebSocketServer();
