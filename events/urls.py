from django.urls import path

from .views import (
    BookTimeSlotView,
    CategoryListView,
    TimeSlotListView,
    UnsubscribeTimeSlotView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("timeslots/", TimeSlotListView.as_view(), name="timeslot-list"),
    path("timeslots/<int:pk>/book/", BookTimeSlotView.as_view(), name="timeslot-book"),
    path(
        "timeslots/<int:pk>/unsubscribe/",
        UnsubscribeTimeSlotView.as_view(),
        name="timeslot-unsubscribe",
    ),
]
