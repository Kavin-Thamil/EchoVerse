from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.http import HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import RegisterForm, SongForm
from .models import Song


def home(request):
    """Display the homepage with optional search and genre filters."""

    songs = Song.objects.all()

    selected_genre = request.GET.get("genre")
    search_query = request.GET.get("search")

    if selected_genre:
        songs = songs.filter(
            genre__iexact=selected_genre
        )

    if search_query:
        songs = songs.filter(
            title__icontains=search_query
        )

    genres = (
        Song.objects.values_list(
            "genre",
            flat=True,
        )
        .distinct()
    )

    return render(
        request,
        "echo/home.html",
        {
            "songs": songs,
            "genres": genres,
            "selected_genre": selected_genre,
            "search_query": search_query,
        },
    )


def search_songs(request):
    """Return songs as JSON for AJAX search."""

    songs = Song.objects.all()

    search_query = request.GET.get("search")
    selected_genre = request.GET.get("genre")

    if selected_genre:
        songs = songs.filter(
            genre__iexact=selected_genre
        )

    if search_query:
        songs = songs.filter(
            title__icontains=search_query
        )

    data = [
        {
            "id": song.id,
            "title": song.title,
            "genre": song.genre,
            "cover_image": song.cover_image.url,
            "audio_file": song.audio_file.url,
        }
        for song in songs
    ]

    return JsonResponse(
        {
            "songs": data,
        }
    )


@login_required
def upload_song(request):
    """Upload a new song."""

    if request.method == "POST":
        form = SongForm(
            request.POST,
            request.FILES,
        )

        if form.is_valid():
            song = form.save(commit=False)
            song.uploaded_by = request.user
            song.save()

            return redirect("home")

    else:
        form = SongForm()

    return render(
        request,
        "echo/upload.html",
        {"form": form},
    )


def register(request):
    """Register a new user."""

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("login")

    else:
        form = RegisterForm()

    return render(
        request,
        "echo/register.html",
        {"form": form},
    )


def user_login(request):
    """Authenticate and log in a user."""

    if request.method == "POST":
        form = AuthenticationForm(
            data=request.POST
        )

        if form.is_valid():
            login(
                request,
                form.get_user(),
            )
            return redirect("home")

    else:
        form = AuthenticationForm()

    return render(
        request,
        "echo/login.html",
        {"form": form},
    )


def user_logout(request):
    """Log out the current user."""

    logout(request)
    return redirect("home")


def song_detail(request, song_id):
    """Display details for a single song."""

    song = get_object_or_404(
        Song,
        id=song_id,
    )

    related_songs = (
        Song.objects.filter(
            genre=song.genre
        )
        .exclude(id=song.id)[:3]
    )

    return render(
        request,
        "echo/song_detail.html",
        {
            "song": song,
            "related_songs": related_songs,
        },
    )


def profile(request, user_id):
    """Display a user's public profile."""

    profile_user = get_object_or_404(
        User,
        id=user_id,
    )

    user_songs = Song.objects.filter(
        uploaded_by=profile_user
    )

    return render(
        request,
        "echo/profile.html",
        {
            "profile_user": profile_user,
            "user_songs": user_songs,
        },
    )


@login_required
def delete_song(request, song_id):
    """Delete a song uploaded by the current user."""

    song = get_object_or_404(
        Song,
        id=song_id,
    )

    if song.uploaded_by != request.user:
        return HttpResponseForbidden(
            "You cannot delete this song."
        )

    if request.method == "POST":
        song.delete()
        return redirect("home")

    return render(
        request,
        "echo/delete_song.html",
        {"song": song},
    )


@login_required
def my_uploads(request):
    """Display songs uploaded by the current user."""

    songs = Song.objects.filter(
        uploaded_by=request.user
    )

    return render(
        request,
        "echo/my_uploads.html",
        {"songs": songs},
    )


@login_required
def toggle_favorite(request, song_id):
    """Add or remove a song from the user's favorites."""

    song = get_object_or_404(
        Song,
        id=song_id,
    )

    if request.user in song.favorites.all():
        song.favorites.remove(request.user)
        is_favorited = False
    else:
        song.favorites.add(request.user)
        is_favorited = True

    return JsonResponse({
        "success": True,
        "is_favorited": is_favorited,
        "favorites_count": song.favorites.count(),
    })


@login_required
def my_favorites(request):
    """Display the user's favorite songs."""

    songs = request.user.favorite_songs.all()

    return render(
        request,
        "echo/my_favorites.html",
        {"songs": songs},
    )