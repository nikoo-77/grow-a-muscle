import { supabase } from './supabaseClient';

// --- POSTS ---
export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPost({ user_id, content, image_url, image_urls }) {
  // If image_urls is provided and image_url is not, set image_url to the first image for backward compatibility
  let singleImageUrl = image_url;
  if (!singleImageUrl && Array.isArray(image_urls) && image_urls.length > 0) {
    singleImageUrl = image_urls[0];
  }
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id, content, image_url: singleImageUrl, image_urls }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- IMAGE UPLOAD ---
export async function uploadPostImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const { error } = await supabase.storage
    .from('community-posts')
    .upload(fileName, file, { upsert: false });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage
    .from('community-posts')
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

// --- COMMENTS ---
export async function fetchComments(post_id) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment({ post_id, user_id, content, image_url }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, user_id, content, image_url }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- LIKES ---
export async function fetchLikes(post_id) {
  const { data, error } = await supabase
    .from('post_likes')
    .select('*', { head: false })
    .eq('post_id', post_id);
  if (error) throw error;
  return data;
}

export async function likePost({ post_id, user_id }) {
  // Check if this specific user has already liked this post
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', post_id)
    .eq('user_id', user_id)
    .maybeSingle();
  
  // If this user has already liked the post, return the existing like
  if (existing) return existing;
  
  // Otherwise, create a new like for this user
  const { data, error } = await supabase
    .from('post_likes')
    .insert([{ post_id, user_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unlikePost({ post_id, user_id }) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', post_id)
    .eq('user_id', user_id);
  if (error) throw error;
  return true;
}

// --- USER PROFILES ---
export async function fetchUserProfiles(userIds) {
  if (!userIds || userIds.length === 0) return [];
  const { data, error } = await supabase
    .from('users')
    .select('id, profile_picture, first_name, last_name')
    .in('id', userIds);
  if (error) throw error;
  return data;
}

// --- DELETE POST ---
export async function deletePost(post_id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', post_id);
  if (error) throw error;
  return true;
}

// --- DELETE COMMENT ---
export async function deleteComment(comment_id) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', comment_id);
  if (error) throw error;
  return true;
}
