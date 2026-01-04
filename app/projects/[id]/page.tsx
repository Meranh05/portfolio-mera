import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectDetailClient } from "@/components/ProjectDetailClient"

const projectsData: Record<string, ProjectData> = {
  "fintech-dashboard": {
    id: "fintech-dashboard",
    title: "FinTech Analytics Dashboard",
    description:
      "Một nền tảng quản lý tài chính toàn diện giúp doanh nghiệp theo dõi dòng tiền, phân tích xu hướng thị trường và quản lý danh mục đầu tư theo thời gian thực.",
    tags: ["Full Stack Web App", "2023"],
    heroImage: "/fintech-analytics-dashboard-dark-theme-financial-c.jpg",
    overview: `Dự án này được phát triển nhằm giải quyết vấn đề quản lý dữ liệu tài chính phân tán. Trước đây, người dùng phải đăng nhập vào nhiều hệ thống khác nhau để tổng hợp báo cáo. FinTech Analytics Dashboard tập trung tất cả dữ liệu vào một nơi duy nhất với giao diện trực quan.

Hệ thống sử dụng kiến trúc Microservices để đảm bảo khả năng mở rộng, với frontend được xây dựng bằng React và Tailwind CSS cho trải nghiệm người dùng mượt mà nhất. Backend xử lý hàng triệu bản ghi giao dịch trong vài giây nhờ tối ưu hóa database indexing và caching layer.`,
    features: [
      {
        icon: "chart",
        title: "Real-time Analytics",
        description: "Biểu đồ động cập nhật dữ liệu theo thời gian thực sử dụng WebSocket.",
      },
      {
        icon: "shield",
        title: "Bảo mật cấp cao",
        description: "Tích hợp xác thực 2 lớp (2FA) và mã hóa đầu cuối dữ liệu nhạy cảm.",
      },
      {
        icon: "file",
        title: "Xuất báo cáo tự động",
        description: "Tự động tạo và gửi báo cáo PDF/Excel định kỳ qua email.",
      },
      {
        icon: "moon",
        title: "Dark Mode Support",
        description: "Giao diện tối ưu cho mắt, tự động chuyển đổi theo hệ thống.",
      },
    ],
    images: [
      { src: "/fintech-mobile-interface-dark-theme.jpg", label: "Giao diện Mobile" },
      { src: "/fintech-code-structure-screenshot.jpg", label: "Cấu trúc Code" },
    ],
    techStack: {
      frontend: ["React.js", "Tailwind", "Framer"],
      backend: ["Node.js", "MongoDB"],
      devops: ["Docker", "AWS"],
    },
    projectInfo: {
      role: "Lead Developer",
      duration: "3 tháng",
      client: "FinCorp Inc.",
      status: "Hoàn thành",
    },
    links: {
      sourceCode: "https://github.com",
      liveDemo: "https://demo.com",
    },
  },
  "ai-chatbot": {
    id: "ai-chatbot",
    title: "AI Chatbot Assistant",
    description:
      "Trợ lý AI thông minh hỗ trợ khách hàng 24/7, tích hợp NLP và machine learning để hiểu và phản hồi tự nhiên.",
    tags: ["AI/ML", "2024"],
    heroImage: "/ai-chatbot-dark-theme.png",
    overview: `AI Chatbot Assistant là giải pháp hỗ trợ khách hàng tự động sử dụng công nghệ AI tiên tiến. Hệ thống có khả năng hiểu ngữ cảnh, xử lý đa ngôn ngữ và học hỏi từ các cuộc hội thoại để cải thiện chất lượng phản hồi.

Dự án tích hợp các mô hình ngôn ngữ lớn (LLM) với fine-tuning cho domain cụ thể, đảm bảo độ chính xác cao trong việc trả lời các câu hỏi chuyên môn.`,
    features: [
      {
        icon: "chart",
        title: "Natural Language Processing",
        description: "Hiểu và xử lý ngôn ngữ tự nhiên với độ chính xác cao.",
      },
      {
        icon: "shield",
        title: "Multi-language Support",
        description: "Hỗ trợ đa ngôn ngữ bao gồm Tiếng Việt, Anh, Trung.",
      },
      {
        icon: "file",
        title: "Context Memory",
        description: "Ghi nhớ ngữ cảnh cuộc hội thoại để phản hồi chính xác hơn.",
      },
      {
        icon: "moon",
        title: "24/7 Availability",
        description: "Hoạt động liên tục không ngừng nghỉ.",
      },
    ],
    images: [
      { src: "/chatbot-mobile-interface.jpg", label: "Mobile Chat" },
      { src: "/chatbot-analytics-dashboard.jpg", label: "Analytics" },
    ],
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind"],
      backend: ["Python", "FastAPI", "OpenAI"],
      devops: ["Docker", "GCP"],
    },
    projectInfo: {
      role: "AI Engineer",
      duration: "4 tháng",
      client: "TechCorp VN",
      status: "Hoàn thành",
    },
    links: {
      sourceCode: "https://github.com",
      liveDemo: "https://demo.com",
    },
  },
  "ecommerce-platform": {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    description: "Nền tảng thương mại điện tử hoàn chỉnh với quản lý sản phẩm, thanh toán và theo dõi đơn hàng.",
    tags: ["E-commerce", "2023"],
    heroImage: "/ecommerce-platform-dark-theme.png",
    overview: `E-commerce Platform là giải pháp bán hàng trực tuyến toàn diện, được thiết kế để phục vụ các doanh nghiệp vừa và nhỏ. Hệ thống bao gồm quản lý kho hàng, xử lý thanh toán đa kênh, và tích hợp vận chuyển.

Nền tảng được xây dựng với kiến trúc microservices, cho phép mở rộng linh hoạt theo nhu cầu kinh doanh.`,
    features: [
      {
        icon: "chart",
        title: "Inventory Management",
        description: "Quản lý kho hàng tự động với cảnh báo tồn kho.",
      },
      {
        icon: "shield",
        title: "Secure Payments",
        description: "Tích hợp cổng thanh toán an toàn với PCI DSS.",
      },
      {
        icon: "file",
        title: "Order Tracking",
        description: "Theo dõi đơn hàng realtime từ đặt hàng đến giao hàng.",
      },
      {
        icon: "moon",
        title: "Multi-vendor Support",
        description: "Hỗ trợ nhiều nhà bán hàng trên cùng nền tảng.",
      },
    ],
    images: [
      { src: "/ecommerce-mobile-app.png", label: "Mobile App" },
      { src: "/ecommerce-admin-dashboard.png", label: "Admin Panel" },
    ],
    techStack: {
      frontend: ["Next.js", "Redux", "Tailwind"],
      backend: ["Node.js", "PostgreSQL", "Redis"],
      devops: ["AWS", "Docker", "Kubernetes"],
    },
    projectInfo: {
      role: "Full Stack Lead",
      duration: "6 tháng",
      client: "ShopVN",
      status: "Hoàn thành",
    },
    links: {
      sourceCode: "https://github.com",
      liveDemo: "https://demo.com",
    },
  },
}

interface ProjectData {
  id: string
  title: string
  description: string
  tags: string[]
  heroImage: string
  overview: string
  features: { icon: string; title: string; description: string }[]
  images: { src: string; label: string }[]
  techStack: { frontend: string[]; backend: string[]; devops: string[] }
  projectInfo: { role: string; duration: string; client: string; status: string }
  links: { sourceCode: string; liveDemo: string }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData[id]

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Dự án không tồn tại</h1>
          <Link href="/#projects">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <ProjectDetailClient project={project} />
}
