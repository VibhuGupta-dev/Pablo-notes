import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = "evaluator@peblo.com"
  
  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    const hashedPassword = await bcrypt.hash("password123", 10)
    user = await prisma.user.create({
      data: {
        name: "Peblo Evaluator",
        email,
        password: hashedPassword,
      }
    })
    console.log("Created user:", user.email)
  } else {
    console.log("User already exists:", user.email)
  }

  // Create some dummy notes
  const note1 = await prisma.note.create({
    data: {
      title: "Welcome to Peblo Notes! 👋",
      content: `# Getting Started\n\nWelcome to your new AI-powered workspace! Here are some things you can do:\n\n1. **Write Markdown:** Use standard markdown to format your text.\n2. **Generate AI Insights:** Press \`Cmd/Ctrl + /\` to generate a summary and action items.\n3. **Keyboard Shortcuts:** Try \`Cmd/Ctrl + N\` for a new note, or \`Cmd/Ctrl + F\` to search.\n4. **Public Sharing:** Click the share button to generate a public link.\n\n> "The faintest ink is more powerful than the strongest memory."\n\n### Code Example\n\`\`\`javascript\nfunction helloWorld() {\n  console.log("Welcome to Peblo!");\n}\n\`\`\``,
      tags: JSON.stringify(["onboarding", "guide"]),
      userId: user.id,
      summary: "A brief guide on how to use Peblo Notes features including Markdown, AI insights, and keyboard shortcuts.",
      actionItems: JSON.stringify(["Try out markdown formatting", "Test AI insights generation", "Use a keyboard shortcut"]),
      isPublic: false
    }
  })

  const note2 = await prisma.note.create({
    data: {
      title: "Q3 Product Roadmap",
      content: `## Goals for Q3\n\nOur primary objective is to improve user retention by 15%.\n\n### Key Initiatives\n- [x] Launch the new dashboard UI.\n- [ ] Integrate deep analytics tracking.\n- [ ] Ship the real-time collaboration beta.\n\nWe need to ensure the engineering team is aligned on the architecture for the new WebSocket infrastructure before sprint 3.`,
      tags: JSON.stringify(["product", "planning", "q3"]),
      userId: user.id,
      summary: "Q3 roadmap focusing on increasing user retention by 15% through a new dashboard, analytics, and real-time collaboration features.",
      actionItems: JSON.stringify(["Align engineering team on WebSocket architecture before sprint 3"]),
      isPublic: true,
      shareId: "q3-roadmap-public"
    }
  })

  const note3 = await prisma.note.create({
    data: {
      title: "Meeting Notes: Design Sync",
      content: `**Attendees:** Alex, Sarah, Mike\n**Date:** Oct 15th\n\nDiscussed the new dark mode color palette. We agreed to stick with deep blacks (\`#050505\`) and use violet as the primary accent color.\n\nSarah will prepare the Figma mockups by Friday. Mike needs to review the accessibility contrast ratios.`,
      tags: JSON.stringify(["meeting", "design"]),
      userId: user.id,
      summary: "Design sync meeting notes deciding on a dark mode palette with a violet accent.",
      actionItems: JSON.stringify(["Sarah to prepare Figma mockups by Friday", "Mike to review accessibility contrast ratios"]),
      isPublic: false
    }
  })

  console.log("Created dummy notes!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
