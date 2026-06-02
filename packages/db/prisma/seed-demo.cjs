// Idempotently creates the P2P "demo recipient" wallet so visitors can send a
// test payment without having to create a second account.
//
// Run from the packages/db directory (so .env is picked up):
//   node prisma/seed-demo.cjs
//
// The recipient number can be overridden with DEMO_RECIPIENT_NUMBER.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const number = process.env.DEMO_RECIPIENT_NUMBER || "9876543210";
  const user = await prisma.user.upsert({
    where: { number },
    update: {},
    create: {
      number,
      name: "TranZakt Demo",
      // This wallet only ever receives money; nobody logs into it.
      password: "demo-receiver-no-login",
      Balance: { create: { amount: 0, locked: 0 } },
    },
  });
  console.log("Demo recipient ready:", { id: user.id, number, name: user.name });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
