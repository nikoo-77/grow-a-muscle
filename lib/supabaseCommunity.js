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

export async function createPost({ user_id, content, image_url }) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id, content, image_url }])
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

export async function addComment({ post_id, user_id, content }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, user_id, content }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- LIKES ---
export async function fetchLikes(post_id) {
  const { data, error } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', post_id);
  if (error) throw error;
  return data;
}

export async function likePost({ post_id, user_id }) {
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', post_id)
    .eq('user_id', user_id)
    .single();
  if (existing) return existing;
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
