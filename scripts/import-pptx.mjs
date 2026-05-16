/**
 * Script de importação de músicas de arquivos PPTX
 *
 * Uso:
 *   node scripts/import-pptx.mjs "caminho/para/pasta/com/pptx"
 *
 * Cria Suggestions com status PENDING para cada arquivo PPTX encontrado.
 * O nome do arquivo (sem extensão) é usado como título.
 * Todo texto dos slides é concatenado como letra.
 */

import fs from "fs"
import path from "path"
import { PrismaClient } from "../app/generated/prisma/client.js"

const prisma = new PrismaClient({} as any)

const args = process.argv.slice(2)
const folderPath = args[0]

if (!folderPath) {
  console.error("Uso: node scripts/import-pptx.mjs <caminho-da-pasta>")
  process.exit(1)
}

if (!fs.existsSync(folderPath)) {
  console.error(`Pasta não encontrada: ${folderPath}`)
  process.exit(1)
}

async function extractTextFromPPTX(filePath) {
  const JSZip = (await import("jszip")).default
  const data = fs.readFileSync(filePath)
  const zip = await JSZip.loadAsync(data)
  const slideFiles = Object.keys(zip.files)
    .filter((name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"))
    .sort()

  const textParts = []
  for (const slideFile of slideFiles) {
    const content = await zip.files[slideFile].async("string")
    const texts = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || []
    const slideText = texts
      .map((t) => t.replace(/<[^>]+>/g, ""))
      .join(" ")
      .trim()
    if (slideText) {
      textParts.push(slideText)
    }
  }
  return textParts.join("\n\n")
}

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  if (!admin) {
    console.error("Nenhum administrador encontrado. Execute o seed primeiro.")
    process.exit(1)
  }
  console.log(`Usando admin: ${admin.email}`)

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => f.toLowerCase().endsWith(".pptx"))
    .sort()

  console.log(`\nEncontrados ${files.length} arquivos PPTX\n`)

  let imported = 0
  let errors = 0

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const title = path.basename(file, ".pptx").replace(/[_-]/g, " ").trim()

    try {
      const lyrics = await extractTextFromPPTX(filePath)

      await prisma.suggestion.create({
        data: {
          title,
          author: "Importado",
          lyrics,
          status: "PENDING",
          suggestedBy: admin.id,
          note: "Importado automaticamente de arquivo PPTX",
        },
      })
      console.log(`  ✓ ${title}`)
      imported++
    } catch (err) {
      console.error(`  ✗ ${title}: ${err.message}`)
      errors++
    }
  }

  console.log(`\n✅ Importação concluída: ${imported} importadas, ${errors} erros`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
