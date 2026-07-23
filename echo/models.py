from django.contrib.auth.models import User
from django.db import models


class Song(models.Model):
    """Represents a royalty-free song uploaded by a user."""

    title = models.CharField(max_length=200)

    artist = models.CharField(max_length=200)

    genre = models.CharField(max_length=100)

    cover_image = models.ImageField(upload_to="covers/")

    audio_file = models.FileField(upload_to="songs/")

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    favorites = models.ManyToManyField(
        User,
        related_name="favorite_songs",
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        """Return the song title."""
        return self.title