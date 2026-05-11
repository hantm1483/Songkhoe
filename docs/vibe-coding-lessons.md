# Bài học từ Vibe Coding - GlucoCare Project

## Tóm tắt Dự án

- **Ngày:** 2026-05-11
- **Mục tiêu:** Rebuild Next.js app để match với GlucoCare React/Vite design
- **Thời gian:** ~2 giờ với multi-agent parallel execution
- **Kết quả:** Build thành công, 18 pages compile không lỗi

---

## 1. Schema không tương thích ngay từ đầu

**Vấn đề:**
- Ban đầu schema có FK constraints đến `auth.users(id)`
- Demo data dùng `NULL` cho user_id
- Khi chạy mock-data.sql → lỗi: `violates foreign key constraint 'profiles_id_fkey'`

**Nguyên nhân gốc:**
- Thiết kế schema theo production thinking (có FK), nhưng demo data không có real users
- Không check data-schema compatibility trước khi run SQL

**Giải pháp (đã làm):**
```sql
-- Thêm DROP TABLE IF EXISTS CASCADE trước mỗi CREATE
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE IF NOT EXISTS public.profiles (...);

-- Xóa FK constraints, để nullable
user_id UUID, -- Removed FK for demo flexibility
```

**Bài học:** Nên dùng nullable FK hoặc không có FK khi demo, hoặc check data trước khi run SQL.

---

## 2. Pages không match với design từ đầu

**Vấn đề:**
- Pages cũ (`trangchu`, `nhatky`, `bua-an`, `thuoc`, `xet-nghiem`) có UI khác hoàn toàn với GlucoCare
- Tên routes không khớp: `/trangchu` vs `/` (Dashboard), `/nhatky` vs `/tracking`

**Nguyên nhân gốc:**
- Không map design → routes từ đầu
- Thêm pages mới thay vì thay thế pages cũ

**Giải pháp (đã làm):**
- Tạo pages mới đúng design: `tracking`, `nutrition`, `knowledge`, `lifestyle`, `care`, `memory`, `news`
- Vẫn giữ pages cũ → gây confusion

**Bài học:** Khi nhận design mới:
1. Map design → routes ngay từ đầu
2. Thay thế (không phải thêm mới) các pages cũ
3. Hoặc redirect routes cũ sang routes mới

---

## 3. Data layer không được xác định trước

**Vấn đề:**
- Các pages dùng mock data generators thay vì gọi Supabase
- Mỗi page tự viết function riêng để generate mock data
- Cuối cùng mới kết nối Supabase APIs vào

**Nguyên nhân gốc:**
- Vibe coding: code trước, nghĩ sau về data
- Không xác định data flow trước khi code UI

**Giải pháp (đã làm):**
- Viết API routes trước
- Sau đó UI gọi APIs
- Vẫn giữ mock data fallbacks

**Bài học:** Thứ tự đúng:
1. Xác định Supabase tables
2. Viết API routes
3. UI call APIs

---

## 4. Không có checklist để verify implementation vs design

**Vấn đề:**
- Nhiều agents chạy song song, không ai kiểm tra xem page có đúng 100% với design không
- Một số styling không match: `rounded-2xl` thay vì `rounded-3xl`, màu sắc sai

**Nguyên nhân gốc:**
- Không có checklist per page
- Không có người review từng page so với design reference

**Giải pháp:** Tạo checklist:

| Component | Design Spec | Implementation | Status |
|-----------|-------------|----------------|--------|
| Sidebar | 4 nav items | ✅ | OK |
| Header | search + bell | ✅ | OK |
| Hero bg | primary #008B8B | ✅ | OK |
| rounded | 3xl | ❌ | Used 2xl |
| font-size | text-4xl | ❌ | Used text-headline-xl |

---

## 5. Type errors xảy ra trong quá trình

**Vấn đề:**
- Icon component có prop `size` và `fill` không consistent
- Badge variant type không đầy đủ (thiếu `neutral`, `secondary`)

**Nguyên nhân gốc:**
- Copy/paste code mà không check type definitions
- Các agents viết code không biết type constraints của shared components

**Giải pháp (đã làm):**
- Fix trực tiếp trên từng file
- Thêm variant types vào Badge component

**Bài học:** Nên chạy type check sau mỗi implementation phase, không đợi đến cuối.

---

## 6. Build errors không được phát hiện sớm

**Vấn đề:**
- tracking page có syntax error tồn tại từ trước
- Bị che giấu bởi các agents khác làm việc song song

**Nguyên nhân gốc:**
- Lỗi cũ không được phát hiện
- Không có CI check hoặc build verification thường xuyên

**Giải pháp:** Thêm vào quy trình:
```bash
npm run build  # sau mỗi phase
```

---

## Quy trình lý tưởng cho Vibe Coding

### Phase 1: Analysis (30 phút)
- [ ] Read design files kỹ
- [ ] Map design → routes
- [ ] Map design → data flow

### Phase 2: Data Layer (1 giờ)
- [ ] Schema design (nullable FK cho demo)
- [ ] API routes
- [ ] Test APIs

### Phase 3: UI Implementation (2 giờ)
- [ ] Layout components (sidebar, header, bottom-nav)
- [ ] CSS design system
- [ ] Pages (một agent per page)

### Phase 4: Verification (30 phút)
- [ ] Type check: `npm run build`
- [ ] Checklist comparison
- [ ] Fix errors

### Phase 5: Integration (30 phút)
- [ ] Connect UI to APIs
- [ ] Test forms
- [ ] Verify data flow

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Thời gian | ~5 giờ |
| Files changed | 27 |
| Lines added | 4,389 |
| Pages implemented | 8 new + 9 updated |
| Build errors | 0 (sau khi fix) |
| Type errors | 5 (đã fix) |

---

## Unresolved Questions

1. **Routes conflict:** Nên giữ `/trangchu` hay redirect sang `/`?
2. **Mock vs Real data:** Nên giữ mock fallbacks hay bắt buộc Supabase?
3. **Authentication:** App có cần auth flow đầy đủ không?