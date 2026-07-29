# 🎧 EchoVerse

> A full-stack royalty-free music streaming platform built with Django and MySQL.

EchoVerse is a dynamic web application designed for streaming, discovering, and managing royalty-free music. Built with a production-first backend architecture, it features secure session management, asynchronous audio player interactions, live search, and dynamic recommendation logic.

---

## ✨ Key Features

### 🎧 Listen & Discover
- Stream royalty-free audio tracks seamlessly using asynchronous player controls
- Real-time search and filter by title, artist, or genre
- Custom *"You May Also Like"* recommendation logic based on genre relationships and user listening patterns
- Custom 404/500 error pages built for application fault tolerance

### 👤 User Authentication & Profiles
- Secure registration, login, session handling, and password workflows via Django Authentication
- Automated user profile instantiation triggered via Django Signals
- Public profile pages showcasing uploaded tracks, avatars, and bios

### 📤 Media Management
- File upload handling with validation for audio tracks and cover artwork
- Image processing and dynamic asset scaling integrated using Pillow
- Relational schema modeling via Django ORM with MySQL for backend data persistence

### ❤️ Instant Favoriting
- Dynamic liking and favoriting using JavaScript **Fetch API (AJAX)** without triggering full-page reloads
- Dedicated user library for saved favorited tracks

### 📱 Responsive UI/UX
- Mobile-first, dark-themed responsive user interface built using Bootstrap 5 and custom CSS
- Asynchronous UI updates to deliver continuous audio playback during page navigation

---

## 🛠 Tech Stack

### Backend
- Python 3.x
- Django 6.x
- Django ORM & Signals

### Frontend
- HTML5 & CSS3
- Bootstrap 5
- JavaScript (ES6+)
- Fetch API (AJAX)

### Database & Storage
- MySQL
- Local Media Handling (Pillow)

### Environment & Utilities
- python-dotenv (Environment Variable Isolation)
- Git & GitHub

---

## 📂 Project Structure

```
EchoVerse/
│
├── echoverse/      # Project configuration & settings
├── echo/           # Main application module
│   ├── models.py   # Database Schema (Users, Tracks, Favorites)
│   ├── views.py    # Core business logic & JSON API endpoints
│   ├── forms.py    # Input validation & security handling
│   ├── urls.py     # Application routing
│   ├── signals.py  # Automated profile creation triggers
│   └── templates/  # DTL templates & dynamic JS modules
│
├── media/          # Uploaded audio tracks & cover artwork
├── static/         # Custom styling, scripts, and static assets
└── manage.py
```

---

## 🚀 Local Deployment Setup

### Prerequisites
- Python 3.10+
- MySQL Server
- Git

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/Kavin-Thamil/EchoVerse.git
   cd EchoVerse
   ```

2. **Create and activate a virtual environment:**
   ```
   python -m venv venv
   ```
   - **Windows:** `venv\Scripts\activate`
   - **macOS / Linux:** `source venv/bin/activate`

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   DB_NAME=echoverse_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

5. **Apply database migrations:**
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Start the local server:**
   ```
   python manage.py runserver
   ```
   Open `[http://127.0.0.1:8000/](http://127.0.0.1:8000/)` in your browser.

---

## 📖 Key Engineering Learnings

Building EchoVerse provided practical engineering experience with:

- **Database Optimization:** Mapped relational schemas and optimized queries using Django ORM with MySQL to ensure efficient data retrieval.
- **Asynchronous Data Flow:** Integrated client-side Fetch API requests to perform seamless database mutations (favoriting, live search) without triggering full page reloads.
- **Security Engineering:** Isolated database credentials and application secrets using `.env` configurations to follow production standards.
- **Architecture & Maintainability:** Applied standard MVT pattern, decoupling business logic into views, forms, and custom signal handling.

---

## 👤 Author

**Kavin Thamil A**  
- **LinkedIn:** [linkedin.com/in/kavinthamil](https://linkedin.com/in/kavinthamil)  
- **GitHub:** [@Kavin-Thamil](https://github.com/Kavin-Thamil)  
- **Email:** kavinthamil01@gmail.com