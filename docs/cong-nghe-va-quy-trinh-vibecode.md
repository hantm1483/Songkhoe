# Sổ Tay Sức Khỏe - Tổng quan Dự Án

## 1. Kiến trúc Web (Web Architecture)

### 1.1 Tổng quan kiến trúc
Dự án sử dụng **Next.js 14** với kiến trúc **App Router**, triển khai theo mô hình:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│              React 18 + TailwindCSS + Framer Motion        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  (auth)     │  │  (main)     │  │    API Routes       │ │
│  │  /login     │  │  /trangchu  │  │  /api/glucose       │ │
│  │  /register  │  │  /tracking  │  │  /api/medications  │ │
│  │  /forgot-*  │  │  /bua-an    │  │  /api/meals         │ │
│  └─────────────┘  │  /thuoc     │  │  /api/lab-results   │ │
│                   │  /xet-nghiem│  │  /api/chat          │ │
│                   │  ...        │  │  ...                │ │
│                   └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Auth        │  │ Database    │  │ Edge Functions      │ │
│  │ - Login     │  │ - glucose   │  │ - summarize-lab-*   │ │
│  │ - Register  │  │ - medications│ │ - chat-*           │ │
│  │ - Session   │  │ - meals     │  │                    │ │
│  └─────────────┘  │ - lab_results│ └─────────────────────┘ │
│                   │ - articles   │                          │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Thư mục dự án
```
src/
├── app/
│   ├── (auth)/              # Auth routes (login, register, reset-password)
│   ├── (main)/              # Protected routes (dashboard, tracking, etc.)
│   │   ├── trangchu/        # Home page
│   │   ├── tracking/        # Glucose/medication tracking
│   │   ├── bua-an/          # Meal planning
│   │   ├── thuoc/           # Medications
│   │   ├── xet-nghiem/      # Lab results
│   │   └── ...
│   ├── api/                 # API routes
│   │   ├── glucose/         # Glucose CRUD
│   │   ├── medications/     # Medications CRUD
│   │   ├── meals/           # Meals CRUD
│   │   ├── lab-results/     # Lab results + AI summarize
│   │   ├── chat/            # AI chat
│   │   └── conversations/   # Chat history
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components (Page, Header, BottomNav)
│   ├── charts/              # Chart components
│   └── chat/                # Chat components
├── lib/
│   ├── supabase/            # Supabase clients (client/server/middleware)
│   ├── validations.ts       # Zod validation schemas
│   ├── api-response.ts      # Standardized API responses
│   └── rate-limit.ts        # Rate limiting
├── hooks/
│   └── use-auth.tsx         # Auth hook
└── middleware.ts            # Auth middleware
```

### 1.3 Data Flow
```
User Action → React Component → Supabase Client → Supabase DB
                                ↓
                         API Route (nếu cần)
                                ↓
                         Supabase Edge Function (AI)
```

---

## 2. Công nghệ (Technologies)

### 2.1 Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 14.2.0 | React framework, SSR, routing |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.3.0 | Type safety |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS |
| **Framer Motion** | 12.38.0 | Animations |
| **Recharts** | 2.10.0 | Charts (glucose, area charts) |
| **Lucide React** | 0.460.0 | Icons |
| **date-fns** | 3.0.0 | Date formatting |

### 2.2 Backend & Database
| Công nghệ | Mục đích |
|-----------|----------|
| **Supabase** | Backend-as-a-Service: Auth, Database, Edge Functions, Storage |
| **@supabase/ssr** | Server-side rendering support for Supabase |
| **@supabase/supabase-js** | Supabase JavaScript client |

### 2.3 Testing
| Công nghệ | Mục đích |
|-----------|----------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **Testing Library** | React component testing |

---

## 3. Công cụ (Tools)

### 3.1 Development Tools
- **Next.js CLI** - Dev server, build, lint
- **TypeScript Compiler** - Type checking
- **ESLint** - Code linting
- **PostCSS** - CSS processing

### 3.2 Supabase Tools
- **Supabase CLI** - Local development, migrations
- **Supabase Dashboard** - Database management

### 3.3 CI/CD & Deployment
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Deployment platform

### 3.4 Package Manager
- **npm** - Dependency management

---

## 4. Quy trình thực hiện VibeCode (VibeCode Process)

### 4.1 Tổng quan
Dự án được xây dựng theo phong cách **VibeCode** - tập trung vào tốc độ, iteration nhanh, và sử dụng AI assistance.

### 4.2 Quy trình phát triển

```
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 1: KHỞI TẠO DỰ ÁN                                    │
├─────────────────────────────────────────────────────────────┤
│  - Tạo Next.js project với TypeScript                      │
│  - Cài đặt dependencies (Supabase, Tailwind, etc.)         │
│  - Cấu hình Supabase client                                │
│  - Thiết lập design system (colors, typography, spacing)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 2: XÂY DỰNG BACKEND (Supabase)                        │
├─────────────────────────────────────────────────────────────┤
│  - Tạo Supabase project                                    │
│  - Thiết kế database schema (glucose_logs, medications...) │
│  - Cấu hình Row Level Security (RLS)                      │
│  - Tạo API routes trong Next.js                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 3: XÂY DỰNG UI COMPONENTS                            │
├─────────────────────────────────────────────────────────────┤
│  - Tạo base UI components (Button, Card, Input, Badge...)  │
│  - Xây dựng layout components (Page, Header, BottomNav)   │
│  - Tạo specialized components (Chart, Chat components)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 4: KẾT NỐI UI VỚI API                               │
├─────────────────────────────────────────────────────────────┤
│  - Sử dụng Supabase client trực tiếp từ client components │
│  - Hook useEffect để fetch data                            │
│  - Xử lý form và gọi Supabase insert/update                │
│  - Hiển thị data từ Supabase                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 5: AUTHENTICATION                                    │
├─────────────────────────────────────────────────────────────┤
│  - Cấu hình Supabase Auth                                  │
│  - Tạo middleware bảo vệ routes                            │
│  - Xây dựng login/register pages                           │
│  - Protected routes với auth check                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 6: TESTING & DEPLOYMENT                              │
├─────────────────────────────────────────────────────────────┤
│  - Viết unit tests với Vitest                              │
│  - Viết E2E tests với Playwright                           │
│  - Deploy lên Vercel                                       │
│  - CI/CD với GitHub Actions                                │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 VibeCode Principles áp dụng

| Nguyên tắc | Mô tả |
|------------|-------|
| **Fast Iteration** | Sử dụng AI để generate code nhanh, test sớm |
| **Copy-Paste Friendly** | Tận dụng components có sẵn từ shadcn/ui, Tailwind |
| **Convention over Configuration** | Follow established patterns (Next.js App Router) |
| **Iterative Refinement** | Code xong → test → fix → improve liên tục |
| **AI-Assisted Development** | AI giúp generate boilerplate, refactor, debug |

### 4.4 Supabase Integration Pattern
```typescript
// Client-side: Direct Supabase access
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Fetch data
const { data, error } = await supabase
  .from("glucose_logs")
  .select("*")
  .order("measured_at", { ascending: false });

// Insert data
const { data, error } = await supabase
  .from("glucose_logs")
  .insert({ user_id, value, timing, notes });
```

### 4.5 API Response Pattern
```typescript
// Standardized response helpers
import { successResponse, errorResponse, validationError } from "@/lib/api-response";

// Success
return NextResponse.json(successResponse({ data }));

// Error
return NextResponse.json(errorResponse("Message"), { status: 400 });
```

---

## 5. Những vấn đề cần khắc phục (Issues to Address)

### 5.1 Kiến trúc & Design

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Direct Supabase access từ Client** | UI gọi Supabase trực tiếp thay vì qua API routes | Tạo API routes cho tất cả data operations, UI chỉ gọi API |
| **Không có state management** | Dữ liệu được fetch trực tiếp, không cache | Thêm React Query hoặc SWR để cache và sync data |
| **Design system chưa hoàn chỉnh** | Colors, typography có trong tailwind nhưng không có documentation | Tạo design tokens documentation |
| **Mock data trong code** | `MOCK_ARTICLES`, mock readings vẫn còn trong code | Sử dụng feature flags hoặc chỉ mock khi không có Supabase |

### 5.2 Security

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Auth checks lặp lại** | Mỗi API route đều check auth riêng | Tạo shared auth middleware/helper |
| **Không có input sanitization** | User input được validate nhưng có thể thiếu XSS protection | Thêm sanitization layer |
| **Rate limiting mới chỉ ở AI summary** | Chỉ có rate limit cho `/api/lab-results/summarize` | Thêm rate limiting cho tất cả API routes |

### 5.3 Performance

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Client-side fetching không tối ưu** | Mỗi page đều fetch riêng, không có loading states | Thêm Suspense boundaries, skeleton loading |
| **Không có data prefetching** | Navigation không prefetch data của page tiếp theo | Sử dụng Next.js Link prefetch |
| **Không có error boundary** | Error không được handle gracefully | Thêm ErrorBoundary components |

### 5.4 Code Quality

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **File size lớn** | Một số component > 200 lines (tracking/page.tsx ~ 1000 lines) | Tách thành smaller components |
| **Không có shared API client** | Validations, API responses được lặp lại | Tạo shared API client library |
| **Types không đồng nhất** | Có `database.types.ts` nhưng vẫn dùng ad-hoc interfaces | Centralize all types |

### 5.5 Testing

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Unit tests chỉ có basic components** | Button, Input, Card được test nhưng business logic không | Thêm tests cho hooks, API routes, business logic |
| **Không có integration tests** | Chưa test API routes với Supabase | Thêm integration tests |
| **E2E tests chưa đầy đủ** | Playwright config có nhưng tests chưa đủ | Viết E2E cho critical user flows |

### 5.6 Development Workflow

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Không có commit conventions enforcement** | Conventional commits nhưng không enforced | Thêm commitlint, pre-commit hooks |
| **Không có changelog tự động** | Manual changelog | Thêm automated changelog với semantic-release |
| **Git workflow chưa rõ ràng** | Không có branch naming convention, PR template | Thêm CONTRIBUTING.md, PR template |

### 5.7 Documentation

| Vấn đề | Mô tả | Khuyến nghị |
|--------|-------|-------------|
| **Không có API documentation** | API routes không có OpenAPI/Swagger | Thêm API docs |
| **Không có database schema docs** | Schema chỉ trong Supabase dashboard | Thêm schema.md trong docs/ |
| **Components không có docs** | Storybook không được setup | Thêm Storybook hoặc inline docs |

---

## 6. Tóm tắt & Ưu tiên

### Ưu tiên cao (Cần làm ngay)
1. **Tái cấu trúc API** - UI nên gọi API routes thay vì Supabase trực tiếp
2. **Thêm state management** - React Query/SWR
3. **Hoàn thiện tests** - Integration tests cho API routes

### Ưu tiên trung bình (Nên làm)
4. **Tối ưu performance** - Loading states, prefetching
5. **Centralize types** - Đồng nhất type definitions
6. **Security improvements** - Shared auth middleware, rate limiting cho tất cả routes

### Ưu tiên thấp (Có thể bỏ qua ban đầu)
7. **Documentation** - API docs, Storybook
8. **Automated changelog**
9. **Design tokens documentation**
