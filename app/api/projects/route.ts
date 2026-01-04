import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        })

        // Parse tags and techs back to arrays
        const parsedProjects = projects.map((p: any) => ({
            ...p,
            tags: p.tags ? p.tags.split(",") : [],
            techs: p.techs ? p.techs.split(",") : [],
        }))

        return NextResponse.json(parsedProjects)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { id, tags, techs, ...projectData } = data

        const project = await prisma.project.upsert({
            where: { id: id || "new" },
            update: {
                ...projectData,
                tags: Array.isArray(tags) ? tags.join(",") : tags,
                techs: Array.isArray(techs) ? techs.join(",") : techs,
            },
            create: {
                ...projectData,
                tags: Array.isArray(tags) ? tags.join(",") : tags,
                techs: Array.isArray(techs) ? techs.join(",") : techs,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("Failed to save project:", error)
        return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        await prisma.project.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
