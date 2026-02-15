from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .admin_serializers import (
    AdminBookingSerializer,
    AdminTimeSlotSerializer,
    AdminUserListSerializer,
    AdminUserStatusUpdateSerializer,
)
from .models import TimeSlot


class AdminUserListView(APIView):
    """List all users for admin and staff users."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by("id")
        serializer = AdminUserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserStatusUpdateView(APIView):
    """Activate or deactivate a user account for admin and staff users."""

    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk: int):
        user = get_object_or_404(User, pk=pk)
        serializer = AdminUserStatusUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(AdminUserListSerializer(user).data, status=status.HTTP_200_OK)


class AdminBookingListView(APIView):
    """List all bookings with user and timeslot details for admin and staff users."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        bookings = (
            TimeSlot.objects.select_related("category", "booked_by")
            .filter(booked_by__isnull=False)
            .order_by("start_time")
        )
        serializer = AdminBookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminTimeSlotListView(APIView):
    """List all timeslots for admin and staff users."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        slots = TimeSlot.objects.select_related("category", "booked_by").all().order_by("start_time")
        serializer = AdminTimeSlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
