import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const repos = await prisma.gitHubRepo.findMany()
        const parsedRepos = repos.map((r: any) => ({
            ...r,
            topics: r.topics ? r.topics.split(",") : [],
        }))
        return NextResponse.json(parsedRepos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { repos } = data

        // Bulk upsert or individual? SQLite handles individual better for small sets
        for (const repo of repos) {
            const { id, topics, ...repoData } = repo
            await prisma.gitHubRepo.upsert({
                where: { id },
                update: {
                    ...repoData,
                    topics: Array.isArray(topics) ? topics.join(",") : topics,
                },
                create: {
                    ...repoData,
                    id,
                    topics: Array.isArray(topics) ? topics.join(",") : topics,
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to save repos" }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, visible, featured } = await request.json()
        const repo = await prisma.gitHubRepo.update({
            where: { id },
            data: { visible, featured },
        })
        return NextResponse.json(repo)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update repo" }, { status: 500 })
    }
}
