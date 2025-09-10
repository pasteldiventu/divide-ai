import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Um guard que ativa a estratégia de autenticação JWT ('jwt').
 * Ele irá extrair o token do cabeçalho da requisição, validá-lo
 * e anexar o payload do usuário ao objeto `request`.
 * Se o token for inválido ou não existir, ele lançará uma UnauthorizedException.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
