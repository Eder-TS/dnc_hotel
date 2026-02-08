import bcrypt from 'bcrypt';

export async function hashUserPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
