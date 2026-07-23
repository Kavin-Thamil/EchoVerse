from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Song


class SongForm(forms.ModelForm):
    """Form for uploading royalty-free songs."""

    class Meta:
        model = Song
        fields = [
            "title",
            "artist",
            "genre",
            "cover_image",
            "audio_file",
        ]

        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter song title",
                }
            ),
            "artist": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter artist name",
                }
            ),
            "genre": forms.Select(
                attrs={
                    "class": "form-select",
                }
            ),
            "cover_image": forms.ClearableFileInput(
                attrs={
                    "class": "form-control",
                }
            ),
            "audio_file": forms.ClearableFileInput(
                attrs={
                    "class": "form-control",
                }
            ),
        }

        labels = {
            "title": "Song Title",
            "artist": "Artist",
            "genre": "Genre",
            "cover_image": "Cover Image",
            "audio_file": "Audio File",
        }

        help_texts = {
            "cover_image": (
                "Upload a square image for the best appearance."
            ),
            "audio_file": (
                "Supported formats: MP3, WAV, OGG."
            ),
        }


class RegisterForm(UserCreationForm):
    """User registration form."""

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter username",
            }
        )
    )

    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter email",
            }
        )
    )

    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter password",
            }
        )
    )

    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Confirm password",
            }
        )
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password1",
            "password2",
        ]