# 🎵 EchoVerse

> A royalty-free music streaming platform built with Django.

EchoVerse is a full-stack web application where users can upload, discover, stream, and organize royalty-free music in a clean, modern interface.

This project started as a way for me to learn Django by building something practical rather than following tutorials. Throughout development I combined my own programming, debugging, and design decisions with AI-assisted development for brainstorming, problem solving, and code reviews. The result is a project that reflects both my learning journey and modern software development practices.

---

## ✨ What You Can Do

### 🎧 Listen & Discover
- Stream royalty-free music with an integrated audio player
- Search by title, artist, or genre
- Browse detailed song pages
- Discover similar music through related song recommendations

### 👤 Create Your Account
- Register and log in securely
- Customize your public profile with an avatar and bio
- View another user's uploaded songs

### 📤 Share Music
- Upload royalty-free tracks
- Add cover artwork
- Organize songs using genres
- Manage everything from your personal uploads page

### ❤️ Save Favorites
- Favorite or unfavorite songs instantly without refreshing the page
- Keep your favorite tracks in a dedicated library

### 📱 Enjoy Anywhere
- Responsive layout for desktop and mobile
- Clean dark-themed interface built with Bootstrap 5

---

# 🛠 Tech Stack

### Backend
- Python
- Django

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- Fetch API

### Database
- SQLite

---

# 📂 Project Structure

```
EchoVerse/
│
├── echoverse/      # Django project configuration
├── echo/           # Main Django application
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   ├── admin.py
│   ├── signals.py
│   └── templates/
│
├── media/          # Uploaded images, music and avatars
├── static/         # CSS, JavaScript and assets
└── manage.py
```

---

# 🚀 Running the Project

Clone the repository:

```bash
git clone https://github.com/yourusername/EchoVerse.git
cd EchoVerse
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

Open your browser and visit:

```
http://127.0.0.1:8000/
```

---

# 📸 Screenshots

*Coming soon.*

---

# 📖 What I Learned

Building EchoVerse gave me hands-on experience with:

- Django Models & ORM
- Authentication & Authorization
- File Upload Handling
- CRUD Operations
- Template Inheritance
- Django Forms
- JavaScript Fetch API
- Asynchronous UI Updates
- Responsive Web Design
- Django Admin Customization

More importantly, it taught me how to work through real development problems, iterate on features, refactor code, and use AI as a development tool rather than a replacement for understanding.

---

# 🚧 Future Improvements

- Django REST Framework API
- Playlists
- Better music recommendations
- PostgreSQL support
- AWS deployment
- Docker support
- Cloud media storage
- Audio visualizer

---

# 🙏 Acknowledgements

EchoVerse was developed by me as a personal learning project. AI tools were used throughout development for brainstorming, debugging, explaining concepts, and reviewing code, while the overall implementation, feature decisions, testing, and iterative development were completed by me. I believe modern software development is strongest when developers combine their own understanding with the right tools.

---

## ⭐ If you enjoyed the project, consider giving it a star!