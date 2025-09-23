# Liverpool FC Stats & Blog Platform

A full-stack web application for Liverpool FC fans featuring player statistics, match fixtures, and blog content management.

## 🏗️ Architecture

**Backend:** Java Spring Boot with PostgreSQL and JWT authentication  
**Frontend:** Angular with TypeScript  
**Deployment:** AWS Elastic Beanstalk (backend) + S3/CloudFront (frontend)

## ⚽ Features

### Public Features
- **Home Dashboard:** Latest news, upcoming fixtures, recent results, and top scorers
- **Blog:** Published articles with search and pagination
- **Player Statistics:** Current season stats, top scorers, and assists leaderboards
- **Match Fixtures:** Upcoming matches and recent results

### Admin Features (JWT Protected)
- **Blog Management:** Create, edit, and publish blog posts
- **Player Stats Management:** Update player statistics and performance data
- **Fixture Management:** Add matches and update scores
- **User Management:** Manage user roles and permissions

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup (Spring Boot)

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Configure database:**
   ```bash
   # Create PostgreSQL database
   createdb liverpool_fc_db
   
   # Update application.properties with your database credentials
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   Backend API will be available at `http://localhost:8080`

### Frontend Setup (Angular)

1. **Navigate to frontend and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will be available at `http://localhost:4200`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Public Endpoints
- `GET /api/blog/public/posts` - Get published blog posts
- `GET /api/fixtures/public/all` - Get all fixtures
- `GET /api/stats/public/top-scorers` - Get top scorers

### Protected Endpoints (Requires JWT)
- `POST /api/blog/posts` - Create blog post
- `PUT /api/blog/posts/{id}` - Update blog post
- `DELETE /api/blog/posts/{id}` - Delete blog post (Admin only)

## 🏢 Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Encrypted)
- `roles` (USER, ADMIN)

### Blog Posts Table
- `id` (Primary Key)
- `title`
- `summary`
- `content`
- `image_url`
- `is_published`
- `author_id` (Foreign Key)

### Player Stats Table
- `id` (Primary Key)
- `player_name`
- `position`
- `goals`
- `assists`
- `appearances`
- `season`

### Fixtures Table
- `id` (Primary Key)
- `home_team`
- `away_team`
- `match_date`
- `competition`
- `status`

## 🚀 AWS Deployment

### Backend Deployment (Elastic Beanstalk)

1. **Build the application:**
   ```bash
   cd backend
   mvn clean package
   ```

2. **Deploy to Elastic Beanstalk:**
   ```bash
   eb init
   eb create liverpool-fc-backend
   eb deploy
   ```

3. **Set environment variables:**
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`

### Frontend Deployment (S3 + CloudFront)

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to S3:**
   ```bash
   aws s3 sync dist/frontend/ s3://your-bucket-name
   ```

3. **Configure CloudFront distribution for the S3 bucket**

## 🔧 Development

### Backend Development
- Uses Spring Boot 3.1.5 with Java 17
- JWT-based authentication with role-based access control
- PostgreSQL with JPA/Hibernate for data persistence
- RESTful API design with proper HTTP status codes

### Frontend Development
- Angular 17 with standalone components
- TypeScript for type safety
- Responsive design with CSS Grid and Flexbox
- HTTP interceptors for JWT token handling
- Route guards for authentication and authorization

### Key Components
- **AuthService:** Handles login, logout, and token management
- **BlogService:** Manages blog post operations
- **StatsService:** Handles player statistics and fixtures
- **Guards:** Protect routes based on authentication and roles

## 🎨 UI/UX Features

- **Liverpool FC Branding:** Official red (#C8102E) and gold (#F6EB14) colors
- **Responsive Design:** Mobile-first approach with breakpoints
- **Loading States:** Spinner animations for better user experience
- **Error Handling:** User-friendly error messages
- **Accessibility:** Semantic HTML and proper ARIA labels

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Encryption:** BCrypt hashing for user passwords
- **CORS Configuration:** Proper cross-origin resource sharing setup
- **Role-based Access:** Admin-only endpoints for sensitive operations
- **Input Validation:** Server-side validation for all inputs

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Liverpool FC for inspiration
- Spring Boot and Angular communities
- AWS for cloud infrastructure

---

**You'll Never Walk Alone** ⚽🔴