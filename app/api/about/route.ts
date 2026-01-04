import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const about = await prisma.about.findUnique({
            where: { id: 1 },
            include: { socials: true },
        })

        if (!about) {
            // Return default data if not found
            return NextResponse.json({
                name: "Mera",
                title: "Full Stack Developer",
                subtitle: "& UI/UX Designer",
                bio: "Chào mừng đến với portfolio của tôi. Hãy thêm thông tin từ trang Admin.",
                quote: "Code là nghệ thuật, và tôi là người nghệ sĩ.",
                yearsExperience: 0,
                avatar: "",
                email: "",
                phone: "",
                location: "",
                github: "",
                linkedin: "",
                twitter: "",
                socials: [],
                siteName: "Mera",
            })
        }

        return NextResponse.json(about)
    } catch (error) {
        console.error("Failed to fetch about info:", error)
        return NextResponse.json({ error: "Failed to fetch about info" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { socials, id, ...aboutData } = data

        const updatedAbout = await prisma.about.upsert({
            where: { id: 1 },
            update: {
                ...aboutData,
                socials: {
                    deleteMany: {},
                    create: socials?.map((s: any) => ({
                        platform: s.platform,
                        href: s.href,
                    })),
                },
            },
            create: {
                ...aboutData,
                id: 1,
                socials: {
                    create: socials?.map((s: any) => ({
                        platform: s.platform,
                        href: s.href,
                    })),
                },
            },
            include: { socials: true },
        })

        return NextResponse.json(updatedAbout)
    } catch (error) {
        console.error("Failed to save about info:", error)
        return NextResponse.json({ error: "Failed to save about info" }, { status: 500 })
    }
}
