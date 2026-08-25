import { supabase } from "../lib/supabase";

export async function getUserFriendIds(userId) {
    const { data, error } = await supabase
        .from("friendships")
        .select("requester_id, receiver_id")
        .eq("status", "ACCEPTED")
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
        throw error;
    }

    return (data || []).map((friendship) =>
        friendship.requester_id === userId
            ? friendship.receiver_id
            : friendship.requester_id
    );
}

export async function getFriendsCount(userId) {
    const { data, error } = await supabase.rpc(
        "get_friends_count",
        {
            target_user_id: userId,
        }
    );

    if (error) {
        throw error;
    }

    return data ?? 0;
}

export async function getMutualFriendsCount(userId, otherUserId) {
    if (!userId || !otherUserId || userId === otherUserId) {
        return 0;
    }

    const { data, error } = await supabase.rpc(
        "get_mutual_friends_count",
        {
            target_user_id: otherUserId,
        }
    );

    if (error) {
        throw error;
    }

    return data ?? 0;
}
export async function getFriendProfiles(userId) {
    const friendIds = await getUserFriendIds(userId);

    if (friendIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("profiles")
        .select(`
      id,
      display_name,
      avatar_url,
      level_current
    `)
        .in("id", friendIds);

    if (error) {
        throw error;
    }

    return data || [];
}

export async function getMutualFriendProfiles(
    userId,
    otherUserId
) {
    if (!userId || !otherUserId || userId === otherUserId) {
        return [];
    }

    const [myFriendIds, otherFriendIds] =
        await Promise.all([
            getUserFriendIds(userId),
            getUserFriendIds(otherUserId),
        ]);

    const myFriends = new Set(myFriendIds);

    const mutualIds = otherFriendIds.filter((friendId) =>
        myFriends.has(friendId)
    );

    if (mutualIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("profiles")
        .select(`
      id,
      display_name,
      avatar_url,
      level_current
    `)
        .in("id", mutualIds);

    if (error) {
        throw error;
    }

    return data || [];
}


