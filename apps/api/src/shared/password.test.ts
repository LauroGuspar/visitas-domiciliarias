import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

describe("password helpers", () => {
  it("hashes a password and verifies the original value", async () => {
    const hash = await hashPassword("CambioSeguro123");

    expect(hash).not.toBe("CambioSeguro123");
    await expect(verifyPassword("CambioSeguro123", hash)).resolves.toBe(true);
  });

  it("rejects a different password", async () => {
    const hash = await hashPassword("CambioSeguro123");

    await expect(verifyPassword("otra-clave", hash)).resolves.toBe(false);
  });
});
