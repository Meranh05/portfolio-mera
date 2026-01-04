"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, FileText, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Thu thập thông tin",
      content: `Chúng tôi thu thập thông tin bạn cung cấp trực tiếp, bao gồm:
      • Tên và địa chỉ email khi bạn gửi form liên hệ
      • Thông tin về dự án hoặc yêu cầu hợp tác
      • Các thông tin kỹ thuật như địa chỉ IP, loại trình duyệt khi bạn truy cập website`,
    },
    {
      icon: Shield,
      title: "Sử dụng thông tin",
      content: `Thông tin của bạn được sử dụng để:
      • Phản hồi các yêu cầu liên hệ và hỗ trợ
      • Cải thiện trải nghiệm người dùng trên website
      • Gửi thông tin về các dự án hoặc cơ hội hợp tác (nếu bạn đồng ý)
      • Phân tích và cải thiện hiệu suất website`,
    },
    {
      icon: Lock,
      title: "Bảo mật thông tin",
      content: `Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:
      • Sử dụng mã hóa SSL/TLS cho mọi dữ liệu truyền tải
      • Không chia sẻ thông tin cá nhân với bên thứ ba
      • Lưu trữ dữ liệu trên các server bảo mật
      • Thường xuyên cập nhật các biện pháp bảo mật`,
    },
    {
      icon: FileText,
      title: "Cookie và công nghệ theo dõi",
      content: `Website sử dụng cookie để:
      • Ghi nhớ tùy chọn giao diện (dark/light mode)
      • Phân tích lưu lượng truy cập qua Vercel Analytics
      • Cải thiện hiệu suất tải trang
      Bạn có thể tắt cookie trong cài đặt trình duyệt.`,
    },
    {
      icon: Mail,
      title: "Liên hệ về quyền riêng tư",
      content: `Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ:
      • Email: privacy@devprofile.com
      • Hoặc sử dụng form liên hệ trên website
      Chúng tôi sẽ phản hồi trong vòng 48 giờ làm việc.`,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <Link href="/">
              <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Chính sách bảo mật</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Cập nhật lần cuối: 01/01/2026</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử
                dụng và bảo vệ thông tin cá nhân khi bạn truy cập website portfolio này.
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <FadeIn key={index} delay={0.2 + index * 0.1}>
                    <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <section.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn delay={0.8}>
                <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-center text-muted-foreground">
                    Bằng việc tiếp tục sử dụng website, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
                  </p>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
