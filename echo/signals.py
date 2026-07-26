from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Song


@receiver(post_delete, sender=Song)
def delete_song_files(sender, instance, **kwargs):
    """Delete media files when a Song is removed."""

    if instance.cover_image:
        instance.cover_image.delete(save=False)

    if instance.audio_file:
        instance.audio_file.delete(save=False)