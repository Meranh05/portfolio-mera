import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const message = await prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
            },
        })
        return NextResponse.json(message)
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, read } = await request.json()
        const message = await prisma.contactMessage.update({
            where: { id },
            data: { read },
        })
        return NextResponse.json(message)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        await prisma.contactMessage.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
    }
}
