import React, { useEffect, useState } from "react";
import axios from "axios";
import "./post.css";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
const baseURL = "http://localhost:8000";

const SinglePost = () => {
  const { postId } = useParams();
  const {
    state: { post },
  } = useLocation();
  console.log({ post, postId });
  return (
    <div>
      <div key={post.id} className="post">
        <div className="post-header">
          <img
            src={`${baseURL}${post.author_image}`}
            alt={post.author}
            className="author-image"
          />
          <h3>{post.author}</h3>
        </div>
        <div className="Title">
          <p>{post.title}</p>
        </div>
        <div className="Description">
          <p>{post.description}</p>
        </div>
        <img
          src={`${baseURL}${post.image}`}
          alt="Post"
          className="post-image"
        />
        <div>
          <FontAwesomeIcon icon={faThumbsUp} />
          LIKE {post?.likes ? post.likes.length : 0}
        </div>
        <div className="post-interactions">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="comment">
              <img
                src={`${baseURL}${comment.author_image}`}
                alt={comment.author}
                className="comment-author-image"
              />
              <p>
                <strong>{comment.author}</strong>: {comment.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
