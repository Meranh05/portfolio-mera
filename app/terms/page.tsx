"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Copyright, Handshake, Calendar } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const sections = [
    {
      icon: CheckCircle,
      title: "Điều khoản sử dụng",
      content: `Khi truy cập và sử dụng website này, bạn đồng ý:
      • Sử dụng website cho mục đích hợp pháp
      • Không sao chép, phân phối nội dung mà không có sự cho phép
      • Không can thiệp vào hoạt động bình thường của website
      • Cung cấp thông tin chính xác khi sử dụng form liên hệ`,
    },
    {
      icon: Copyright,
      title: "Quyền sở hữu trí tuệ",
      content: `Tất cả nội dung trên website này bao gồm:
      • Thiết kế, layout và giao diện người dùng
      • Văn bản, hình ảnh và đồ họa
      • Mã nguồn và các thành phần kỹ thuật
      đều thuộc quyền sở hữu của DevProfile và được bảo vệ bởi luật bản quyền.`,
    },
    {
      icon: Handshake,
      title: "Dịch vụ và hợp tác",
      content: `Các dịch vụ được đề cập trên website:
      • Chỉ mang tính chất giới thiệu và tham khảo
      • Chi tiết cụ thể sẽ được thảo luận và thống nhất riêng
      • Giá cả và phạm vi công việc có thể thay đổi theo dự án
      • Mọi thỏa thuận hợp tác sẽ được ký kết bằng văn bản`,
    },
    {
      icon: AlertTriangle,
      title: "Giới hạn trách nhiệm",
      content: `DevProfile không chịu trách nhiệm cho:
      • Thiệt hại trực tiếp hoặc gián tiếp từ việc sử dụng website
      • Gián đoạn dịch vụ do bảo trì hoặc sự cố kỹ thuật
      • Nội dung từ các website bên thứ ba được liên kết
      • Mất mát dữ liệu do lỗi của người dùng`,
    },
    {
      icon: Scale,
      title: "Luật áp dụng",
      content: `Các điều khoản này được điều chỉnh bởi:
      • Pháp luật Việt Nam
      • Mọi tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam
      • Ngôn ngữ chính thức của điều khoản là tiếng Việt`,
    },
    {
      icon: FileText,
      title: "Thay đổi điều khoản",
      content: `DevProfile có quyền:
      • Cập nhật điều khoản bất kỳ lúc nào
      • Thông báo thay đổi qua website
      • Các thay đổi có hiệu lực ngay khi được đăng tải
      Khuyến khích bạn kiểm tra trang này thường xuyên.`,
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
                  <Scale className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Điều khoản dịch vụ</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Cập nhật lần cuối: 01/01/2026</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Vui lòng đọc kỹ các điều khoản dịch vụ dưới đây trước khi sử dụng website. Việc tiếp tục truy cập và sử
                dụng website đồng nghĩa với việc bạn chấp nhận các điều khoản này.
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

              <FadeIn delay={0.9}>
                <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-center text-muted-foreground">
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng{" "}
                    <Link href="/#contact" className="text-primary hover:underline">
                      liên hệ với chúng tôi
                    </Link>
                    .
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
