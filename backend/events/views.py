from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from .models import EventCategory, TimeSlot, UserPreference
from .serializers import EventCategorySerializer, TimeSlotSerializer, UserPreferenceSerializer
from datetime import datetime, time
from django.utils.timezone import make_aware
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator



class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = EventCategory.objects.all().order_by("name")
        serializer = EventCategorySerializer(categories, many=True)
        return Response(serializer.data)


class TimeSlotListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = TimeSlot.objects.select_related("category", "booked_by").all()

        category_id = request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date and end_date:
            start = parse_date(start_date)
            end = parse_date(end_date)

            if not start or not end:
                return Response(
                    {"detail": "Invalid start_date or end_date. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ⭐ Convert date → timezone-aware datetime
            start_dt = make_aware(datetime.combine(start, time.min))
            end_dt = make_aware(datetime.combine(end, time.max))

            qs = qs.filter(
                start_time__gte=start_dt,
                start_time__lte=end_dt
            )


        qs = qs.order_by("start_time")
        serializer = TimeSlotSerializer(qs, many=True)
        return Response(serializer.data)


class BookTimeSlotView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk: int):
        slot = get_object_or_404(TimeSlot, pk=pk)
        if slot.booked_by_id is not None:
            return Response(
                {"detail": "This timeslot is already booked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        slot.booked_by = request.user
        slot.save(update_fields=["booked_by"])
        serializer = TimeSlotSerializer(slot)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UnsubscribeTimeSlotView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk: int):
        slot = get_object_or_404(TimeSlot, pk=pk)
        if slot.booked_by_id is None:
            return Response(
                {"detail": "This timeslot is not booked."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if slot.booked_by_id != request.user.id:
            return Response(
                {"detail": "You can only unsubscribe from your own booking."},
                status=status.HTTP_403_FORBIDDEN,
            )

        slot.booked_by = None
        slot.save(update_fields=["booked_by"])
        serializer = TimeSlotSerializer(slot)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class LoginView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)

        return Response({"detail": "Logged in"})

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
        })

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"})

# views.py

class UserPreferenceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pref, _ = UserPreference.objects.get_or_create(user=request.user)
        serializer = UserPreferenceSerializer(pref)
        return Response(serializer.data)

    def post(self, request):
        pref, _ = UserPreference.objects.get_or_create(user=request.user)
        serializer = UserPreferenceSerializer(pref, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set"})