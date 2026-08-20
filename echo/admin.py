from django.contrib import admin
from .models import Song


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "artist",
        "genre",
        "uploaded_by",
        "created_at",
    )

    list_filter = (
        "genre",
        "created_at",
    )

    search_fields = (
        "title",
        "artist",
        "genre",
        "uploaded_by__username",
    )

    autocomplete_fields = ("uploaded_by",)

    readonly_fields = ("created_at",)

    ordering = ("-created_at",)