"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import {
  fetchPosts,
  createPost,
  uploadPostImage,
  fetchComments,
  addComment,
  fetchLikes,
  likePost,
  unlikePost,
  fetchUserProfiles,
} from "../../lib/supabaseCommunity";

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [likes, setLikes] = useState<{ [key: string]: any[] }>({});
  const [liking, setLiking] = useState<{ [key: string]: boolean }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: { profile_picture?: string; first_name?: string; last_name?: string } }>({});
  const [currentUserProfile, setCurrentUserProfile] = useState<{ profile_picture?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  // Real-time posts
  useEffect(() => {
    const channel = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        fetchPosts().then(setPosts);
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Fetch likes and comments for each post
  useEffect(() => {
    posts.forEach((post) => {
      fetchLikes(post.id).then((likesArr) => setLikes((l) => ({ ...l, [post.id]: likesArr })));
      fetchComments(post.id).then((commentsArr) => setComments((c) => ({ ...c, [post.id]: commentsArr })));
    });
  }, [posts]);

  // Real-time likes
  useEffect(() => {
    const channel = supabase
      .channel("public:post_likes")
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => {
        posts.forEach((post) => fetchLikes(post.id).then((likesArr) => setLikes((l) => ({ ...l, [post.id]: likesArr }))));
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [posts]);

  // Real-time comments
  useEffect(() => {
    const channel = supabase
      .channel("public:comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        posts.forEach((post) => fetchComments(post.id).then((commentsArr) => setComments((c) => ({ ...c, [post.id]: commentsArr }))));
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [posts]);

  // Fetch user profiles for all posts and comments
  useEffect(() => {
    const allUserIds = new Set<string>();
    posts.forEach((post) => allUserIds.add(post.user_id));
    Object.values(comments).flat().forEach((comment) => allUserIds.add(comment.user_id));
    if (allUserIds.size > 0) {
      fetchUserProfiles(Array.from(allUserIds)).then((profiles) => {
        const map: { [key: string]: { profile_picture?: string; first_name?: string; last_name?: string } } = {};
        profiles.forEach((profile) => {
          map[profile.id] = profile;
        });
        setUserProfiles(map);
      });
    }
  }, [posts, comments]);

  // Real-time user profile updates
  useEffect(() => {
    const channel = supabase
      .channel("public:users")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
        const allUserIds = new Set<string>();
        posts.forEach((post) => allUserIds.add(post.user_id));
        Object.values(comments).flat().forEach((comment) => allUserIds.add(comment.user_id));
        if (allUserIds.size > 0) {
          fetchUserProfiles(Array.from(allUserIds)).then((profiles) => {
            const map: { [key: string]: { profile_picture?: string; first_name?: string; last_name?: string } } = {};
            profiles.forEach((profile) => {
              map[profile.id] = profile;
            });
            setUserProfiles(map);
          });
        }
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [posts, comments]);

  // Fetch current user's profile for post creation avatar
  useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .select("profile_picture")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setCurrentUserProfile(data));
    }
  }, [user]);

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setUploading(true);
    let image_url = null;
    if (imageFile) {
      try {
        image_url = await uploadPostImage(imageFile);
      } catch (e) {
        const err = e as any;
        alert(err?.message || err?.details || JSON.stringify(err));
        setUploading(false);
        return;
      }
    }
    try {
      await createPost({ user_id: user.id, content: newPost, image_url });
      setNewPost("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
    }
    setUploading(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    setLiking((l) => ({ ...l, [postId]: true }));
    const userLiked = likes[postId]?.some((like) => like.user_id === user.id);
    try {
      if (userLiked) {
        await unlikePost({ post_id: postId, user_id: user.id });
      } else {
        await likePost({ post_id: postId, user_id: user.id });
      }
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
    }
    setLiking((l) => ({ ...l, [postId]: false }));
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return;
    try {
      await addComment({ post_id: postId, user_id: user.id, content: commentInputs[postId] });
      setCommentInputs((inputs) => ({ ...inputs, [postId]: "" }));
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-16 px-4 bg-white mt-32">
        <h1 className="text-4xl font-bold mb-2 text-center text-[#222]">Community</h1>
        <p className="text-lg text-center mb-8 text-[#60ab66]">
          Share your progress, ask questions, and connect with others!
        </p>
        {/* Post creation box */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <img
              src={currentUserProfile?.profile_picture || "/logo1.png"}
              alt="Your avatar"
              className="w-14 h-14 rounded-full border-2 border-[#60ab66] object-cover"
            />
            <textarea
              className="flex-1 bg-white rounded-xl p-4 text-lg border border-[#e0e5dc] focus:outline-none focus:ring-2 focus:ring-[#60ab66] resize-none min-h-[60px] text-[#222]"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={280}
              disabled={uploading}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#60ab66]/10 file:text-[#60ab66] hover:file:bg-[#60ab66]/20"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            <span className="text-sm text-gray-400 flex-1">{newPost.length}/280</span>
            <button
              onClick={handlePost}
              className="bg-[#60ab66] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
              disabled={!newPost.trim() || uploading}
            >
              {uploading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        {/* Posts feed */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center min-h-[200px]">
              <span className="text-gray-500">No posts yet. Be the first to share something!</span>
            </div>
          ) : (
            posts.map((post) => {
              const postLikes = likes[post.id] || [];
              const userLiked = user && postLikes.some((like) => like.user_id === user.id);
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 relative group hover:shadow-3xl transition-all duration-300"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={userProfiles[post.user_id]?.profile_picture || "/logo1.png"}
                      alt="User avatar"
                      className="w-14 h-14 rounded-full border-2 border-[#60ab66] object-cover"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#222] text-lg">
                          {post.user_id === user?.id
                            ? "You"
                            : userProfiles[post.user_id]?.first_name || userProfiles[post.user_id]?.last_name
                            ? `${userProfiles[post.user_id]?.first_name || ""} ${userProfiles[post.user_id]?.last_name || ""}`.trim()
                            : "User"}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#222] text-base mb-3 whitespace-pre-line">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Post image"
                          className="rounded-xl max-h-80 object-contain border border-[#e0e5dc] mb-3"
                        />
                      )}
                      <div className="flex gap-6 mt-auto">
                        <button
                          className={`flex items-center gap-1 font-semibold transition ${
                            userLiked ? "text-[#2e3d27]" : "text-[#60ab66] hover:text-[#2e3d27]"
                          }`}
                          onClick={() => handleLike(post.id)}
                          disabled={liking[post.id]}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill={userLiked ? "#60ab66" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 9l-2-2-2 2m0 6l2 2 2-2"
                            />
                          </svg>
                          {postLikes.length}
                        </button>
                        <button
                          className="flex items-center gap-1 text-[#60ab66] hover:text-[#2e3d27] font-semibold transition"
                          onClick={() => {
                            document.getElementById(`comment-input-${post.id}`)?.focus();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z"
                            />
                          </svg>
                          {comments[post.id]?.length || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Comments */}
                  <div className="mt-2">
                    <div className="flex flex-col gap-2">
                      {(comments[post.id] || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-2 items-start bg-[#f6f9f6] rounded-xl px-4 py-2"
                        >
                          <img
                            src={userProfiles[comment.user_id]?.profile_picture || "/logo1.png"}
                            alt="User avatar"
                            className="w-8 h-8 rounded-full border border-[#60ab66] object-cover"
                          />
                          <div>
                            <span className="font-bold text-[#222] text-sm mr-2">
                              {comment.user_id === user?.id
                                ? "You"
                                : userProfiles[comment.user_id]?.first_name || userProfiles[comment.user_id]?.last_name
                                ? `${userProfiles[comment.user_id]?.first_name || ""} ${userProfiles[comment.user_id]?.last_name || ""}`.trim()
                                : "User"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                            <p className="text-[#222] text-base whitespace-pre-line">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Add comment */}
                    {user && (
                      <div className="flex gap-2 mt-2 items-start">
                        <img
                          src={userProfiles[user.id]?.profile_picture || "/logo1.png"}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full border border-[#60ab66] object-cover"
                        />
                        <textarea
                          id={`comment-input-${post.id}`}
                          className="flex-1 bg-white rounded-xl p-2 text-base border border-[#e0e5dc] focus:outline-none focus:ring-2 focus:ring-[#60ab66] resize-none min-h-[32px] text-[#222]"
                          placeholder="Add a comment..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((inputs) => ({
                              ...inputs,
                              [post.id]: e.target.value,
                            }))
                          }
                          maxLength={200}
                          rows={1}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="bg-[#60ab66] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <style jsx>{`
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    </>
  );
}