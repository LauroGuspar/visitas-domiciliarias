import { HttpError } from "../../shared/http-error.js";
import type {
  AuthServiceDependencies,
  LoginInput,
  LoginResult,
} from "./auth.types.js";

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const user = await this.dependencies.users.findByUsername(input.username);

    if (!user) {
      throw new HttpError(401, "Credenciales inválidas");
    }

    const passwordMatches = await this.dependencies.password.verify(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new HttpError(401, "Credenciales inválidas");
    }

    if (!user.activo) {
      throw new HttpError(403, "Usuario inactivo");
    }

    const tokenPayload = {
      userId: user.id,
      rol: user.rol,
      municipalidadId: user.municipalidadId,
      actorSocialId: user.actorSocialId,
    };

    return {
      accessToken: this.dependencies.tokens.signAccessToken(tokenPayload),
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol,
        municipalidadId: user.municipalidadId,
        actorSocialId: user.actorSocialId,
      },
    };
  }
}
