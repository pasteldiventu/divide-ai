import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SENHA_JWT_BOLADO',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('Payload JWT validado:', payload);
    return { id: payload.sub, email: payload.email };
  }
}
