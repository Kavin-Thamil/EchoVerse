# EchoVerse

EchoVerse is a cozy, independent royalty-free music streaming platform built with Django[cite: 1, 4]. Crafted by a solo developer with AI assistance, it's designed to give music lovers and independent creators a clean, responsive space to discover, upload, organize, and favorite music[cite: 1, 3, 4].

---

## Features

- **User registration and authentication:** Easily create new accounts or securely log in and out of the platform[cite: 3, 4].
- **Track uploading:** Share royalty-free songs complete with titles, artist names, comma-separated genres, cover images (up to 5MB), and audio files (up to 20MB in MP3, WAV, or OGG formats)[cite: 2, 3].
- **Music streaming:** Listen to tracks using interactive elements and audio URLs embedded directly into the responsive layout[cite: 1].
- **Search and discovery:** Find music instantly by searching through titles, artists, and genre keywords[cite: 3].
- **Genre filtering:** Explore music dynamically using interactive genre tags and filter pills on the homepage or song detail views[cite: 1, 3].
- **Song detail pages:** Explore individual tracks with detailed metadata, creator links, favorite counters, and smart related song recommendations[cite: 2, 3, 4].
- **Asynchronous favorites:** Heart or unheart tracks instantly using asynchronous JavaScript requests without refreshing the page[cite: 3, 4].
- **Personal uploads dashboard:** View and manage all the songs you have personally contributed to the platform[cite: 3, 4].
- **Personal favorites dashboard:** Keep track of your favorite liked songs in one convenient place[cite: 3, 4].
- **Public user profiles:** Check out creator profiles, complete with custom avatars (up to 2MB), biographies, and total upload counts[cite: 2, 3, 4].
- **Responsive interface:** Enjoy a polished, dark-themed experience that looks great on both desktop and mobile devices using Bootstrap 5[cite: 1, 4].
- **Django Admin integration:** Manage site content efficiently through a customized admin panel featuring advanced search fields, filters, and automated file cleanup signals[cite: 4].

---

## Tech Stack

### Backend
- Powered by Python[cite: 4].
- Built on the Django web framework[cite: 4].

### Frontend
- HTML5 and CSS3 styling[cite: 1].
- Bootstrap 5 for responsive components[cite: 1].
- JavaScript with the Fetch API for asynchronous actions[cite: 4].

### Database
- SQLite for lightweight development storage[cite: 4].

---

## Project Structure

- `echoverse/`: The core project configuration directory containing global `settings.py`, root URL patterns in `urls.py`, WSGI configuration, and administrative management tools[cite: 4].
- `echo/`: The primary Django application folder encompassing data models (`models.py`), views (`views.py`), forms (`forms.py`), application URL configurations (`urls.py`), admin definitions (`admin.py`), app configurations (`apps.py`), and automated signal handlers (`signals.py`)[cite: 2, 3, 4].
- `templates/echo/`: The template directory housing responsive HTML views including `base.html`, `home.html`, `song_detail.html`, `upload_song.html`, `register.html`, `login.html`, `profile.html`, `edit_profile.html`, `my_uploads.html`, `my_favorites.html`, and `delete_song.html`[cite: 1, 2, 3, 4].
- `media/`: The designated media storage location for uploaded user content, including song cover art, audio tracks, and user profile avatars[cite: 3, 4].