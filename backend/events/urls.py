from django.urls import path

from .views import (
    BookTimeSlotView,
    CategoryListView,
    LoginView,
    LogoutView,
    MeView,
    TimeSlotListView,
    UnsubscribeTimeSlotView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("timeslots/", TimeSlotListView.as_view(), name="timeslot-list"),
    path("timeslots/<int:pk>/book/", BookTimeSlotView.as_view(), name="timeslot-book"),
    path(
        "timeslots/<int:pk>/unsubscribe/",
        UnsubscribeTimeSlotView.as_view(),
        name="timeslot-unsubscribe",
    ),
]
