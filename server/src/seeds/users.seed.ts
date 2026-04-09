import { databasePool } from "../shared/database/connection";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  console.log("Seeding users...");

  const baseUsers = [
    {
      name: "Admin User",
      email: "admin@taskapp.com",
      password: "Admin@123",
      role: "ADMIN" as const,
    },
  ];

  const normalUsers = Array.from({ length: 10 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@taskapp.com`,
    password: "User@123",
    role: "USER" as const,
  }));

  const users = [...baseUsers, ...normalUsers];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await databasePool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [user.name, user.email, passwordHash, user.role]
    );

    console.log(`✅ ${user.role} ensured`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${user.password}`);
  }

  console.log("🎉 Users seeding complete!");
};