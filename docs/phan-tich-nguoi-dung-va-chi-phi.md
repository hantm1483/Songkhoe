# Phân tích Người dùng và Chi phí - Sổ Tay Sức Khỏe

## 1. Vấn đề người dùng (User Pain Points)

### 1.1 Pain Points hiện tại của bệnh nhân tiểu đường

| Vấn đề | Mô tả chi tiết | Tác động |
|--------|----------------|----------|
| **Không có nơi lưu trữ tập trung** | Bệnh nhân phải ghi chép đường huyết bằng giấy, Excel rời rạc, không có app thống nhất | Dữ liệu rời rạc, khó theo dõi xu hướng |
| **Thiếu kiến thức chuyên sâu** | Các nguồn kiến thức trên mạng phân tán, khó hiểu, không đáng tin cậy | Khó đưa ra quyết định đúng về chế độ ăn và thuốc |
| **Khó tiếp cận bác sĩ 24/7** | Cần đợi lịch hẹn hoặc gọi điện hỏi bác sĩ mỗi khi thắc mắc | Tốn thời gian, chi phí cao, lo lắng không cần thiết |
| **Quên uống thuốc** | Không có reminder hoặc tracking việc uống thuốc | Giảm hiệu quả điều trị, biến chứng |
| **Chế độ ăn uống không rõ ràng** | Không biết món ăn nào ảnh hưởng đường huyết thế nào | Đường huyết dao động mạnh |
| **Cảm thấy cô đơn** | Bệnh tiểu đường là bệnh mãn tính, người bệnh dễ stress, trầm cảm | Giảm tuân thủ điều trị, chất lượng sống |

### 1.2 User Personas

```
┌─────────────────────────────────────────────────────────────┐
│  PERSONA 1: Bà Minh, 62 tuổi, nghỉ hưu                     │
├─────────────────────────────────────────────────────────────┤
│  Mục tiêu: Theo dõi đường huyết mỗi ngày, nhắc thuốc       │
│  Pain points:                                               │
│  - Không quen dùng smartphone                              │
│  - Lo lắng về biến chứng (thận, mắt)                      │
│  - Con cái muốn biết tình trạng sức khỏe bà                │
│  Giải pháp app: Đơn giản, large fonts, reminder thuốc      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PERSONA 2: Anh Tuấn, 45 tuổi, doanh nhân                  │
├─────────────────────────────────────────────────────────────┤
│  Mục tiêu: Quản lý stress, công việc + bệnh tiểu đường      │
│  Pain points:                                               │
│  - Bận rộn, hay quên đo đường huyết                       │
│  - Cần tư vấn nhanh khi có vấn đề                          │
│  - Không muốn ai biết mình bị bệnh                         │
│  Giải pháp app: AI chat 24/7, nhanh, privacy               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PERSONA 3: Chị Hà, 35 tuổi, chăm mẹ bị tiểu đường         │
├─────────────────────────────────────────────────────────────┤
│  Mục tiêu: Giúp mẹ theo dõi bệnh từ xa                     │
│  Pain points:                                               │
│  - Sống xa mẹ, khó kiểm soát                              │
│  - Mẹ hay quên uống thuốc                                  │
│  - Muốn biết khi mẹ đo đường huyết bất thường              │
│  Giải pháp app: Family sharing, notifications bất thường   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 User Journey hiện tại (Before App)

```
1. Đo đường huyết bằng máy
   ↓
2. Ghi vào sổ/giấy (hoặc Excel)
   ↓
3. Quên → Không ghi được
   ↓
4. Mỗi tháng đi khám, bác sĩ hỏi "Đường huyết thế nào?"
   → "Dạ... em không nhớ rõ lắm"
   → Bác sĩ điều chỉnh thuốc dựa trên ít thông tin
   ↓
5. Kết quả: Đường huyết kiểm soát kém hơn, biến chứng cao hơn
```

### 1.4 User Journey với App (After App)

```
1. Đo đường huyết bằng máy
   ↓
2. Nhập vào app (nhanh, 10 giây)
   → Reminder thuốc tự động
   → AI chat nếu thắc mắc
   ↓
3. Dữ liệu được lưu tự động, biểu đồ xu hướng rõ ràng
   ↓
4. Mỗi tháng đi khám
   → Mở app, show bác sĩ biểu đồ 30 ngày
   → Bác sĩ điều chỉnh thuốc chính xác
   ↓
5. Kết quả: Đường huyết ổn định hơn, yên tâm hơn
```

---

## 2. Phân tích Chi phí (Cost Analysis)

### 2.1 Chi phí Infrastructure

| Dịch vụ | Plan | Chi phí/tháng | Ghi chú |
|---------|------|---------------|---------|
| **Vercel (Hosting)** | | | |
| - Next.js Frontend | Hobby (Free) | $0 | 100GB bandwidth |
| - Next.js Frontend | Pro | $20 | Không giới hạn, preview deploys |
| **Supabase** | | | |
| - Auth + Database | Free tier | $0 | 500MB database, 2GB transfer |
| - Auth + Database | Pro | $25 | 8GB database, 50GB transfer |
| - Edge Functions | Free | $0 | 50K invocations |
| - Edge Functions | Pro | $25 | 2M invocations |
| - Storage | Free | $0 | 1GB |
| - Storage | Pro | $5 | 100GB |
| **Domain** | .com | ~$10/năm | |
| **SSL** | | $0 | Miễn phí với Vercel |

### 2.2 Chi phí API AI (Claude)

| Token | Chi phí | Ứng dụng |
|-------|---------|----------|
| **Input (Haiku)** | $0.25 / 1M tokens | Chat messages |
| **Input (Sonnet)** | $3 / 1M tokens | Complex AI features |
| **Output (Haiku)** | $1.25 / 1M tokens | AI responses |
| **Output (Sonnet)** | $15 / 1M tokens | AI responses |

**Ví dụ tính toán:**
- 1 cuộc trò chuyện AI: ~500 tokens input + 300 tokens output
- Haiku: 500×$0.25/1M + 300×$1.25/1M = $0.000125 + $0.000375 = **$0.0005/cuộc trò chuyện**
- 1000 users × 10 chat/month = 10,000 chats → **~$5/tháng**

### 2.3 Chi phí vận hành ước tính

| Quy mô | Supabase | AI (Claude) | Hosting | Tổng |
|--------|----------|-------------|---------|------|
| **Free tier (50 users)** | $0 | ~$2 | $0 | **~$2/tháng** |
| **Small (100 users)** | $0 | ~$10 | $0 | **~$10/tháng** |
| **Medium (500 users)** | $25 | ~$50 | $20 | **~$95/tháng** |
| **Growth (1000 users)** | $25 | ~$100 | $20 | **~$145/tháng** |
| **Scale (5000 users)** | $50 | ~$400 | $40 | **~$490/tháng** |

### 2.4 Chi phí phát triển (Development Cost)

| Giai đoạn | Thời gian | Chi phí ước tính |
|-----------|-----------|------------------|
| **MVP (VibeCode)** | 2-4 tuần | $500 - $2,000 |
| **Polish + Testing** | 1-2 tuần | $300 - $1,000 |
| **Bug fixes + iteration** | Ongoing | $200 - $500/tháng |
| **Features mới** | Varies | $500 - $2,000/feature |

---

## 3. So sánh với giải pháp hiện tại (Competitive Analysis)

### 3.1 So sánh chi phí alternative solutions

| Giải pháp | Chi phí/tháng | Hạn chế |
|-----------|---------------|---------|
| **Excel/Sổ giấy** | $0 | Không tiện, khó đọc, không có reminders |
| **App đơn lẻ ( Glucose, MySugr)** | $5-10 | Chỉ theo dõi glucose, không tích hợp |
| **App bệnh viện** | $0-20 | Thường là portal của bệnh viện, không tích hợp |
| **Doctor consultation** | $50-100/visit | Tốn kém, không 24/7 |
| **Sổ Tay Sức Khỏe** | $0-145 | Tích hợp đầy đủ, AI 24/7, miễn phí tier nhỏ |

### 3.2 Value Proposition

| Vấn đề | Trước | Sau |
|--------|-------|------|
| **Theo dõi đường huyết** | Sổ/Excel, rời rạc | App mobile, biểu đồ, trend |
| **Nhắc thuốc** | Không có / Báo thức bên ngoài | Tích hợp trong app |
| **Tư vấn nhanh** | Gọi điện bác sĩ, tốn phí | AI chat miễn phí |
| **Chế độ ăn** | Tự tìm hiểu, không rõ ràng | Thực đơn có sẵn, GI index |
| **Kết quả xét nghiệm** | Giấy, quên mang | Lưu trong app, AI giải thích |
| **Cho người thân xem** | Gọi điện, gửi ảnh | Family sharing |

---

## 4. Tóm tắt Chi phí - Lợi ích

### 4.1 Người dùng tiết kiệm được

| Chi phí tiết kiệm | Giá trị ước tính |
|-------------------|------------------|
| Không cần gọi điện hỏi bác sĩ | $20-100/lần (nếu có) |
| Giảm biến chứng (nhập viện) | $5,000-50,000/lần |
| Theo dõi tốt hơn → giảm thuốc | $20-100/tháng |
| Không cần app riêng lẻ | $5-10/tháng |

### 4.2 ROI cho người dùng

- **Chi phí App/người/tháng:** $0-5 (tùy tier)
- **Chi phí biến chứng tiểu đường:** $5,000-50,000 (nếu xảy ra)
- **Phòng ngừa biến chứng:** Theo nghiên cứu, kiểm soát tốt HbA1c giảm 50-70% nguy cơ biến chứng

---

## 5. Kết luận

### 5.1 Điểm mạnh của giải pháp
- **Tích hợp:** Một app thay thế nhiều app riêng lẻ
- **AI 24/7:** Tư vấn tức thì, không tốn phí
- **Free tier hào phóng:** Người dùng nhỏ có thể dùng miễn phí
- **Chi phí thấp để bắt đầu:** Vercel + Supabase free tier đủ cho MVP

### 5.2 Điểm cần lưu ý
- Khi scale, Supabase Pro + AI sẽ tăng đáng kể
- Cần monitoring usage để tránh surprise billing
- AI chat cần prompt engineering tốt để tránh hallucination
