from django.urls import path
from .views import OddsView, EventOddsView, SnapshotCreateView, SnapshotListView, BestPriceView

urlpatterns = [
    path("odds", OddsView.as_view()),
    path("event-odds", EventOddsView.as_view()),
    path("snapshots", SnapshotCreateView.as_view()),
    path("snapshots/list", SnapshotListView.as_view()),
    path("best-price", BestPriceView.as_view()),
]
