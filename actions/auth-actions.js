"use server";
import { CreateUser } from "@/lib/user";
import { hashUserPassword } from "@/lib/hash";
import { redirect } from "next/navigation"; // Correct import for redirect

export async function Signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  // Store it in the database (create a new user)
  const hashedPassword = hashUserPassword(password);

  try {
    CreateUser(email, hashedPassword);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'Email already exists.',
        },
      };
    }

    throw error;
  }

  // Correct usage of redirect
  redirect('/training');
}
