from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Song, UserProfile


@receiver(post_delete, sender=Song)
def delete_song_files(sender, instance, **kwargs):
    """Delete media files when a Song is removed."""
    try:
        if instance.cover_image:
            instance.cover_image.delete(save=False)

        if instance.audio_file:
            instance.audio_file.delete(save=False)
    except OSError:
        # File is locked by the OS (common on Windows dev servers) 
        # or already missing. Ignore so it doesn't crash the DB transaction.
        pass


@receiver(post_delete, sender=UserProfile)
def delete_profile_avatar(sender, instance, **kwargs):
    """Delete the avatar file when a UserProfile is removed."""
    try:
        if instance.avatar:
            instance.avatar.delete(save=False)
    except OSError:
        pass