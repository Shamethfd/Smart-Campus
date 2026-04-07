# Smart Campus Booking System - Implementation Guide

## Overview
A complete booking management system allowing users to book resources (rooms, labs, equipment) with admin approval workflow.

## 📋 Features Implemented

### 1. **Booking Request System**
- Users can request bookings for rooms, labs, or equipment
- Select specific date and time slots
- Automatic conflict detection prevents double-booking
- Optional notes/description field

### 2. **Booking Workflow**
```
User Request → PENDING → Admin Review → APPROVED/REJECTED → CANCELLED (user can cancel if approved)
```

### 3. **User Dashboard**
- View all personal bookings with status
- See booking details (date, time, resource, notes)
- Cancel APPROVED bookings
- View admin feedback/notes

### 4. **Admin Panel**
- View all bookings with filtering by status
- Approve or reject PENDING bookings
- Add admin notes to bookings
- Dashboard shows statistics

### 5. **Conflict Prevention**
Backend validates:
- No two bookings can have overlapping times for same resource
- Prevents booking past dates
- Validates time range (start < end)

## 🏗️ Architecture

### Backend (Spring Boot + MongoDB)

#### Models
- **Booking** - Main entity with all booking details
- **BookingStatus** - Enum (PENDING, APPROVED, REJECTED, CANCELLED)
- **BookingRequest** - DTO for incoming requests
- **BookingResponse** - DTO for API responses

#### Layers
```
Controller → Service → Repository → MongoDB
```

#### API Endpoints

**Create Booking**
```
POST /api/v1/bookings
Body: {
  resourceId: string,
  resourceName: string,
  resourceType: ROOM|LAB|EQUIPMENT,
  bookingDate: YYYY-MM-DD,
  startTime: HH:mm,
  endTime: HH:mm,
  notes: string (optional)
}
Response: BookingResponse
```

**Get User Bookings**
```
GET /api/v1/bookings/my-bookings
Response: List<BookingResponse>
```

**Get Specific Booking**
```
GET /api/v1/bookings/{bookingId}
Response: BookingResponse
```

**Get Resource Bookings by Date**
```
GET /api/v1/bookings/resource/{resourceId}/date?date=YYYY-MM-DD
Response: List<BookingResponse>
```

**Admin: Get All Bookings**
```
GET /api/v1/bookings/admin/all (REQUIRES ADMIN ROLE)
Response: List<BookingResponse>
```

**Admin: Get by Status**
```
GET /api/v1/bookings/admin/status/{status} (REQUIRES ADMIN ROLE)
Response: List<BookingResponse>
```

**Admin: Approve Booking**
```
PUT /api/v1/bookings/{bookingId}/approve?notes={optional}
(REQUIRES ADMIN ROLE)
Response: BookingResponse with APPROVED status
```

**Admin: Reject Booking**
```
PUT /api/v1/bookings/{bookingId}/reject?notes={optional}
(REQUIRES ADMIN ROLE)
Response: BookingResponse with REJECTED status
```

**User: Cancel Booking**
```
DELETE /api/v1/bookings/{bookingId}/cancel
(Only works if status is APPROVED)
Response: BookingResponse with CANCELLED status
```

### Frontend (React + Tailwind CSS)

#### Project Structure
```
src/
├── pages/
│   ├── BookingRequest.jsx      - Booking form page
│   ├── UserDashboard.jsx       - User's booking history
│   └── AdminPanel.jsx          - Admin management interface
├── services/
│   └── bookingAPI.js           - API communication
├── App.jsx                     - Main app with routing
├── index.css                   - Tailwind styles
└── main.jsx                    - Entry point
```

#### Pages

**1. Home Page (`/`)**
- Overview of the booking system
- Quick links to all features
- How-it-works guide

**2. Booking Request Page (`/book`)**
- Form to submit new booking
- Resource type selector (ROOM, LAB, EQUIPMENT)
- Date and time picker
- Success/error messages
- Conflict detection feedback

**3. User Dashboard (`/dashboard`)**
- List all user's bookings
- Color-coded status badges
- Show admin notes if available
- Cancel button for APPROVED bookings
- Responsive grid layout

**4. Admin Panel (`/admin`)**
- Table view of all bookings
- Filter by status (ALL, PENDING, APPROVED, REJECTED, CANCELLED)
- Action buttons for PENDING bookings
- Modal for approval/rejection with notes
- Real-time updates

## 🔒 Security Features

1. **Role-Based Access Control (RBAC)**
   - Admin endpoints require `ADMIN` role
   - Users can only see their own bookings (enforced by userId)

2. **Input Validation**
   - Date/time format validation
   - Required field checks
   - Time range validation (start < end)
   - Past date prevention

3. **Conflict Prevention**
   - Backend checks for overlapping bookings
   - Prevents resource double-booking
   - Time range validation

4. **Transactional Operations**
   - Booking creation, approval, rejection use @Transactional
   - Ensures data consistency

## 📦 Database Schema (MongoDB)

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  userName: String,
  resourceId: String,
  resourceName: String,
  resourceType: String (ROOM|LAB|EQUIPMENT),
  bookingDate: LocalDate,
  startTime: LocalTime,
  endTime: LocalTime,
  status: String (PENDING|APPROVED|REJECTED|CANCELLED),
  notes: String,
  createdAt: Long (timestamp),
  updatedAt: Long (timestamp),
  adminNotes: String
}
```

## 🚀 Setup & Running

### Backend Setup
1. Navigate to `backend/` folder
2. Ensure MongoDB is running
3. Configure `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/smart-campus
   ```
4. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to `smart-campus-client/` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Access at `http://localhost:5173`

## 🔌 API Integration

The frontend communicates with backend via `bookingAPI.js`:
- Base URL: `http://localhost:8080/api/v1/bookings`
- Axios client with automatic token injection
- Error handling and response parsing

## 📝 Example Workflows

### User Booking Workflow
1. User fills booking request form
2. Submits → Backend validates (conflict check, date validation)
3. Booking created with PENDING status
4. Admin reviews in Admin Panel
5. Admin approves/rejects with optional notes
6. User sees update in Dashboard
7. If APPROVED, user can later cancel

### Admin Approval Workflow
1. Admin views Admin Panel
2. Sees PENDING bookings
3. Clicks Approve/Reject
4. Optionally adds admin notes
5. Booking status updates immediately
6. User notified via Dashboard

## ⚠️ Error Handling

**API Returns Error Responses:**
```javascript
{
  timestamp: ISO8601,
  status: HTTP_CODE,
  error: "Error Type",
  message: "Detailed error message",
  path: "/api/v1/bookings/..."
}
```

**Common Errors:**
- `400 Bad Request` - Invalid input, time conflicts, invalid status
- `404 Not Found` - Booking doesn't exist
- `403 Forbidden` - Insufficient permissions (admin-only endpoints)
- `401 Unauthorized` - Not authenticated

## 🔄 State Management

Frontend uses React hooks:
- `useState` - Local component state
- `useEffect` - Data fetching on mount/dependency change
- API calls via `bookingAPI` service

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts adapt from 1 column (mobile) to 2-3 columns (desktop)
- Touch-friendly buttons and inputs
- Tables scroll horizontally on mobile

## 🧪 Testing Recommendations

1. **Create Booking Tests:**
   - Valid booking creation
   - Conflict detection
   - Past date rejection
   - Invalid time range

2. **User Dashboard Tests:**
   - Fetch user bookings
   - Cancel APPROVED booking only
   - Display correct statuses

3. **Admin Panel Tests:**
   - Approve/Reject transitions
   - Admin notes save correctly
   - Filter by status works
   - Only PENDING bookings can be actioned

4. **Security Tests:**
   - Users cannot see other users' bookings
   - Admin endpoints require ADMIN role
   - Cannot cancel non-APPROVED bookings

## 🚧 Future Enhancements

1. **Notifications**
   - Email notifications on approval/rejection
   - SMS reminders for upcoming bookings

2. **Calendar Integration**
   - Visual calendar view
   - Drag-and-drop booking
   - iCal export

3. **Resource Management**
   - Add/edit resources
   - Resource availability status
   - Capacity management

4. **Analytics**
   - Booking trends
   - Resource utilization stats
   - User statistics

5. **Advanced Filtering**
   - Date range filters
   - Resource type filters
   - User search

6. **Recurring Bookings**
   - Weekly/monthly recurring
   - Auto-renewal options

## 📞 Support

For issues or questions:
1. Check console logs in browser DevTools
2. Check backend logs for API errors
3. Verify MongoDB connection
4. Ensure authentication token is present

---

**Version:** 1.0  
**Last Updated:** April 2026
