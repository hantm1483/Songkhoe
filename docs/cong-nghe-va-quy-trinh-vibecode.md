# Công nghệ & Quy trình VibeCode - Sổ Tay Tiểu Đường

## 1. Kiến trúc Web (Web Architecture)

### 1.1 Tổng quan kiến trúc
Dự án sử dụng **Next.js 14** với kiến trúc **App Router**, triển khai theo mô hình:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│        React 18 + TailwindCSS + Framer Motion               │
│        TanStack React Query + AI SDK                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  (auth)     │  │  (main)     │  │    API Routes        │ │
│  │  /login     │  │  /trangchu  │  │  /api/glucose        │ │
│  │  /register  │  │  /blood-*   │  │  /api/medications   │ │
│  │  /forgot-*  │  │  /bua-an    │  │  /api/meals          │ │
│  │  /reset-*   │  │  /thuoc     │  │  /api/lab-results    │ │
│  └─────────────┘  │  /xet-nghiem│  │  /api/ai/chat        │ │
│                   │  /screening │  │  /api/screening-*    │ │
│                   │  /lifestyle │  │  /api/body-metrics   │ │
│                   │  /nutrition │  │  ...                 │ │
│                   │  /health-*  │  └─────────────────────┘ │
│                   │  /blog      │                            │
│                   │  /kien-thuc │                            │
│                   │  /knowledge │                            │
│                   │  /news      │                            │
│                   │  /troly-ai   │                            │
│                   │  ...        │                            │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Auth        │  │ Database    │  │ AI Integration       │ │
│  │ - Login     │  │ - glucose   │  │ - @ai-sdk/react      │ │
│  │ - Register  │  │ - medications│ │ - AI chat routes    │ │
│  │ - Session   │  │ - meals     │  │                      │ │
│  │ - RLS       │  │ - lab_results│ └─────────────────────┘ │
│  └─────────────┘  │ - body_metrics│                        │
│                   │ - activity_*  │                         │
│                   │ - screening_*│                         │
│                   │ - health_*   │                         │
│                   │ - conversations│                       │
│                   │ - articles    │                         │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Thư mục dự án
```
src/
├── app/
│   ├── (auth)/              # Auth routes
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   ├── forgot-password/ # Forgot password
│   │   └── reset-password/  # Reset password
│   ├── (main)/              # Protected routes
│   │   ├── trangchu/        # Homepage
│   │   ├── blood-sugar/     # Blood sugar tracking
│   │   ├── bua-an/          # Meal planning
│   │   ├── thuoc/           # Medications
│   │   ├── xet-nghiem/      # Lab results
│   │   ├── screening/      # Health screening
│   │   ├── nutrition/       # Nutrition planning
│   │   ├── lifestyle/       # Lifestyle activities
│   │   ├── health-diary/    # Health diary
│   │   ├── blog/            # Blog articles
│   │   ├── kien-thuc/       # Knowledge base
│   │   ├── knowledge/       # Additional knowledge
│   │   ├── news/            # News
│   │   ├── troly-ai/        # AI assistant
│   │   ├── nhatky/          # Daily diary
│   │   ├── memory/          # Memory/care
│   │   └── care/            # Care section
│   ├── api/                 # API routes
│   │   ├── glucose/         # Glucose CRUD
│   │   ├── medications/     # Medications CRUD
│   │   ├── meals/           # Meals CRUD
│   │   ├── lab-results/     # Lab results + AI summarize
│   │   ├── ai/chat/         # AI chat endpoint
│   │   ├── chat/            # Chat history
│   │   ├── conversations/  # Conversations management
│   │   ├── body-metrics/   # Body metrics
│   │   ├── activity-schedules/# Activity schedules
│   │   ├── health-events/   # Health events
│   │   ├── screening-catalog/# Screening catalog
│   │   ├── articles/        # Articles
│   │   ├── notifications/   # Push notifications
│   │   ├── auth/create-profile/# Profile creation
│   │   └── memorial/        # Memorial features
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Base UI components
│   ├── layout/             # Layout components
│   ├── charts/             # Chart components
│   ├── chat/               # Chat components
│   ├── home/               # Homepage components
│   ├── blood-sugar/        # Blood sugar components
│   ├── nutrition/          # Nutrition components
│   ├── lifestyle/          # Lifestyle components
│   ├── screening/          # Screening components
│   ├── providers/          # React Query provider
│   ├── ai-sidebar/         # AI sidebar
│   └── blog/               # Blog components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── auth.ts             # Auth helpers
│   ├── validations.ts     # Zod validation schemas
│   ├── api-response.ts    # Standardized API responses
│   ├── rate-limit.ts      # Rate limiting
│   ├── design-system.ts   # Design tokens
│   ├── constants.ts       # Constants
│   └── data-service.ts    # Data service layer
├── hooks/
│   └── use-auth.tsx       # Auth hook
├── types/                 # TypeScript types
└── middleware.ts          # Auth middleware
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
| **TanStack React Query** | 5.100.10 | Server state management, caching |
| **Recharts** | 2.10.0 | Charts |
| **Lucide React** | 0.460.0 | Icons |
| **date-fns** | 3.0.0 | Date formatting |
| **clsx** | 2.1.1 | Conditional classnames |
| **tailwind-merge** | 2.6.1 | Tailwind class merging |

### 2.2 AI Integration
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **@ai-sdk/react** | 3.0.179 | AI SDK for React |
| **@anthropic-ai/sdk** | 0.95.2 | Anthropic Claude SDK |
| **ai** | 6.0.177 | AI framework for streaming |

### 2.3 Backend & Database
| Công nghệ | Mục đích |
|-----------|----------|
| **Supabase** | Backend-as-a-Service: Auth, Database, Edge Functions, Storage |
| **@supabase/ssr** | Server-side rendering support for Supabase |
| **@supabase/supabase-js** | Supabase JavaScript client |

### 2.4 Testing
| Công nghệ | Mục đích |
|-----------|----------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **@testing-library/react** | React component testing |
| **@testing-library/user-event** | User event simulation |

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
│  - Tạo Next.js 14 project với TypeScript                   │
│  - Cài đặt dependencies (Supabase, Tailwind, AI SDK, etc.)  │
│  - Cấu hình Supabase client (client/server/middleware)     │
│  - Thiết lập design system (colors, typography, spacing)    │
│  - Cấu hình TanStack React Query provider                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 2: XÂY DỰNG BACKEND (Supabase)                        │
├─────────────────────────────────────────────────────────────┤
│  - Tạo Supabase project                                    │
│  - Thiết kế database schema (glucose_logs, medications,     │
│    meals, lab_results, body_metrics, etc.)                 │
│  - Cấu hình Row Level Security (RLS)                       │
│  - Tạo API routes trong Next.js                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 3: XÂY DỰNG UI COMPONENTS                            │
├─────────────────────────────────────────────────────────────┤
│  - Tạo base UI components (Button, Card, Input, Badge...) │
│  - Xây dựng layout components (Page, Header, BottomNav)    │
│  - Tạo specialized components (Charts, Chat, AI Sidebar)   │
│  - Xây dựng feature components (BloodSugar, Nutrition...)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 4: KẾT NỐI UI VỚI API                                │
├─────────────────────────────────────────────────────────────┤
│  - Sử dụng TanStack React Query cho data fetching/caching    │
│  - Tạo API routes cho tất cả data operations               │
│  - Xử lý form và gọi API insert/update                      │
│  - Hiển thị data với loading states và error handling       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 5: AI INTEGRATION                                   │
├─────────────────────────────────────────────────────────────┤
│  - Cấu hình AI SDK (@ai-sdk/react)                          │
│  - Tạo AI chat API routes                                  │
│  - Xây dựng chat UI components                             │
│  - Tích hợp AI vào các feature (lab results summarization)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 6: AUTHENTICATION                                   │
├─────────────────────────────────────────────────────────────┤
│  - Cấu hình Supabase Auth                                  │
│  - Tạo middleware bảo vệ routes                            │
│  - Xây dựng login/register/forgot-password pages          │
│  - Protected routes với auth check                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 7: TESTING & DEPLOYMENT                              │
├─────────────────────────────────────────────────────────────┤
│  - Viết unit tests với Vitest                               │
│  - Viết E2E tests với Playwright                            │
│  - Deploy lên Vercel                                       │
│  - CI/CD với GitHub Actions                                │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 VibeCode Principles áp dụng

| Nguyên tắc | Mô tả |
|------------|-------|
| **Fast Iteration** | Sử dụng AI để generate code nhanh, test sớm |
| **Copy-Paste Friendly** | Tận dụng components có sẵn từ Tailwind, shadcn/ui patterns |
| **Convention over Configuration** | Follow established patterns (Next.js App Router) |
| **Iterative Refinement** | Code xong → test → fix → improve liên tục |
| **AI-Assisted Development** | AI giúp generate boilerplate, refactor, debug |
| **Server State Management** | Sử dụng TanStack React Query cho caching và sync |

### 4.4 API Pattern với TanStack React Query
```typescript
// Sử dụng React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Query hook
export function useGlucoseLogs() {
  return useQuery({
    queryKey: ['glucose'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('glucose_logs')
        .select('*')
        .order('measured_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Mutation hook
export function useAddGlucose() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLog: GlucoseLog) => {
      const { error } = await supabase.from('glucose_logs').insert(newLog);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glucose'] });
    },
  });
}
```

### 4.5 API Response Pattern
```typescript
// Standardized response helpers
import { successResponse, errorResponse, validationError } from '@/lib/api-response';

// Success
return NextResponse.json(successResponse({ data }));

// Error
return NextResponse.json(errorResponse('Message'), { status: 400 });
```

### 4.6 AI Chat Integration Pattern
```typescript
// AI chat route
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241020'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## 5. Database Schema (Supabase)

### 5.1 Core Tables
- **glucose_logs** - Blood glucose readings
- **medications** - Medication tracking
- **meals** - Meal records with carb counting
- **lab_results** - Lab test results with AI summaries
- **body_metrics** - Weight, height, BMI tracking

### 5.2 Health & Lifestyle
- **activity_schedules** - Exercise/activity planning
- **health_events** - Health diary events
- **conversations** - AI chat history
- **screening_catalog** - Health screening schedules

### 5.3 Content
- **articles** - Educational articles
- **memorial_quotes/stories/photos** - Memorial features

---

## 6. Đặc điểm nổi bật

### 6.1 AI Integration
- AI chat assistant với Claude
- Lab results AI summarization
- Floating AI sidebar cho context-aware assistance

### 6.2 Data Visualization
- Glucose charts với Recharts
- Activity schedules
- Nutrition planning với carb calculator

### 6.3 State Management
- TanStack React Query cho server state
- Optimistic updates cho better UX
- Background refetching và cache management

---

## 7. Các vấn đề cần lưu ý

### 7.1 Security
- Row Level Security (RLS) trên tất cả tables
- Auth middleware cho protected routes
- Rate limiting trên API routes
- Input validation với Zod

### 7.2 Performance
- React Query caching để giảm API calls
- Loading states và skeleton UI
- Error boundaries cho graceful error handling

### 7.3 Code Quality
- File size dưới 200 lines cho components
- Shared API response helpers
- Centralized type definitions
- Validation schemas trong lib/validations.ts

---

## 8. Development Commands

```bash
# Development
npm run dev          # Start dev server

# Build & Type Check
npm run build        # Production build
npm run typecheck    # TypeScript checking

# Testing
npm run test         # Run tests (Vitest)
npm run test:ci      # CI mode tests
npm run coverage     # Coverage report

# Linting
npm run lint         # ESLint check
```