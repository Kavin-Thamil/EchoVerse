from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended profile for user accounts."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )
    bio = models.TextField(
        max_length=500,
        blank=True
    )

    def __str__(self):
        """Return a string representation of the profile."""
        return f"{self.user.username}'s Profile"

    def delete(self, *args, **kwargs):
        """Delete the associated avatar file before removing the profile."""
        if self.avatar:
            self.avatar.delete(save=False)
        super().delete(*args, **kwargs)


# Signals to automatically create and save UserProfile when a User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a user profile automatically when a new User is registered."""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the user profile automatically when the User is saved."""
    instance.profile.save()


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
        related_name="uploaded_songs",
    )

    favorites = models.ManyToManyField(
        User,
        related_name="favorite_songs",
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["title"]),
            models.Index(fields=["genre"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        """Return the song title."""
        return self.title

    @property
    def favorites_count(self):
        """Return the number of users who favorited the song."""
        return self.favorites.count()

    def delete(self, *args, **kwargs):
        """Delete the associated media files before removing the song."""

        if self.cover_image:
            self.cover_image.delete(save=False)

        if self.audio_file:
            self.audio_file.delete(save=False)

        super().delete(*args, **kwargs)