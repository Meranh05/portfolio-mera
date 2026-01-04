import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const stats = await prisma.stats.findUnique({
            where: { id: 1 },
        })
        return NextResponse.json({ views: stats?.views || 0 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}

export async function POST() {
    try {
        const stats = await prisma.stats.upsert({
            where: { id: 1 },
            update: { views: { increment: 1 } },
            create: { id: 1, views: 1 },
        })
        return NextResponse.json({ views: stats.views })
    } catch (error) {
        return NextResponse.json({ error: "Failed to increment views" }, { status: 500 })
    }
}
