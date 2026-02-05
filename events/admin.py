from django.contrib import admin

from .models import EventCategory, TimeSlot


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ("category", "start_time", "end_time", "booked_by")
    list_filter = ("category",)
    search_fields = ("category__name", "booked_by__username")
