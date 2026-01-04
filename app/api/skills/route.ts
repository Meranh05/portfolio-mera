import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const skills = await prisma.skill.findMany()
        return NextResponse.json(skills)
    } catch (error) {
        console.error("GET /api/skills error:", error)
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { id, ...skillData } = data

        const skill = await prisma.skill.upsert({
            where: { id: id || "new" },
            update: skillData,
            create: skillData,
        })

        return NextResponse.json(skill)
    } catch (error) {
        return NextResponse.json({ error: "Failed to save skill" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        await prisma.skill.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
    }
}
