from django.urls import path

from . import views


urlpatterns = [
    # Home
    path("", views.home, name="home"),
    path("search/", views.search_songs, name="search_songs"),

    # Authentication
    path("register/", views.register, name="register"),
    path("login/", views.user_login, name="login"),
    path("logout/", views.user_logout, name="logout"),

    # Songs
    path("upload/", views.upload_song, name="upload_song"),
    path("song/<int:song_id>/", views.song_detail, name="song_detail"),
    path(
        "song/<int:song_id>/delete/",
        views.delete_song,
        name="delete_song",
    ),
    path(
        "song/<int:song_id>/favorite/",
        views.toggle_favorite,
        name="toggle_favorite",
    ),

    # User
    path("profile/edit/", views.edit_profile, name="edit_profile"),
    path("profile/<int:user_id>/", views.profile, name="profile"),
    path("my-uploads/", views.my_uploads, name="my_uploads"),
    path("my-favorites/", views.my_favorites, name="my_favorites"),
]