from django.conf import settings
from django.db import models


class EventCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class TimeSlot(models.Model):
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    booked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.category} | {self.start_time} - {self.end_time}"
