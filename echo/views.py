from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import RegisterForm, SongForm, UserProfileForm
from .models import Song, UserProfile


def _filter_songs(search_query="", genre=""):
    """Return a filtered queryset of songs."""

    songs = Song.objects.select_related("uploaded_by")

    if genre:
        songs = songs.filter(genre__iexact=genre)

    if search_query:
        songs = songs.filter(
            Q(title__icontains=search_query)
            | Q(artist__icontains=search_query)
        )

    return songs


def home(request):
    """Display the homepage."""

    selected_genre = request.GET.get("genre", "").strip()
    search_query = request.GET.get("search", "").strip()

    songs = _filter_songs(
        search_query=search_query,
        genre=selected_genre,
    )

    genres = (
        Song.objects.order_by("genre")
        .values_list("genre", flat=True)
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
    """Return filtered songs as JSON."""

    search_query = request.GET.get("search", "").strip()
    selected_genre = request.GET.get("genre", "").strip()

    songs = _filter_songs(
        search_query=search_query,
        genre=selected_genre,
    )

    return JsonResponse(
        {
            "songs": [
                {
                    "id": song.id,
                    "title": song.title,
                    "artist": song.artist,
                    "genre": song.genre,
                    "cover_image": song.cover_image.url,
                    "audio_file": song.audio_file.url,
                }
                for song in songs
            ]
        }
    )


@login_required
def upload_song(request):
    """Upload a new song."""

    if request.method == "POST":
        form = SongForm(request.POST, request.FILES)

        if form.is_valid():
            song = form.save(commit=False)
            song.uploaded_by = request.user
            song.save()
            messages.success(request, "Song uploaded successfully!")
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

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Account created! You can now log in.")
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

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            login(request, form.get_user())
            messages.success(request, f"Welcome back, {request.user.username}!")
            return redirect("home")
    else:
        form = AuthenticationForm(request)

    return render(
        request,
        "echo/login.html",
        {"form": form},
    )


@login_required
def user_logout(request):
    """Log out the current user."""

    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("home")


def song_detail(request, song_id):
    """Display a song and related songs with smart recommendations fallback."""

    song = get_object_or_404(
        Song.objects.select_related("uploaded_by").prefetch_related("favorites"),
        pk=song_id,
    )

    # 1. Try finding songs in the same genre first
    related_songs = list(
        Song.objects.filter(genre=song.genre)
        .exclude(pk=song.pk)
        .select_related("uploaded_by")[:3]
    )

    # 2. If we have fewer than 3, fallback to recent platform tracks to fill the recommendation slots
    if len(related_songs) < 3:
        needed = 3 - len(related_songs)
        exclude_ids = [song.pk] + [s.pk for s in related_songs]
        fallbacks = (
            Song.objects.exclude(pk__in=exclude_ids)
            .select_related("uploaded_by")
            .order_by("-created_at")[:needed]
        )
        related_songs.extend(list(fallbacks))

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

    profile_user = get_object_or_404(User, pk=user_id)

    user_songs = (
        Song.objects.filter(uploaded_by=profile_user)
        .select_related("uploaded_by")
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
def edit_profile(request):
    """Edit the current user's profile."""

    profile, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        form = UserProfileForm(request.POST, request.FILES, instance=profile)

        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated successfully!")
            return redirect("profile", user_id=request.user.id)
    else:
        form = UserProfileForm(instance=profile)

    return render(
        request,
        "echo/edit_profile.html",
        {"form": form},
    )


@login_required
def delete_song(request, song_id):
    """Delete one of the current user's songs."""

    song = get_object_or_404(
        Song,
        pk=song_id,
    )

    if song.uploaded_by != request.user:
        return HttpResponseForbidden(
            "You cannot delete this song."
        )

    if request.method == "POST":
        song.delete()
        messages.success(request, "Song deleted permanently.")
        return redirect("home")

    return render(
        request,
        "echo/delete_song.html",
        {"song": song},
    )


@login_required
def my_uploads(request):
    """Display the current user's uploaded songs."""

    songs = (
        Song.objects.filter(uploaded_by=request.user)
        .select_related("uploaded_by")
    )

    return render(
        request,
        "echo/my_uploads.html",
        {"songs": songs},
    )


@login_required
def toggle_favorite(request, song_id):
    """Toggle a song as a favorite."""

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Method not allowed.",
            },
            status=405,
        )

    song = get_object_or_404(
        Song.objects.prefetch_related("favorites"),
        pk=song_id,
    )

    if song.favorites.filter(pk=request.user.pk).exists():
        song.favorites.remove(request.user)
        is_favorited = False
    else:
        song.favorites.add(request.user)
        is_favorited = True

    return JsonResponse(
        {
            "success": True,
            "is_favorited": is_favorited,
            "favorites_count": song.favorites.count(),
        }
    )


@login_required
def my_favorites(request):
    """Display the current user's favorite songs."""

    songs = (
        request.user.favorite_songs.select_related("uploaded_by")
        .all()
    )

    return render(
        request,
        "echo/my_favorites.html",
        {"songs": songs},
    )