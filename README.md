# Mera Portfolio

Chào mừng đến với **Mera Portfolio** - Hệ thống website portfolio cá nhân hiện đại, được xây dựng với hiệu suất cao và khả năng quản lý nội dung động.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black) ![Tech Stack](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tech Stack](https://img.shields.io/badge/Firebase-Firestore-orange) ![Tech Stack](https://img.shields.io/badge/Tailwind-CSS-3.8-cyan)

## 🌟 Tính Năng Nổi Bật

- **Giao diện Hiện đại & Responsive**: Thiết kế tối ưu cho mọi thiết bị (Mobile, Tablet, Desktop) với Tailwind CSS.
- **Chế độ Sáng/Tối (Dark Mode)**: Tự động nhận diện theo hệ thống hoặc tùy chỉnh người dùng.
- **Quản trị Nội dung (Admin Dashboard)**: Hệ thống CMS tích hợp cho phép chỉnh sửa trực tiếp:
  - Thông tin cá nhân (About Me).
  - Kỹ năng (Skills) & Tự động tính toán (Auto-calculated Skills).
  - Dự án (Projects).
  - Kinh nghiệm làm việc (Experience).
  - Social Links & CV.
- **Cơ sở dữ liệu Real-time**: Sử dụng **Firebase Firestore** giúp cập nhật dữ liệu tức thì mà không cần build lại web.
- **Hiệu ứng Động**: Tích hợp Framer Motion, Particles cho trải nghiệm mượt mà.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (Component Library).
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore Cloud Database).
- **Deployment**: [Vercel](https://vercel.com/).

## 🚀 Hướng Dẫn Cài Đặt (Local Development)

Để chạy dự án trên máy cá nhân, bạn cần cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+).

### 1. Clone về máy
```bash
git clone https://github.com/Meranh05/portfolio-mera.git
cd portfolio-mera
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình Biến môi trường (.env)
Tạo file `.env` tại thư mục gốc và điền thông tin Firebase của bạn (Lấy trên Firebase Console):

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XYZ..."
```

### 4. Chạy dự án
```bash
npm run dev
```
Truy cập `http://localhost:3000` để xem kết quả.

## 📦 Hướng Dẫn Deploy (Vercel)

Đây là cách nhanh nhất để đưa website online:

1. Đẩy code lên **GitHub** (như bạn đã làm).
2. Vào [Vercel Dashboard](https://vercel.com), chọn **Add New Project**.
3. Import repository `portfolio-mera`.
4. Tại mục **Environment Variables**, thêm đủ 7 biến `NEXT_PUBLIC_FIREBASE_...` như trong file `.env`.
5. Bấm **Deploy**.

## 📁 Cấu Trúc Thư Mục

- `app/`: Chứa các trang (Pages) theo cấu trúc App Router của Next.js.
  - `admin/`: Khu vực quản trị viên.
- `components/`: Các thành phần giao diện (Button, Card, Section...).
  - `admin/`: Các component riêng cho trang Admin.
  - `ui/`: Các component cơ bản từ Shadcn UI.
- `lib/`: Các hàm tiện ích và cấu hình Firebase (`firebase.ts`, `portfolio-store.ts`).
- `hooks/`: Các React Hooks tùy chỉnh (VD: `use-portfolio-sync.ts`).

## 🛡️ Bảo Mật & Firebase Rules

Để website hoạt động, hãy đảm bảo **Firestore Rules** trên Firebase Console được cấu hình đúng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Lưu ý: Cấu hình này mở công khai (cho Dev/Test)
    }
  }
}
```

---
© 2026 Mera Portfolio. Built with ❤️ and Code.
