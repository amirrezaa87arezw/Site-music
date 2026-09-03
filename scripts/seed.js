// این اسکریپت اولین ادمین اصلی (مدیر کل) سایت را می‌سازد.
// مقادیر را از متغیرهای محیطی می‌خواند تا رمز عبور در کد نوشته نشود.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME || "admin";
  const password = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`ادمین "${username}" از قبل وجود دارد. کاری انجام نشد.`);
    return;
  }

  await prisma.admin.create({
    data: {
      username,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "SUPER"
    }
  });

  console.log("========================================");
  console.log("مدیر اصلی ساخته شد:");
  console.log("نام کاربری:", username);
  console.log("رمز عبور:", password);
  console.log("حتماً بعد از اولین ورود رمز را عوض کنید.");
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
