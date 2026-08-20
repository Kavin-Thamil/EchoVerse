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
        return f"{self.user.username}'s Profile"


# Signals to automatically create and save UserProfile when a User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
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
        return self.title

    @property
    def favorites_count(self):
        return self.favorites.count()