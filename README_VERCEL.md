# Hướng dẫn Đồng bộ Dữ liệu trên Vercel

Hiện tại, trang web của bạn đang sử dụng **SQLite** (`dev.db`) và `localStorage` để lưu trữ dữ liệu. Điều này dẫn đến hai hạn chế khi chạy trên Vercel:

1.  **Dữ liệu không đồng nhất:** Dữ liệu bạn thêm ở máy Local (máy tính cá nhân) chỉ nằm ở máy Local. Khi bạn truy cập trang web đã deploy (`.vercel.app`), nó sẽ bắt đầu với một kho dữ liệu trống.
2.  **Mất dữ liệu:** Vercel là môi trường "Serverless", nghĩa là các file sinh ra lúc chạy (như `dev.db`) sẽ bị xóa sạch mỗi khi code được deploy lại hoặc server khởi động lại.

## Giải pháp: Sử dụng Cơ sở dữ liệu Online (Persistent Database)

Để dữ liệu luôn được giữ lại và đồng bộ mọi nơi, bạn nên sử dụng một dịch vụ database online miễn phí.

### Cách 1: Sử dụng Supabase (Khuyên dùng - Cực kỳ mạnh mẽ)
1.  Truy cập [Supabase.com](https://supabase.com/) và tạo một Project mới.
2.  Vào phần **Settings -> Database** để lấy **Connection String** (URI).
3.  Trong project của bạn, cập nhật file `.env`:
    ```env
    DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres"
    ```
4.  Chạy lệnh: `npx prisma db push` để tạo bảng trên Supabase.

### Cách 2: Sử dụng Turso (Dành cho SQLite online)
1.  Cài đặt [Turso CLI](https://turso.tech/).
2.  Tạo database mới và lấy URL.
3.  Cập nhật file `.env`:
    ```env
    DATABASE_URL="libsql://[NAME].turso.io"
    AUTH_TOKEN="[YOUR_TOKEN]"
    ```

## Cấu hình trên Vercel Dashboard
Sau khi đã có `DATABASE_URL` từ Supabase hoặc Turso:
1.  Vào Dashboard của Vercel -> Chọn Project của bạn.
2.  Vào tab **Settings -> Environment Variables**.
3.  Thêm biến `DATABASE_URL` với giá trị bạn vừa lấy được.
4.  **Redeploy** lại dự án để các thay đổi có hiệu lực.

Giờ đây, dù bạn thêm dự án ở đâu, dữ liệu cũng sẽ được lưu vào database online và hiển thị trên web deploy!
