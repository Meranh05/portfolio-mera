import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const cv = await prisma.cV.findUnique({
            where: { id: 1 },
        })
        return NextResponse.json(cv)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const cv = await prisma.cV.upsert({
            where: { id: 1 },
            update: {
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileSize: data.fileSize,
                uploadedAt: new Date(data.uploadedAt),
            },
            create: {
                id: 1,
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileSize: data.fileSize,
                uploadedAt: new Date(data.uploadedAt),
            },
        })
        return NextResponse.json(cv)
    } catch (error) {
        return NextResponse.json({ error: "Failed to save CV" }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        await prisma.cV.delete({ where: { id: 1 } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 })
    }
}
