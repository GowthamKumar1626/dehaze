from django.urls import path
from dehaze.views import ResultsView, DatasetUploadView

urlpatterns = [
    path('record/', ResultsView.as_view(), name='post-record'),
    path('record/<uuid:guid>/', ResultsView.as_view(), name='get-result'),
    path('dataset/', DatasetUploadView.as_view(), name='dataset-upload'),
]
