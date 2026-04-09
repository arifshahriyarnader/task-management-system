import { seedUsers } from "./users.seed";

const runSeeds = async () => {
  console.log("🚀 Seeding Started...");

  await seedUsers();

  console.log("✅ Seeding Finished!");
  process.exit(0);
};

runSeeds().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});