from rest_framework import serializers
from .models import EventCategory, TimeSlot, UserPreference
from django.contrib.auth.models import User


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ("id", "name")


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")

class TimeSlotSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    booked_by = UserBasicSerializer(read_only=True)

    class Meta:
        model = TimeSlot
        fields = (
            "id",
            "category",
            "category_name",
            "start_time",
            "end_time",
            "booked_by",
        )
        read_only_fields = ("booked_by",)


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ("categories",)
