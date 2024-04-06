import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private clients: Map<number, Socket> = new Map();

  // TODO: 왜 이게 호출이 안되지? 무조건 message 만 호출됨
  @SubscribeMessage('login')
  handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number },
  ): void {
    console.log('handle login');
    console.log(data);
    this.clients.set(data.userId, client);
    client.emit('logged_in', `You are logged in as ${data.userId}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userId?: number;
      senderId: number;
      receiverId: number;
      message: string;
    },
  ): Promise<void> {
    const { userId, senderId, receiverId, message } = data;
    if (userId) {
      this.handleLogin(client, { userId });
      return;
    }
    const receiverClient = this.clients.get(receiverId);
    if (receiverClient) {
      receiverClient.emit('receiveMessage', {
        from: senderId,
        message,
      });
    } else {
      // TODO: 푸쉬메시지 발송할 수 있음.
      client.emit('error', 'Receiver not connected');
    }
  }
}
