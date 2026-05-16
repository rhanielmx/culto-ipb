import "dotenv/config"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

const categoryNames = [
  "Abertura",
  "Ceia",
  "Ritmada",
  "Contrição",
  "Oferta",
  "Hinário",
  "Louvor",
  "Especial",
] as const

interface SongSeed {
  title: string
  author: string
  lyrics: string
  tone?: string
  hymnNumber?: string
  bibleReference?: string
  observation?: string
  categories: string[]
  videos?: { url: string; label: string }[]
}

const songs: SongSeed[] = [
  {
    title: "Santo, Santo, Santo",
    author: "John Bacchus Dykes / Reginald Heber",
    lyrics:
      "Santo, Santo, Santo, Deus Onipotente\nCedo de manhã cantaremos Teu louvor\nSanto, Santo, Santo, Deus Jeová Triúno\nÓ Deus de amor, ó Deus de amor\n\nSanto, Santo, Santo, todos os remidos\nJuntos com os anjos Te adoram com fervor\nSanto, Santo, Santo, Deus Jeová Triúno\nÓ Deus de amor, ó Deus de amor\n\nTu és glorioso, Tu és poderoso\nSó Tu és digno de todo louvor\nDiante de Ti nós nos prostramos\nSanto, Santo, Santo, Deus de amor",
    tone: "Eb",
    hymnNumber: "1",
    bibleReference: "Isaías 6.3",
    observation: "Hino tradicional. A melodia original de Nicaea é a mais utilizada no Brasil.",
    categories: ["Hinário", "Abertura"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Coral CCB - Santo, Santo, Santo" },
    ],
  },
  {
    title: "Sublime Graça",
    author: "John Newton / Edwin O. Excell",
    lyrics:
      "Sublime graça do Senhor\nQue a um infeliz salvou\nPerdido estava e me encontrou\nCego, mas eu vejo agora\n\nFoi graça que me libertou\nE minhas cadeias quebrou\nFoi graça que me fez andar\nE pela fé me sustentou\n\nA graça me ensinou a temer\nE minhas dúvidas dissipou\nOh, quão precioso foi o momento\nEm que nela eu confiei\n\nPor mil anos eu cantarei\nDo amor que me salvou\nE na eternidade louvarei\nA graça que me resgatou",
    tone: "G",
    hymnNumber: "312",
    bibleReference: "Efésios 2.8-9",
    observation: "Versão com 4 estrofes, conforme arranjo do Coral Reverência.",
    categories: ["Hinário", "Ceia"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Fernanda Brum - Sublime Graça (playback)" },
    ],
  },
  {
    title: "Grande é o Senhor",
    author: "Michael W. Smith / Chris Tomlin",
    lyrics:
      "Grande é o Senhor e mui digno de louvor\nNa cidade do nosso Deus, Seu santo monte\nAlegria de toda a Terra\n\nGrande é o Senhor e mui digno de louvor\nNa cidade do nosso Deus, Seu santo monte\nAlegria de toda a Terra\n\nEle é a nossa paz, Ele é a nossa luz\nEle é a nossa salvação\nNele confiaremos, não vacilaremos\nPorque Ele é o Deus de Israel",
    tone: "C",
    categories: ["Abertura", "Louvor"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Diante do Trono - Grande é o Senhor" },
    ],
  },
  {
    title: "Ao Único",
    author: "Ana Paula Valadão",
    lyrics:
      "Ao Único que é digno de receber\nA honra e a glória, a força e o poder\nAo Único que é digno de receber\nA honra e a glória, a força e o poder\n\nA Ele, a Ele, seja toda a glória\nA Ele, a Ele, seja todo o louvor\n\nQue os céus proclamam\nE a terra confessa\nQue só Tu és Santo\nSó Tu és Deus",
    tone: "D",
    categories: ["Oferta", "Especial"],
  },
  {
    title: "Vem, Espírito Vem",
    author: "David Butterly / Daniel Souza",
    lyrics:
      "Vem, Espírito vem\nEnche-nos de Ti\nVem, Espírito vem\nQueremos Te sentir\n\nFlua em nós como rio\nComo fogo abrasador\nVem, Espírito vem\nEnche-nos de amor\n\nQuebra as barreiras\nDerruba os muros\nRestaura os corações\nCom Teu poder",
    tone: "E",
    categories: ["Contrição"],
  },
  {
    title: "Nosso Deus é Soberano",
    author: "Associação Boas Novas",
    lyrics:
      "Nosso Deus é soberano\nSobre tudo e todos reina\nSeu poder é infinito\nSua glória é sem medida\n\nEle faz o impossível\nEle move as montanhas\nSeu amor é incondicional\nSua graça é imerecida\n\nNosso Deus é soberano\nNele podemos confiar",
    tone: "F",
    bibleReference: "Salmos 115.3",
    categories: ["Abertura", "Louvor"],
  },
  {
    title: "Lágrimas de Amor",
    author: "Comunidade Evangélica",
    lyrics:
      "Tu enxugas minhas lágrimas\nE acalmas meu coração\nNo Teu colo encontro paz\nNa Tua presença, restauração\n\nMesmo quando eu não mereço\nTeu amor me alcança\nTuas mãos me sustentam\nE me dão esperança\n\nOh, amor que não se acaba\nGraça que me refaz\nEm Teus braços descanso\nPara sempre, nada mais",
    tone: "G",
    bibleReference: "Salmos 56.8",
    categories: ["Contrição"],
  },
  {
    title: "Teu Santo Nome",
    author: "Ministério Koinonya",
    lyrics:
      "Teu Santo nome exaltarei\nPara sempre louvarei\nPois Tu és bom, Teu amor é eternal\nTua fidelidade é real\n\nTeu Santo nome é acima de todo nome\nTeu Santo nome é poder e autoridade\nDiante de Ti todo joelho se dobrará\nTeu Santo nome, Senhor",
    tone: "C",
    bibleReference: "Filipenses 2.9-11",
    categories: ["Louvor", "Especial"],
  },
  {
    title: "Aleluia, Santo",
    author: "David Butterly",
    lyrics:
      "Aleluia, Santo, Santo\nSenhor Deus Todo-Poderoso\nQue era, que é, que há de vir\nTe adoramos, Senhor\n\nDigno és de receber\nA honra e a glória\nA força e o poder\nPara sempre, amém\n\nAleluia, Aleluia\nSanto é o Senhor",
    tone: "D",
    bibleReference: "Apocalipse 4.8",
    categories: ["Hinário", "Abertura"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Playback - Aleluia, Santo" },
    ],
  },
  {
    title: "Pão da Vida",
    author: "Hinário Presbiteriano",
    lyrics:
      "Pão da vida, verdadeiro\nCristo, o Cordeiro de Deus\nQue Seu corpo entregou\nE Seu sangue derramou\n\nNesta Ceia celebramos\nTua morte, ó Senhor\nAté que voltes, proclamamos\nTeu imenso amor\n\nVinho e pão nos lembram\nTeu sacrifício na cruz\nPão da vida, luz do mundo\nNos sustentas com Tua luz",
    tone: "E",
    hymnNumber: "87",
    bibleReference: "João 6.35",
    observation: "Hino presbiteriano tradicional, tocado durante a Ceia.",
    categories: ["Ceia"],
  },
  {
    title: "Diante do Trono",
    author: "Ana Paula Valadão",
    lyrics:
      "Diante do Trono estamos\nPara Te adorar\nCom corações abertos\nViemos Te louvar\n\nTu és digno de honra\nDigno de louvor\nDiante do Teu trono\nNos rendemos, Senhor\n\nRei dos reis, Senhor dos senhores\nTe exaltamos\nTe adoramos",
    tone: "G",
    categories: ["Louvor"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Diante do Trono - Diante do Trono" },
    ],
  },
  {
    title: "Oferta de Amor",
    author: "Soraya Moraes",
    lyrics:
      "Recebe, Senhor, esta oferta\nComo expressão do meu amor\nO que tenho e o que sou\nEntrego a Ti, meu Senhor\n\nNão por obrigação, mas por gratidão\nPelo que fizeste em mim\nMinha vida é Tua altar\nMinha oferta é Te adorar\n\nRecebe em Tuas mãos\nEste ato de devoção\nPois tudo que tenho vem de Ti\nE pra Ti retorna, Senhor",
    tone: "A",
    bibleReference: "2 Coríntios 9.7",
    categories: ["Oferta"],
  },
  {
    title: "A Benção",
    author: "Elevation Worship / Kari Jobe",
    lyrics:
      "Que o Senhor te abençoe e te guarde\nQue o Senhor sobre ti resplandeça\nE tenha misericórdia de ti\nQue o Senhor levante o rosto sobre ti\nE te dê a paz\n\nQue a graça do Senhor\nSobre ti esteja\nEm todo o teu caminhar\nE onde quer que fores\nA Sua paz te acompanhará",
    tone: "Eb",
    bibleReference: "Números 6.24-26",
    categories: ["Especial", "Louvor"],
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "Elevation Worship - A Benção" },
    ],
  },
  {
    title: "Descansa",
    author: "Comunidade Evangélica de Louvor",
    lyrics:
      "Descansa em Deus, ó minha alma\nPois dEle vem a minha esperança\nEle é o meu refúgio e fortaleza\nMeu Deus, em quem confiarei\n\nQuando o medo me cercar\nQuando a dor me alcançar\nEu olharei para o Autor da fé\nQue sustenta o meu viver\n\nDescansa, descansa\nSossega em Teu amor",
    tone: "F",
    bibleReference: "Salmos 62.5-6",
    categories: ["Contrição"],
  },
  {
    title: "Cristo Vive em Mim",
    author: "André Aquino / Vineyard",
    lyrics:
      "Já não sou eu quem vive\nMas Cristo vive em mim\nVivo pela fé no Filho de Deus\nQue me amou e Se entregou por mim\n\nMinha vida escondida está\nEm Cristo, junto a Deus\nE quando Ele aparecer\nCom Ele brilharei\n\nRessuscitei com Cristo\nCom Ele viverei\nPois fui crucificado\nE com Cristo ressurgi",
    tone: "D",
    bibleReference: "Gálatas 2.20",
    categories: ["Ritmada"],
  },
  {
    title: "Meu Refúgio",
    author: "Fernanda Brum",
    lyrics:
      "Tu és o meu refúgio\nMinha fortaleza\nMeu Deus, em quem confio\nTu és a minha salvação\n\nNo esconderijo do Altíssimo\nDescansarei em Ti\nDebaixo das Tuas asas\nEstou seguro, Senhor\n\nNão temerei o mal\nPois Tu estás comigo\nTeu cajado me guia\nTua mão me sustenta",
    tone: "C",
    bibleReference: "Salmos 91.1-2",
    categories: ["Louvor"],
  },
  {
    title: "Ao Que Está Sentado",
    author: "David Funk",
    lyrics:
      "Ao que está sentado no trono\nE ao Cordeiro de Deus\nSeja o louvor, a honra e a glória\nPara sempre, amém\n\nToda criatura no céu e na terra\nConfessa que Cristo é o Senhor\nE juntos cantamos em alta voz\nDigno és, Senhor\n\nAo que está sentado no trono\nSeja o poder e a majestade\nPelos séculos dos séculos\nReinarás, ó Deus",
    tone: "Bb",
    bibleReference: "Apocalipse 5.13",
    categories: ["Especial"],
  },
  {
    title: "Santo É o Senhor",
    author: "Ministério Avivah",
    lyrics:
      "Santo é o Senhor, Deus Todo-Poderoso\nQue era e que há de vir\nSanto é o Senhor\n\nA Terra está cheia da Tua glória\nOs céus proclamam Tua majestade\nSanto, Santo, Santo\nÉ o Senhor dos Exércitos\n\nEnchemos este lugar\nCom o Teu louvor\nTe damos glória\nTe damos honra",
    tone: "Eb",
    bibleReference: "Isaías 6.3",
    categories: ["Abertura"],
  },
  {
    title: "Nunca Pare de Louvar",
    author: "SHEKINAH / Jotta A",
    lyrics:
      "Nunca pare de louvar\nMesmo que a batalha venha\nNunca pare de adorar\nPois a vitória certamente chegará\n\nO Deus que nunca perdeu uma batalha\nEstá contigo\nEle é fiel para cumprir\nTodas as Suas promessas\n\nLouva, ó minha alma\nAo Deus da tua salvação\nPois Ele é digno de todo louvor\nE toda adoração",
    tone: "G",
    bibleReference: "Salmos 103.1-2",
    categories: ["Ritmada", "Louvor"],
  },
  {
    title: "Tua Presença",
    author: "Ministério Koinonya",
    lyrics:
      "Tua presença é o meu sustento\nÉ o ar que respiro\nA razão do meu viver\nTua presença é o que anseio\nMais que o ouro e a prata\nMais que tudo neste mundo\n\nLeva-me à Tua presença\nQuero ver Teu rosto, Senhor\nPois um dia em Teus átrios\nVale mais que mil em outro lugar\n\nTua presença me transforma\nMe renova e me refaz",
    tone: "D",
    bibleReference: "Salmos 84.10",
    categories: ["Contrição"],
  },
  {
    title: "Exaltado Seja",
    author: "David Butterly / Adhemar de Campos",
    lyrics:
      "Exaltado seja o Senhor\nQue fez os céus e a terra\nExaltado seja o Senhor\nSobre toda a Terra\n\nTeu é o reino, o poder e a glória\nPara sempre, amém\nTeu é o domínio sobre tudo que há\nSoberano és, Senhor\n\nCom tudo que há em mim\nExaltarei Teu nome\nCom todo o meu ser\nTe adorarei, Senhor",
    tone: "F",
    categories: ["Oferta"],
  },
  {
    title: "Maravilhosa Graça",
    author: "Hinário Presbiteriano / John Newton",
    lyrics:
      "Maravilhosa graça\nQue ao mundo se manifestou\nPecadores redimindo\nA todos que em Cristo creu\n\nGraça que excede o pecado\nAmor que vence a dor\nEm Cristo fomos salvos\nPor Seu imenso amor\n\nJá não há condenação\nAos que estão em Cristo Jesus\nPela graça somos salvos\nMediante a fé na luz",
    tone: "G",
    hymnNumber: "215",
    bibleReference: "Efésios 2.4-5",
    categories: ["Hinário"],
  },
]

interface SuggestionSeed {
  type: "NEW_SONG" | "EDIT_EXISTING"
  title: string
  author: string
  lyrics: string
  tone?: string
  hymnNumber?: string
  bibleReference?: string
  note?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  suggestedByEmail: string
  reviewedByEmail?: string
  reviewNote?: string
}

const suggestions: SuggestionSeed[] = [
  {
    type: "NEW_SONG",
    title: "Te Agradeço",
    author: "Membro da Igreja",
    lyrics:
      "Te agradeço, Senhor\nPelo Teu imenso amor\nQue me alcançou\nE me transformou\n\nNão há outro Deus como Tu\nQue cuida de mim\nTe agradeço, Senhor\nPor Teu amor sem fim",
    tone: "F",
    bibleReference: "Salmos 100.4",
    note: "Música composta pela autoria para o grupo jovem. Ainda não tem arranjo definitivo.",
    status: "PENDING",
    suggestedByEmail: "membro6@ipb.com",
  },
  {
    type: "NEW_SONG",
    title: "Formoso és",
    author: "Vinicius Zolin / Lígia Rosário",
    lyrics:
      "Formoso és, Tu és o meu prazer\nMinha alma anseia por Ti, Senhor\nNo Teu amor encontrei a paz\nEm Teus braços quero viver\n\nTu és a fonte de todo bem\nMinha esperança está em Ti\nFormoso és, não há outro igual\nTeu amor me satisfaz",
    tone: "A",
    bibleReference: "Salmos 27.4",
    note: "Música já executada no culto jovem. Sugiro incluir no repertório da Ceia.",
    status: "APPROVED",
    suggestedByEmail: "membro1@ipb.com",
    reviewedByEmail: "revisor2@ipb.com",
    reviewNote: "Letra aprovada. Ajustar métrica na segunda estrofe para melhor entonação.",
  },
  {
    type: "NEW_SONG",
    title: "Céus e Terra",
    author: "Comunidade Cristã",
    lyrics:
      "Os céus proclamam a glória de Deus\nE o firmamento anuncia\nAs obras das Suas mãos\n\nDia após dia derrama saber\nE as noites revelam\nO Seu infinito poder",
    tone: "Bb",
    note: "Música enviada pela Comunidade Cristã de Campinas.",
    status: "REJECTED",
    suggestedByEmail: "membro5@ipb.com",
    reviewedByEmail: "revisor1@ipb.com",
    reviewNote: "Letra muito curta e sem desenvolvimento teológico adequado. Sugiro buscar versão mais completa ou outra música com mesma temática.",
  },
  {
    type: "EDIT_EXISTING",
    title: "Grande é o Senhor",
    author: "Michael W. Smith / Chris Tomlin",
    lyrics:
      "Grande é o Senhor e mui digno de louvor\nNa cidade do nosso Deus, Seu santo monte\nAlegria de toda a Terra\n\nGrande é o Senhor e mui digno de louvor\nNa cidade do nosso Deus, Seu santo monte\nAlegria de toda a Terra\n\nEle é a nossa paz, Ele é a nossa luz\nEle é a nossa salvação\nNele confiaremos, não vacilaremos\nPorque Ele é o Senhor, o Deus de Israel\n\nPoderoso é o Senhor, digno de todo louvor\nExaltado é o Senhor, digno de todo louvor",
    tone: "C",
    bibleReference: "Salmos 48.1",
    note: "Sugiro incluir a ponte 'Poderoso é o Senhor' que é cantada nas versões mais recentes. Também corrigi a referência bíblica.",
    status: "PENDING",
    suggestedByEmail: "membro4@ipb.com",
  },
  {
    type: "EDIT_EXISTING",
    title: "Santo, Santo, Santo",
    author: "John Bacchus Dykes / Reginald Heber",
    lyrics:
      "Santo, Santo, Santo, Deus Onipotente\nCedo de manhã cantaremos Teu louvor\nSanto, Santo, Santo, Deus Jeová Triúno\nÓ Deus de amor, ó Deus de amor\n\nSanto, Santo, Santo, todos os remidos\nJuntos com os anjos Te adoram com fervor\nSanto, Santo, Santo, Deus Jeová Triúno\nÓ Deus de amor, ó Deus de amor\n\nTu és glorioso, Tu és poderoso\nSó Tu és digno de todo louvor\nDiante de Ti nós nos prostramos\nSanto, Santo, Santo, Deus de amor\n\nAo Cordeiro que foi morto\nSeja a glória e o poder\nPelos séculos dos séculos\nSanto, Santo, Santo é o Senhor",
    tone: "Eb",
    hymnNumber: "1",
    note: "Sugiro incluir a quarta estrofe 'Ao Cordeiro que foi morto' baseada em Apocalipse 5. Esta estrofe é frequentemente usada em cultos de Ceia.",
    status: "APPROVED",
    suggestedByEmail: "membro2@ipb.com",
    reviewedByEmail: "revisor3@ipb.com",
    reviewNote: "Inclusão aprovada. A estrofe adicional está em conformidade com a teologia reformada e o texto de Apocalipse 5. A letra original do hinário será preservada como originalLyrics para referência.",
  },
] as const

const reviewers = [
  { name: "Revisor 1", email: "revisor1@ipb.com" },
  { name: "Revisor 2", email: "revisor2@ipb.com" },
  { name: "Revisor 3", email: "revisor3@ipb.com" },
]

const members = [
  { name: "Membro 1", email: "membro1@ipb.com" },
  { name: "Membro 2", email: "membro2@ipb.com" },
  { name: "Membro 3", email: "membro3@ipb.com" },
  { name: "Membro 4", email: "membro4@ipb.com" },
  { name: "Membro 5", email: "membro5@ipb.com" },
  { name: "Membro 6", email: "membro6@ipb.com" },
]

async function main() {
  console.log("🌱 Seeding database...\n")

  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS unaccent`)
  console.log("  ✓ Extensão unaccent habilitada")

  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.suggestion.deleteMany()
  await prisma.songVideo.deleteMany()
  await prisma.songCategory.deleteMany()
  await prisma.song.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log("  ✓ Banco limpo")

  const passwordHash = await bcrypt.hash("123456", 12)

  const admin = await prisma.user.create({
    data: { name: "Admin", email: "admin@ipb.com", password: passwordHash, role: "ADMIN" },
  })
  console.log(`  ✓ Admin:       admin@ipb.com`)

  const userByEmail: Record<string, string> = {}

  for (const r of reviewers) {
    const user = await prisma.user.create({
      data: { name: r.name, email: r.email, password: passwordHash, role: "REVIEWER" },
    })
    userByEmail[r.email] = user.id
    console.log(`  ✓ Revisor:     ${r.email}`)
  }

  for (const m of members) {
    const user = await prisma.user.create({
      data: { name: m.name, email: m.email, password: passwordHash, role: "MEMBER" },
    })
    userByEmail[m.email] = user.id
    console.log(`  ✓ Membro:      ${m.email}`)
  }

  const categoryMap: Record<string, string> = {}
  for (const name of categoryNames) {
    const cat = await prisma.category.create({ data: { name } })
    categoryMap[name] = cat.id
  }
  console.log(`  ✓ ${categoryNames.length} categorias criadas`)

  for (const s of songs) {
    await prisma.song.create({
      data: {
        title: s.title,
        author: s.author,
        lyrics: s.lyrics,
        tone: s.tone,
        hymnNumber: s.hymnNumber,
        bibleReference: s.bibleReference,
        observation: s.observation,
        status: "PUBLISHED",
        createdBy: admin.id,
        categories: {
          create: s.categories.map((name) => ({ categoryId: categoryMap[name] })),
        },
        videos: s.videos
          ? { create: s.videos.map((v) => ({ url: v.url, label: v.label })) }
          : undefined,
      },
    })
    console.log(`  ✓ Música:      ${s.title}`)
  }

  for (const sug of suggestions) {
    const song = sug.type === "EDIT_EXISTING"
      ? await prisma.song.findFirst({ where: { title: sug.title } })
      : null

    await prisma.suggestion.create({
      data: {
        type: sug.type,
        songId: song?.id,
        title: sug.title,
        author: sug.author,
        lyrics: sug.lyrics,
        tone: sug.tone,
        bibleReference: sug.bibleReference,
        note: sug.note,
        status: sug.status,
        suggestedBy: userByEmail[sug.suggestedByEmail],
        reviewedBy: sug.reviewedByEmail ? userByEmail[sug.reviewedByEmail] : undefined,
        reviewedAt: sug.reviewedByEmail ? new Date() : undefined,
        reviewNote: sug.reviewNote ?? undefined,
      },
    })

    const label = sug.status === "PENDING" ? "⏳" : sug.status === "APPROVED" ? "✅" : "❌"
    const typeLabel = sug.type === "EDIT_EXISTING" ? " (edição)" : ""
    console.log(`  ${label} Sugestão: ${sug.title} [${sug.status}]${typeLabel}`)
  }

  const allUsers = await prisma.user.count()
  const allSongs = await prisma.song.count()
  const allSuggestions = await prisma.suggestion.count()

  console.log("\n✅ Seed concluído!")
  console.log(`\n📊 Total: ${allUsers} usuários, ${allSongs} músicas, ${allSuggestions} sugestões`)
  console.log("\n🔑 Senha padrão: 123456")
  console.log("\n📋 Admin:  admin@ipb.com")
  console.log("📋 Revisores: revisor1@ipb.com, revisor2@ipb.com, revisor3@ipb.com")
  console.log("📋 Membros:  membro1@ipb.com .. membro6@ipb.com")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
