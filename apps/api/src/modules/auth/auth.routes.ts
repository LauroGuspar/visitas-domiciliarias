import { Router } from "express";
import { loginSchema } from "./auth.schemas.js";
import type { LoginInput, LoginResult } from "./auth.types.js";

type LoginUseCase = {
  login(input: LoginInput): Promise<LoginResult>;
};

export function createAuthRouter(loginUseCase: LoginUseCase) {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Datos de login inválidos",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const result = await loginUseCase.login(parsed.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
