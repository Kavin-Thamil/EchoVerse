```markdown
# 🎧 EchoVerse — Full-Stack Royalty-Free Music Streaming Platform

EchoVerse is a dynamic web application built for streaming, discovering, and managing royalty-free music. Built with **Django** and **MySQL**, it features secure session management, asynchronous audio player controls, real-time search, and genre-based recommendation logic.

---

## 🌟 Key Features

* **User Authentication & Profiles:** Secure registration, authentication, session management, and custom profiles using Django Authentication & Signals.
* **Audio Streaming & Media Management:** Dynamic media handling and metadata management powered by Django ORM and MySQL.
* **Asynchronous UX (No Reloads):** Dynamic audio playback, instant liking/favoriting, and live search using JavaScript **Fetch API (AJAX)**.
* **Discovery Engine:** Search and filter by genre, artist, or title, featuring custom genre-matching recommendation logic.
* **Responsive UI/UX:** Dark-themed interface built with Bootstrap 5 and dynamic CSS for cross-device support.
* **Fault Tolerant:** Custom 404 and 500 error handling for production stability.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Backend** | Python 3.x, Django 6.x |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Fetch API, Bootstrap 5 |
| **Database** | MySQL |
| **Libraries & Utilities** | Pillow (Media Processing), python-dotenv |
| **Version Control** | Git, GitHub |

---

## 📂 Project Architecture


```

EchoVerse/
│
├── echoverse/      # Project settings, WSGI/ASGI, root URLs
├── echo/           # Main Django app
│   ├── models.py   # Database Schema (Users, Tracks, Favorites)
│   ├── views.py    # Business logic, query handling, JSON API endpoints
│   ├── forms.py    # Form validation & security
│   ├── urls.py     # App routing
│   ├── signals.py  # User profile automated triggers
│   └── templates/  # DTL views with async JS modules
│
├── media/          # Audio files & cover artwork
└── static/         # Custom styling, scripts, and static assets

```

---

## 🚀 Local Deployment Setup

### Prerequisites
* Python 3.10+
* MySQL Server
* Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Kavin-Thamil/EchoVerse.git](https://github.com/Kavin-Thamil/EchoVerse.git)
   cd EchoVerse

```

2. **Set up virtual environment:**
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

```


3. **Install dependencies:**
```bash
pip install -r requirements.txt

```


4. **Configure environment settings:**
Create a `.env` file in the project root:
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=echoverse_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306

```


5. **Run migrations & start server:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

```



---

## 💡 Technical Highlights & Design Decisions

* **ORM Optimization:** Used indexed relational mappings and targeted filtering to minimize database query overhead.
* **Security First:** Isolated sensitive keys and database credentials via `python-dotenv` environment variables.
* **Asynchronous Data Flow:** Replaced standard form posts with Fetch API requests to update UI states dynamically without full page reloads.

---

## 👤 Author

* **Kavin Thamil A**
* LinkedIn: [linkedin.com/in/kavinthamil](https://www.google.com/search?q=https://linkedin.com/in/kavinthamil)
* GitHub: [@Kavin-Thamil](https://www.google.com/search?q=https://github.com/Kavin-Thamil)
* Email: kavinthamil01@gmail.com



```

---

### Step 1 Action Item

Once you paste and save that in VS Code, run these three commands in your terminal:

```bash
git add README.md
git commit -m "docs: update EchoVerse README with enterprise architecture specs"
git push origin main

```