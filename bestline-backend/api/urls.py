from django.urls import path
from .views import (
    OddsView,
    EventOddsView,
    SnapshotCreateView,
    SnapshotListView,
    BestPriceView,
    SnapshotDetailView,
    TrackedLineListCreateView,
    TrackedLineDetailView,
    TrackedLineStakeUpdateView,
)

urlpatterns = [
    path("odds", OddsView.as_view()),
    path("event-odds", EventOddsView.as_view()),

    path("snapshots", SnapshotCreateView.as_view()),
    path("snapshots/list", SnapshotListView.as_view()),
    path("snapshots/<str:snapshot_id>", SnapshotDetailView.as_view()),

    path("best-price", BestPriceView.as_view()),

    path("tracking", TrackedLineListCreateView.as_view()),
    path("tracking/<str:tracking_id>", TrackedLineDetailView.as_view()),
    path("tracking/<str:tracking_id>/stake", TrackedLineStakeUpdateView.as_view()),
]