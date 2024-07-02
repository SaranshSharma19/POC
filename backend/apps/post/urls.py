from django.urls import path
from .views import *

urlpatterns = [
    # path('like/<int:postId>/' , PostLikeView.as_view(), name='like' ),
    # path('remove-like/<int:postId>/' , PostRemoveLikeView.as_view(), name='remove-like' ),
    # path('dislike/<int:postId>/' , PostDislikeView.as_view(), name='remove-like' ),
    path('like/<int:post_id>/', LikePostAPIView.as_view(), name='like_post'),
    path('dislike/<int:post_id>/', DislikePostAPIView.as_view(), name='dislike_post'),
]

