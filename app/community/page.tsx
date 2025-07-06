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
  deletePost,
  deleteComment
} from "../../lib/supabaseCommunity";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SignInPromptModal from "../components/SignInPromptModal";

// Modal for viewing images
interface ImageModalProps {
  open: boolean;
  imageUrl: string;
  name?: string;
  onClose: () => void;
}
function ImageModal({ open, imageUrl, name, onClose }: ImageModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-full max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <img src={imageUrl} alt="Profile or post" className="max-h-[70vh] max-w-[90vw] rounded-xl object-contain mb-2" />
        {name && <div className="text-lg font-semibold text-[#222] text-center mt-2">{name}</div>}
      </div>
    </div>
  );
}

// Instagram-like image carousel for post images
function PostImageCarousel({ images, onImageClick }: { images: string[]; onImageClick?: (url: string) => void }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);

  if (!images || images.length === 0) return null;

  const goLeft = (e: React.MouseEvent) => {
    if (animating) return;
    e.stopPropagation();
    setPrev(current);
    setDirection('left');
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    setAnimating(true);
  };
  const goRight = (e: React.MouseEvent) => {
    if (animating) return;
    e.stopPropagation();
    setPrev(current);
    setDirection('right');
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    setAnimating(true);
  };

  // After animation, reset prev to current and stop animating
  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => {
        setPrev(current);
        setAnimating(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [animating, current]);

  // Animation classes
  const transition = 'transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]';
  const baseImg = 'absolute top-0 left-0 w-full h-full rounded-xl max-h-80 object-contain border border-[#e0e5dc] cursor-pointer';

  let prevClass = '';
  let currClass = '';
  if (animating) {
    if (direction === 'right') {
      prevClass = `${transition} z-10 opacity-100 translate-x-0`;
      currClass = `${transition} z-20 opacity-100 translate-x-full`;
    } else {
      prevClass = `${transition} z-10 opacity-100 translate-x-0`;
      currClass = `${transition} z-20 opacity-100 -translate-x-full`;
    }
  } else {
    prevClass = 'hidden';
    currClass = `${transition} z-20 opacity-100 translate-x-0`;
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-full overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 350 }}>
        {/* Previous image (slides out) */}
        {animating && prev !== current && (
          <img
            key={prev}
            src={images[prev]}
            alt="Post image prev"
            className={
              baseImg +
              ' pointer-events-none max-h-[340px] md:max-h-[480px]' +
              (direction === 'right'
                ? ' translate-x-0 opacity-100 ' + transition
                : ' translate-x-0 opacity-100 ' + transition)
              + (direction === 'right' ? ' animate-slide-left' : ' animate-slide-right')
            }
            style={{ zIndex: 10 }}
          />
        )}
        {/* Current image (slides in) */}
        <img
          key={current}
          src={images[current]}
          alt="Post image"
          className={
            baseImg +
            ' pointer-events-auto max-h-[340px] md:max-h-[480px]' +
            (animating
              ? direction === 'right'
                ? ' translate-x-full opacity-100 ' + transition
                : ' -translate-x-full opacity-100 ' + transition
              : ' translate-x-0 opacity-100 ' + transition)
          }
          style={{ zIndex: 20 }}
          onClick={() => onImageClick && onImageClick(images[current])}
        />
        {/* Left arrow */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-30 transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 pointer-events-auto"
              onClick={goLeft}
              aria-label="Previous image"
              type="button"
              disabled={animating}
            >
              <svg className="w-6 h-6 text-[#60ab66]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            {/* Right arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-30 transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 pointer-events-auto"
              onClick={goRight}
              aria-label="Next image"
              type="button"
              disabled={animating}
            >
              <svg className="w-6 h-6 text-[#60ab66]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="flex gap-1 justify-center absolute bottom-2 left-0 right-0 z-10">
            {images.map((_, i) => (
              <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === current ? 'bg-[#60ab66]' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [commentImages, setCommentImages] = useState<{ [key: string]: File | null }>({});
  const [commenting, setCommenting] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [likes, setLikes] = useState<{ [key: string]: any[] }>({});
  const [liking, setLiking] = useState<{ [key: string]: boolean }>({});
  const [likeAnimation, setLikeAnimation] = useState<{ [key: string]: boolean }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: { profile_picture?: string; first_name?: string; last_name?: string } }>({});
  const [currentUserProfile, setCurrentUserProfile] = useState<{ profile_picture?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const commentFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Modal state for deletion
  const [deleteModal, setDeleteModal] = useState<
    | { type: "post"; id: string }
    | { type: "comment"; postId: string; commentId: string }
    | null
  >(null);
  const [deleting, setDeleting] = useState(false);

  // Modal for viewing images
  const [imageModal, setImageModal] = useState<{ url: string; name?: string } | null>(null);
  
  // Modal for sign-in prompt
  const [signInModal, setSignInModal] = useState<{ open: boolean; action: string }>({ open: false, action: "" });

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
      // Only fetch data for real posts, not temporary ones
      if (!post.id.startsWith('temp-post-')) {
        fetchLikes(post.id).then((likesArr) => setLikes((l) => ({ ...l, [post.id]: likesArr })));
        fetchComments(post.id).then((commentsArr) => setComments((c) => ({ ...c, [post.id]: commentsArr })));
      }
    });
  }, [posts]);

  // Real-time likes
  useEffect(() => {
    const channel = supabase
      .channel("public:post_likes")
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, (payload: any) => {
        // Handle both INSERT and DELETE events
        if (payload.new && payload.new.post_id) {
          // New like added
          fetchLikes(payload.new.post_id).then((likesArr) => 
            setLikes((l) => ({ ...l, [payload.new.post_id]: likesArr }))
          );
        } else if (payload.old && payload.old.post_id) {
          // Like removed
          fetchLikes(payload.old.post_id).then((likesArr) => 
            setLikes((l) => ({ ...l, [payload.old.post_id]: likesArr }))
          );
        }
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Real-time comments
  useEffect(() => {
    const channel = supabase
      .channel("public:comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, (payload: any) => {
        // Only refetch comments for the specific post that changed
        if (payload.new && payload.new.post_id) {
          fetchComments(payload.new.post_id).then((commentsArr) => 
            setComments((c) => ({ ...c, [payload.new.post_id]: commentsArr }))
          );
        }
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

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
    if (!user) {
      setSignInModal({ open: true, action: "create a post" });
      return;
    }
    if (!newPost.trim() && imageFiles.length === 0) return;
    setUploading(true);
    
    let image_urls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        image_urls = await Promise.all(imageFiles.map(file => uploadPostImage(file)));
      } catch (e) {
        const err = e as any;
        alert(err?.message || err?.details || JSON.stringify(err));
        setUploading(false);
        return;
      }
    }

    // Create temporary post for immediate display
    const tempId = `temp-post-${Date.now()}`;
    const tempPost = {
      id: tempId,
      user_id: user.id,
      content: newPost,
      image_url: image_urls[0] || null,
      image_urls,
      created_at: new Date().toISOString(),
      user_profile: {
        first_name: userProfiles[user.id]?.first_name,
        last_name: userProfiles[user.id]?.last_name,
        profile_picture: userProfiles[user.id]?.profile_picture
      }
    };

    // Immediately add to posts list
    setPosts((prev) => [tempPost, ...prev]);
    
    // Clear form immediately
    setNewPost("");
    setImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const realPost = await createPost({ user_id: user.id, content: newPost, image_url: image_urls[0] || null, image_urls });
      
      // Replace temporary post with real post data
      setPosts((prev) => prev.map(p => p.id === tempId ? realPost : p));
      // Clean up temporary data
      setLikes((l) => {
        const newLikes = { ...l };
        delete newLikes[tempId];
        return newLikes;
      });
      setComments((c) => {
        const newComments = { ...c };
        delete newComments[tempId];
        return newComments;
      });
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
      // Remove the temporary post if there was an error
      setPosts((prev) => prev.filter(p => p.id !== tempId));
      // Clean up temporary data
      setLikes((l) => {
        const newLikes = { ...l };
        delete newLikes[tempId];
        return newLikes;
      });
      setComments((c) => {
        const newComments = { ...c };
        delete newComments[tempId];
        return newComments;
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      setSignInModal({ open: true, action: "like posts" });
      return;
    }
    setLiking((l) => ({ ...l, [postId]: true }));
    
    const currentLikes = likes[postId] || [];
    const userLiked = currentLikes.some((like) => like.user_id === user.id);
    
    // Optimistic update - immediately update the UI
    if (userLiked) {
      // Remove like optimistically
      setLikes((l) => ({
        ...l,
        [postId]: currentLikes.filter((like) => like.user_id !== user.id)
      }));
    } else {
      // Add like optimistically
      const optimisticLike = {
        id: `temp-like-${Date.now()}`,
        post_id: postId,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      setLikes((l) => ({
        ...l,
        [postId]: [...currentLikes, optimisticLike]
      }));
      // Trigger animation for new likes
      setLikeAnimation((a) => ({ ...a, [postId]: true }));
      setTimeout(() => {
        setLikeAnimation((a) => ({ ...a, [postId]: false }));
      }, 300);
    }
    
    try {
      if (userLiked) {
        await unlikePost({ post_id: postId, user_id: user.id });
      } else {
        await likePost({ post_id: postId, user_id: user.id });
      }
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
      // Revert optimistic update on error
      if (userLiked) {
        // Re-add the like that was optimistically removed
        setLikes((l) => ({
          ...l,
          [postId]: [...currentLikes]
        }));
      } else {
        // Remove the like that was optimistically added
        setLikes((l) => ({
          ...l,
          [postId]: currentLikes
        }));
      }
    } finally {
      setLiking((l) => ({ ...l, [postId]: false }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      setSignInModal({ open: true, action: "add comments" });
      return;
    }
    if (!commentInputs[postId]?.trim() && !commentImages[postId]) return;
    
    // Set commenting state to prevent double-clicks
    setCommenting((c) => ({ ...c, [postId]: true }));
    
    const commentContent = commentInputs[postId];
    const commentImage = commentImages[postId];
    const tempId = `temp-${Date.now()}`;
    
    let image_url = null;
    if (commentImage) {
      try {
        image_url = await uploadPostImage(commentImage);
      } catch (e) {
        const err = e as any;
        alert(err?.message || err?.details || JSON.stringify(err));
        setCommenting((c) => ({ ...c, [postId]: false }));
        return;
      }
    }
    
    const newComment = {
      id: tempId, // Temporary ID until real one comes from server
      post_id: postId,
      user_id: user.id,
      content: commentContent,
      image_url,
      created_at: new Date().toISOString(),
      // Add user profile info for immediate display
      user_profile: {
        first_name: userProfiles[user.id]?.first_name,
        last_name: userProfiles[user.id]?.last_name,
        profile_picture: userProfiles[user.id]?.profile_picture
      }
    };

    // Immediately add to local state for instant feedback
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    
    // Clear input and image immediately
    setCommentInputs((inputs) => ({ ...inputs, [postId]: "" }));
    setCommentImages((images) => ({ ...images, [postId]: null }));
    if (commentFileInputRefs.current[postId]) {
      commentFileInputRefs.current[postId].value = "";
    }

    try {
      const realComment = await addComment({ post_id: postId, user_id: user.id, content: commentContent, image_url });
      
      // Replace temporary comment with real comment data
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map(c => 
          c.id === tempId ? realComment : c
        )
      }));
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
      // Remove the temporary comment if there was an error
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== tempId)
      }));
    } finally {
      // Reset commenting state
      setCommenting((c) => ({ ...c, [postId]: false }));
    }
  };

  const handleDeletePost = (postId: string) => {
    setDeleteModal({ type: "post", id: postId });
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setDeleteModal({ type: "comment", postId, commentId });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      if (deleteModal.type === "post") {
        await deletePost(deleteModal.id);
        setPosts((prev) => prev.filter((p) => p.id !== deleteModal.id));
      } else if (deleteModal.type === "comment") {
        await deleteComment(deleteModal.commentId);
        setComments((prev) => ({
          ...prev,
          [deleteModal.postId]: prev[deleteModal.postId].filter((c) => c.id !== deleteModal.commentId),
        }));
      }
      setDeleteModal(null);
    } catch (e) {
      const err = e as any;
      alert(err?.message || err?.details || JSON.stringify(err));
    } finally {
      setDeleting(false);
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
        {user ? (
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <img
                src={currentUserProfile?.profile_picture || "/logo1.png"}
                alt="Your avatar"
                className="w-14 h-14 rounded-full border-2 border-[#60ab66] object-cover cursor-pointer"
                onClick={() => setImageModal({ url: currentUserProfile?.profile_picture || "/logo1.png" })}
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
              <div className="flex-1 flex items-center gap-3">
                {/* Custom file input */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles(files.slice(0, 5)); // Limit to 5
                    }}
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#60ab66]/10 text-[#60ab66] rounded-xl font-semibold transition-all duration-200 hover:bg-[#60ab66]/20 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                    </svg>
                    Choose Image
                  </button>
                </div>
                
                {/* Selected file display */}
                {imageFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-[#e0e5dc]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFiles(files => files.filter((_, i) => i !== idx));
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute top-0 right-0 bg-white/80 text-red-500 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <span className="text-sm text-gray-400">{newPost.length}/280</span>
              <button
                onClick={handlePost}
                className="bg-[#60ab66] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
                disabled={(!newPost.trim() && imageFiles.length === 0) || uploading}
              >
                {uploading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 text-center">
            <div className="w-16 h-16 bg-[#60ab66]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#60ab66]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2e3d27] mb-2">Join the Conversation!</h3>
            <p className="text-gray-600 mb-4">
              Sign in to share your progress, ask questions, and connect with the fitness community.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/signup"
                className="px-6 py-2 bg-[#60ab66] text-white rounded-xl font-semibold hover:bg-[#6ed076] transition-colors"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-6 py-2 text-[#60ab66] border border-[#60ab66] rounded-xl font-semibold hover:bg-[#60ab66]/10 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
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
              const isTempPost = post.id.startsWith('temp-post-');
              const postUserProfile = post.user_profile || userProfiles[post.user_id];
              
              const postImages: string[] = post.image_urls && Array.isArray(post.image_urls) && post.image_urls.length > 0
                ? post.image_urls
                : post.image_url ? [post.image_url] : [];
              
              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-2 relative group hover:shadow-3xl transition-all duration-300 ${isTempPost ? 'opacity-75' : ''}`}
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={postUserProfile?.profile_picture || "/logo1.png"}
                      alt="User avatar"
                      className="w-14 h-14 rounded-full border-2 border-[#60ab66] object-cover cursor-pointer"
                      onClick={() => setImageModal({ url: postUserProfile?.profile_picture || "/logo1.png", name: postUserProfile?.first_name || postUserProfile?.last_name ? `${postUserProfile?.first_name || ""} ${postUserProfile?.last_name || ""}`.trim() : undefined })}
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#222] text-lg">
                          {post.user_id === user?.id
                            ? "You"
                            : postUserProfile?.first_name || postUserProfile?.last_name
                            ? `${postUserProfile?.first_name || ""} ${postUserProfile?.last_name || ""}`.trim()
                            : "User"}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {new Date(post.created_at).toLocaleString()}
                          {isTempPost && " (sending...)"}
                        </span>
                        {/* Delete post button - only show for non-temp posts */}
                        {post.user_id === user?.id && !isTempPost && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded transition"
                            title="Delete post"
                            disabled={deleting}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-[#222] text-base mb-1 whitespace-pre-line">{post.content}</p>
                      <PostImageCarousel images={postImages} onImageClick={url => setImageModal({ url })} />
                      <div className="flex gap-6 mt-1">
                        <button
                          className={`flex items-center gap-1 font-semibold transition-all duration-300 transform hover:scale-105 ${
                            userLiked ? "text-[#2e3d27]" : "text-[#60ab66] hover:text-[#2e3d27]"
                          } ${liking[post.id] ? 'animate-pulse' : ''} ${likeAnimation[post.id] ? 'like-bounce' : ''}`}
                          onClick={() => handleLike(post.id)}
                          disabled={liking[post.id] || isTempPost}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-all duration-300 ${userLiked ? 'scale-110' : 'scale-100'}`}
                            fill={userLiked ? "#60ab66" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="transition-all duration-300">{postLikes.length}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 text-[#60ab66] hover:text-[#2e3d27] font-semibold transition"
                          onClick={() => {
                            document.getElementById(`comment-input-${post.id}`)?.focus();
                          }}
                          disabled={isTempPost}
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
                      {(comments[post.id] || []).map((comment) => {
                        // Handle both regular comments and temporary comments
                        const isTempComment = comment.id.startsWith('temp-');
                        const commentUserProfile = comment.user_profile || userProfiles[comment.user_id];
                        
                        return (
                          <div
                            key={comment.id}
                            className={`flex gap-2 items-start bg-[#f6f9f6] rounded-xl px-4 py-2 ${isTempComment ? 'opacity-75' : ''}`}
                          >
                            <img
                              src={commentUserProfile?.profile_picture || "/logo1.png"}
                              alt="User avatar"
                              className="w-8 h-8 rounded-full border border-[#60ab66] object-cover cursor-pointer"
                              onClick={() => setImageModal({ url: commentUserProfile?.profile_picture || "/logo1.png", name: commentUserProfile?.first_name || commentUserProfile?.last_name ? `${commentUserProfile?.first_name || ""} ${commentUserProfile?.last_name || ""}`.trim() : undefined })}
                            />
                            <div>
                              <span className="font-bold text-[#222] text-sm mr-2">
                                {comment.user_id === user?.id
                                  ? "You"
                                  : commentUserProfile?.first_name || commentUserProfile?.last_name
                                  ? `${commentUserProfile?.first_name || ""} ${commentUserProfile?.last_name || ""}`.trim()
                                  : "User"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.created_at).toLocaleString()}
                                {isTempComment && " (sending...)"}
                              </span>
                              {/* Delete comment button - only show for non-temp comments */}
                              {comment.user_id === user?.id && !isTempComment && (
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="ml-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded transition"
                                  title="Delete comment"
                                  disabled={deleting}
                                >
                                  Delete
                                </button>
                              )}
                              <p className="text-[#222] text-base whitespace-pre-line">{comment.content}</p>
                              {comment.image_url && (
                                <img
                                  src={comment.image_url}
                                  alt="Comment image"
                                  className="rounded-lg max-h-60 object-contain border border-[#e0e5dc] mt-2 cursor-pointer"
                                  onClick={() => setImageModal({ url: comment.image_url })}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Add comment */}
                    {user ? (
                      <div className="flex gap-2 mt-2 items-start">
                        <img
                          src={userProfiles[user.id]?.profile_picture || "/logo1.png"}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full border border-[#60ab66] object-cover cursor-pointer"
                          onClick={() => setImageModal({ url: userProfiles[user.id]?.profile_picture || "/logo1.png", name: userProfiles[user.id]?.first_name || userProfiles[user.id]?.last_name ? `${userProfiles[user.id]?.first_name || ""} ${userProfiles[user.id]?.last_name || ""}`.trim() : undefined })}
                        />
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            id={`comment-input-${post.id}`}
                            className="flex-1 bg-white rounded-xl p-2 text-base border border-[#e0e5dc] focus:outline-none focus:ring-2 focus:ring-[#60ab66] resize-none min-h-[32px] text-[#222] disabled:opacity-50"
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
                            disabled={commenting[post.id]}
                          />
                          
                          {/* Comment image upload */}
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                ref={(el) => {
                                  commentFileInputRefs.current[post.id] = el;
                                }}
                                className="hidden"
                                onChange={(e) => setCommentImages((images) => ({ ...images, [post.id]: e.target.files?.[0] || null }))}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const fileInput = commentFileInputRefs.current[post.id];
                                  if (fileInput) fileInput.click();
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-[#60ab66]/10 text-[#60ab66] rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#60ab66]/20 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50"
                                disabled={commenting[post.id]}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Image
                              </button>
                            </div>
                            
                            {/* Selected comment image display */}
                            {commentImages[post.id] && (
                              <div className="flex items-center gap-2 bg-[#f6f9f6] rounded-lg px-2 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#60ab66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-[#222] truncate max-w-[150px]">{commentImages[post.id] ? commentImages[post.id]!.name : ""}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCommentImages((images) => ({ ...images, [post.id]: null }));
                                    const fileInput = commentFileInputRefs.current[post.id];
                                    if (fileInput) fileInput.value = "";
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="bg-[#60ab66] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
                          disabled={(!commentInputs[post.id]?.trim() && !commentImages[post.id]) || commenting[post.id]}
                        >
                          {commenting[post.id] ? "Commenting..." : "Comment"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-[#f6f9f6] rounded-xl text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Sign in to join the conversation
                        </p>
                        <div className="flex gap-2 justify-center">
                          <a
                            href="/signup"
                            className="px-3 py-1 bg-[#60ab66] text-white rounded-lg text-sm font-semibold hover:bg-[#6ed076] transition-colors"
                          >
                            Sign Up
                          </a>
                          <a
                            href="/login"
                            className="px-3 py-1 text-[#60ab66] border border-[#60ab66] rounded-lg text-sm font-semibold hover:bg-[#60ab66]/10 transition-colors"
                          >
                            Sign In
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <ConfirmDeleteModal
          open={!!deleteModal}
          onCancel={() => setDeleteModal(null)}
          onDelete={confirmDelete}
          message={
            deleteModal?.type === "post"
              ? "Are you sure you want to delete this post? This action cannot be undone."
              : deleteModal?.type === "comment"
              ? "Are you sure you want to delete this comment? This action cannot be undone."
              : undefined
          }
        />
        <ImageModal
          open={!!imageModal}
          imageUrl={imageModal?.url || ""}
          name={imageModal?.name}
          onClose={() => setImageModal(null)}
        />
        <SignInPromptModal
          open={signInModal.open}
          action={signInModal.action}
          onClose={() => setSignInModal({ open: false, action: "" })}
        />
        <style jsx>{`
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
          
          @keyframes likeBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .like-bounce {
            animation: likeBounce 0.3s ease-in-out;
          }

          @layer utilities {
            .animate-slide-left {
              animation: slideLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
            }
            .animate-slide-right {
              animation: slideRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
            }
            @keyframes slideLeft {
              0% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(-100%); opacity: 0.7; }
            }
            @keyframes slideRight {
              0% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(100%); opacity: 0.7; }
            }
          }
        `}</style>
      </div>  
    </>
  );
}