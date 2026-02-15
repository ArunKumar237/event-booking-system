from django.contrib.auth.models import User
from rest_framework import serializers

from .models import TimeSlot


class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_active", "is_staff")


class AdminUserStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("is_active",)


class AdminBookedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_active")


class AdminTimeSlotSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    booked_by = AdminBookedBySerializer(read_only=True)

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


class AdminBookingSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    user = AdminBookedBySerializer(source="booked_by", read_only=True)

    class Meta:
        model = TimeSlot
        fields = (
            "id",
            "category",
            "category_name",
            "start_time",
            "end_time",
            "user",
        )
