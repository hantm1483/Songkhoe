# Comprehensive Performance Analysis Report

**Date:** 2026-05-14  
**Analyzer:** Debugger Agent  
**Scope:** Full Application (Main + Auth routes)

---

## 1. Page-by-Page Analysis

### Main Routes (19 pages)

| Page | Data Fetched | Heavy Components | Issues |
|------|-------------|------------------|--------|
| `/` (trangchu) | Static mock data | StatsCard, CategoryCard, PostCard | No API calls - good for static caching |
| `/blood-sugar` | `/api/glucose` via data-service.ts | GlucoseChart, GlucoseLog table | No caching, manual refresh trigger |
| `/nutrition` | Client components (no API) | NutritionPlan, CarbCalculator, FoodList | No data fetching |
| `/blog` | `/api/articles` (POST/GET) | PostCard list | Fetches on mount, no cache |
| `/news` | Direct Supabase query | NewsItemCard, FeaturedHero | Direct DB query, fallback mock |
| `/knowledge` | `/api/articles` | Video player, Article cards | No caching |
| `/tracking` | None (client state only) | Recharts AreaChart, MedicationList | No API - local state only |
| `/lifestyle` | Client components | WorkoutSuggestions, ActivitySchedule | Unknown |
| `/screening` | /api/screening-catalog | ScreeningList | No caching |
| `/memory` | Unknown | Unknown | TBD |
| `/thuoc` | /api/medications | Medication cards | No caching |
| `/bua-an` | /api/meals | Meal planning UI | No caching |
| `/care` | Unknown | Unknown | TBD |
| `/kien-thuc` | Unknown | Unknown | TBD |
| `/xet-nghiem` | /api/lab-results | Lab results display | No caching |
| `/nhatky` | Unknown | Unknown | TBD |
| `/troly-ai` | /api/chat, /api/ai/chat | Chat window | No message caching |
| `/health-diary` | Unknown | Unknown | TBD |
| `/screening` | /api/screening-catalog | Screening list | No caching |

### Auth Routes (4 pages)

| Page | Data Fetched | Notes |
|------|-------------|-------|
| `/login` | None | Static UI |
| `/register` | None | Static UI |
| `/forgot-password` | None | Static UI |
| `/reset-password` | None | Static UI |

---

## 2. API Usage Matrix

| API Endpoint | Pages Using | Fetch Frequency | Cache Recommendation |
|-------------|-----------|----------------|-------------------|
| `/api/articles` | blog, knowledge | On mount, when posting | Cache 5-10 min, SWR |
| `/api/glucose` | blood-sugar | Manual trigger only | Short cache 1 min |
| `/api/meals` | nutrition, tracking | Unknown | Cache 5 min |
| `/api/medications` | tracking | Unknown | Cache 10 min |
| `/api/health-events` | tracking | None observed | Cache 5 min |
| `/api/lab-results` | xet-nghiem | On mount | Cache 30 min |
| `/api/body-metrics` | home | Static mock | N/A |
| `/api/chat` | troly-ai | Real-time | No cache |
| `/api/ai/chat` | troly-ai | Real-time | No cache |
| `/api/screening-catalog` | screening | On mount | Cache 1 hour |
| `/api/activity-schedules` | lifestyle | Unknown | Cache 10 min |
| Direct Supabase | news | On mount | Replace with API route |
| `/api/conversations` | troly-ai | Unknown | Cache 5 min |

---

## 3. Data Patterns Identified

### Static Data (Long Cache)
- Categories list (home page)
- Stats default values
- Tutorial videos list
- Static guide content

### User-Generated Data (Short/No Cache)
- Blood glucose readings
- Blog posts
- Chat messages
- Medication logs

### Semi-Static Data (Medium Cache)
- Articles/knowledge base (changes rarely)
- News articles (daily update)
- Screening catalog (monthly update)
- Lab result templates

### Real-Time Data (No Cache)
- AI chat responses
- Notifications
- Glucose readings during active monitoring

---

## 4. Issues Identified

### Critical Issues

1. **No Client-Side Caching**
   - React Query / SWR not implemented
   - Every page navigation triggers fresh API calls
   - Impact: High - affects all dynamic pages

2. **Direct Supabase Queries**
   - `/news` page (line 170-176) queries Supabase directly
   - Bypasses API layer caching
   - Impact: Medium - inconsistent architecture

3. **No Cache Invalidation Strategy**
   - No mutation-based invalidation
   - No optimistic updates
   - Impact: Medium - poor UX

4. **Duplicate Data Fetching**
   - Articles fetched on both `/blog` and `/knowledge`
   - No shared cache between pages
   - Impact: Medium - wasted requests

### Medium Issues

5. **Manual Refresh Pattern**
   - Blood sugar uses refreshTrigger state
   - Not automatic/polling
   - Impact: Low-Medium

6. **Mock Data Fallbacks**
   - Knowledge, news return mock on error
   - Masks real issues
   - Impact: Low

7. **Client-Only State**
   - Tracking page stores everything locally
   - No persistence between sessions
   - Impact: Medium - data loss risk

---

## 5. Caching Strategy Framework

### A. Next.js Server-Side Caching (fetch)

```typescript
// Static content - articles, knowledge base
fetch('/api/articles', { 
  next: { revalidate: 3600 } // 1 hour
})

// Semi-static - screening catalog
fetch('/api/screening-catalog', { 
  next: { revalidate: 86400 } // 24 hours
})

// User data - medications, meals
fetch('/api/medications', { 
  next: { revalidate: 600 } // 10 minutes
})
```

### B. Client-Side Caching (Recommended: TanStack Query)

```typescript
// Install: npm @tanstack/react-query

// Wrap app with QueryClientProvider

// Query keys and settings:
const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: string) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleKeys.details(), id] as const,
}

// Queries with caching:
const useArticles = (category?: string) => useQuery({
  queryKey: articleKeys.list(category || ''),
  queryFn: () => fetchArticles(category),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
})

// Mutations with invalidation:
const useCreateArticle = () => useMutation({
  mutationFn: createArticle,
  onSuccess: () => {
    queryClient.invalidateQueries(articleKeys.lists())
  }
})
```

### C. Component-Level Optimization

#### Memoization (React.memo, useMemo, useCallback)

```typescript
// Expensive chart components
const GlucoseChart = React.memo(({ data, refreshTrigger }) => {
  // chart rendering
})

// List items
const PostCard = React.memo(({ post, index }) => {
  // card rendering
})
```

#### Lazy Loading

```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./chart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

#### Code Splitting

```typescript
// Lazy load page components
const BlogPage = dynamic(() => import('./blog/page'))
const KnowledgePage = dynamic(() => import('./knowledge/page'))
```

---

## 6. Implementation Priority Queue

### Quick Wins (1-2 hours each)

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| 1 | Add React Query with basic caching | High | 2 hrs |
| 2 | Replace direct Supabase with API route in news | Medium | 1 hr |
| 3 | Add staleTime to existing fetch calls | Medium | 1 hr |
| 4 | Memoize PostCard, StatsCard components | Low | 1 hr |

### Medium Effort (4-8 hours each)

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| 5 | Implement mutation invalidation | High | 4 hrs |
| 6 | Add optimistic updates for blog posts | Medium | 4 hrs |
| 7 | Replace refreshTrigger with polling | Medium | 4 hrs |
| 8 | Lazy load charts on blood-sugar | Medium | 2 hrs |

### Long Term (Architectural)

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| 9 | Implement offline-first with IndexedDB | High | 16 hrs |
| 10 | Add webhook for cache invalidation | High | 8 hrs |
| 11 | Implement prefetching on hover | Medium | 8 hrs |

---

## 7. Estimated Impact Per Fix

| Fix | Lighthouse Improvement | User-Perceived Benefit |
|-----|---------------------|-------------------|
| React Query caching | +15-25 points | Instant page loads |
| Server revalidate | +10-15 points | Faster subsequent nav |
| Memoization | +5-10 points | Smoother scrolling |
| Lazy loading | +5-10 points | Faster initial load |
| Prefetching | +5-10 points | Instant navigation |

**Total potential improvement:** +40-70 Lighthouse points

---

## 8. Recommendations Summary

### Must Implement (Critical Path)

1. **Add TanStack Query** - Primary caching solution
   - Single provider wrapper
   - Standardized query keys
   - Mutation handling

2. **Standardize Data Fetching** - Remove direct Supabase calls
   - Create API routes for all data access
   - Add caching headers

3. **Set Cache Timings**
   - Articles: 5 min
   - User data: 1-5 min
   - Static content: 1 hr

### Should Implement

4. **Lazy load heavy components**
   - Charts (recharts is large)
   - Video players

5. **Add prefetching**
   - Prefetch next-page articles on hover

### Nice to Have

6. **Offline support**
7. **Optimistic updates**
8. **Real-time subscriptions**

---

## 9. Appendix: Code Locations

- Data fetching: `src/lib/data-service.ts`
- API routes: `src/app/api/*`
- Pages: `src/app/(main)/*/page.tsx`
- Components: `src/components/*`
- Database types: `src/lib/supabase/database.types.ts`

---

*Report generated by Debugger Agent*