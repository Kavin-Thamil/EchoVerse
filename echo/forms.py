from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Song


class SongForm(forms.ModelForm):
    """Form for uploading royalty-free songs."""

    class Meta:
        model = Song
        fields = (
            "title",
            "artist",
            "genre",
            "cover_image",
            "audio_file",
        )

        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter song title",
                    "maxlength": 200,
                    "autocomplete": "off",
                }
            ),
            "artist": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter artist name",
                    "maxlength": 200,
                    "autocomplete": "off",
                }
            ),
            "genre": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "e.g. Ambient, Synthwave, Lo-fi",
                    "maxlength": 100,
                    "autocomplete": "off",
                }
            ),
            "cover_image": forms.ClearableFileInput(
                attrs={
                    "class": "form-control",
                    "accept": "image/*",
                }
            ),
            "audio_file": forms.ClearableFileInput(
                attrs={
                    "class": "form-control",
                    "accept": ".mp3,.wav,.ogg,audio/*",
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
            "title": "Choose a clear, descriptive title.",
            "artist": "Name of the artist or creator.",
            "genre": "Examples: Ambient, Lo-fi, Orchestral, Synthwave.",
            "cover_image": "Recommended: square image (1000×1000 or larger).",
            "audio_file": "Supported formats: MP3, WAV, OGG.",
        }

    def clean_title(self):
        return self.cleaned_data["title"].strip()

    def clean_artist(self):
        return self.cleaned_data["artist"].strip()

    def clean_genre(self):
        return self.cleaned_data["genre"].strip()


class RegisterForm(UserCreationForm):
    """User registration form."""

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter username",
                "autocomplete": "username",
            }
        )
    )

    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter email",
                "autocomplete": "email",
            }
        )
    )

    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter password",
                "autocomplete": "new-password",
            }
        )
    )

    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Confirm password",
                "autocomplete": "new-password",
            }
        )
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password1",
            "password2",
        )

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                "An account with this email address already exists."
            )

        return email