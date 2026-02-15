from django.urls import path

from .admin_views import (
    AdminBookingListView,
    AdminTimeSlotListView,
    AdminUserListView,
    AdminUserStatusUpdateView,
)

urlpatterns = [
    path("users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("users/<int:pk>/", AdminUserStatusUpdateView.as_view(), name="admin-user-status-update"),
    path("bookings/", AdminBookingListView.as_view(), name="admin-booking-list"),
    path("timeslots/", AdminTimeSlotListView.as_view(), name="admin-timeslot-list"),
]
