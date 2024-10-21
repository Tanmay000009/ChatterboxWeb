"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

export const handleLogin = async (formData: FormData) => {
  if (!formData.get("username")) {
    return "Username is required";
  }

  if (
    !formData.get("password") ||
    (formData.get("password") as string)?.length < 8
  ) {
    return "Password doesnt match constraints";
  }

  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.cause;
  }
};
