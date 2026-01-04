import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { current: "desc" },
        })

        const parsedExperiences = experiences.map((e: any) => ({
            ...e,
            description: JSON.parse(e.description || "[]"),
            techs: e.techs ? e.techs.split(",") : [],
        }))

        return NextResponse.json(parsedExperiences)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { id, description, techs, ...expData } = data

        const experience = await prisma.experience.upsert({
            where: { id: id || "new" },
            update: {
                ...expData,
                description: JSON.stringify(description || []),
                techs: Array.isArray(techs) ? techs.join(",") : techs,
            },
            create: {
                ...expData,
                description: JSON.stringify(description || []),
                techs: Array.isArray(techs) ? techs.join(",") : techs,
            },
        })

        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: "Failed to save experience" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        await prisma.experience.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
    }
}
