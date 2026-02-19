import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "es", name: "Spanish", nativeName: "Espa\u00f1ol", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "fr", name: "French", nativeName: "Fran\u00e7ais", flag: "\ud83c\uddeb\ud83c\uddf7" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "\ud83c\udde9\ud83c\uddea" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "\ud83c\uddee\ud83c\uddf9" },
  { code: "pt", name: "Portuguese", nativeName: "Portugu\u00eas", flag: "\ud83c\uddf5\ud83c\uddf9" },
  { code: "zh", name: "Chinese", nativeName: "\u4e2d\u6587", flag: "\ud83c\udde8\ud83c\uddf3" },
  { code: "ja", name: "Japanese", nativeName: "\u65e5\u672c\u8a9e", flag: "\ud83c\uddef\ud83c\uddf5" },
  { code: "ko", name: "Korean", nativeName: "\ud55c\uad6d\uc5b4", flag: "\ud83c\uddf0\ud83c\uddf7" },
  { code: "ar", name: "Arabic", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\ud83c\uddf8\ud83c\udde6" },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "ru", name: "Russian", nativeName: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "\ud83c\uddf7\ud83c\uddfa" },
  { code: "tr", name: "Turkish", nativeName: "T\u00fcrk\u00e7e", flag: "\ud83c\uddf9\ud83c\uddf7" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "\ud83c\uddf3\ud83c\uddf1" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "\ud83c\uddf5\ud83c\uddf1" },
  { code: "ro", name: "Romanian", nativeName: "Rom\u00e2n\u0103", flag: "\ud83c\uddf7\ud83c\uddf4" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "\ud83c\uddf8\ud83c\uddea" },
  { code: "vi", name: "Vietnamese", nativeName: "Ti\u1ebfng Vi\u1ec7t", flag: "\ud83c\uddfb\ud83c\uddf3" },
  { code: "th", name: "Thai", nativeName: "\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22", flag: "\ud83c\uddf9\ud83c\udded" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "\ud83c\uddee\ud83c\udde9" },
];

async function main() {
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang,
    });
  }
  console.log(`Seeded ${languages.length} languages`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
