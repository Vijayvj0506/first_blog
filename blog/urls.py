from django.urls import path
from .views import post_list_create_view, post_detail_view

app_name = 'blog'

urlpatterns = [
    path('posts/', post_list_create_view, name='post-list'),
    path('posts/<int:pk>/', post_detail_view, name='post-detail'),
]
