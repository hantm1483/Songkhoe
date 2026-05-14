# Phase 2: API Routes for Screening Catalog CRUD

## Overview
- **Status:** pending
- **Priority:** P2
- **Effort:** 2h
- Create GET/POST/PUT/DELETE endpoints for screening catalog

## Key Insights
- Follow existing pattern from lab-results route
- Use getAuthContext() for user isolation
- Support demo users with user_id prefix

## Requirements
### Functional
- GET /api/screening-catalog - list all catalog items for user
- POST /api/screening-catalog - create new catalog item
- PUT /api/screening-catalog/[id] - update catalog item
- DELETE /api/screening-catalog/[id] - delete catalog item

### Non-Functional
- Return unique constraint violation as friendly error

## Architecture
```
EndPoints:
- GET /api/screening-catalog -> return catalog items
- POST /api/screening-catalog -> insert new item
- PUT /api/screening-catalog/[id] -> update by id
- DELETE /api/screening-catalog/[id] -> delete by id
```

## Related Code Files
- `src/app/api/screening-catalog/route.ts` - GET, POST
- `src/app/api/screening-catalog/[id]/route.ts` - PUT, DELETE
- `src/lib/validations.ts` - add validation schema

## Implementation Steps
1. Create validation schema in validations.ts
2. Create `/api/screening-catalog/route.ts` with GET/POST
3. Create `/api/screening-catalog/[id]/route.ts` with PUT/DELETE

## Success Criteria
- All endpoints return proper JSON responses
- POST returns new item with 201 status
- PUT/DELETE handle not found gracefully

## Next Steps
- Phase 3 depends on API endpoints