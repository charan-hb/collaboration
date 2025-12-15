import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { signToken } from "../utils/jwt";

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already in use");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashed, name });
    const token = signToken(user.id);
    return { user, token };
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");
    const token = signToken(user.id);
    return { user, token };
  },

  profile: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  updateProfile: async (id: string, name: string) => {
    const user = await userRepository.updateName(id, name);
    return user;
  },
};


