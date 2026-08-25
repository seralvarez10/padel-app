import { useEffect, useState } from "react";

import {
  getFriends,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/matchService";

export default function useFriends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadFriends() {
    try {
      setLoading(true);
      setError(null);

      const [friendsData, requestsData] =
        await Promise.all([
          getFriends(),
          getPendingFriendRequests(),
        ]);

      setFriends(friendsData);
      setRequests(requestsData);
    } catch (err) {
      console.error(
        "Error cargando amigos:",
        err
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest(id) {
    await acceptFriendRequest(id);
    await loadFriends();
  }

  async function rejectRequest(id) {
    await rejectFriendRequest(id);
    await loadFriends();
  }

  useEffect(() => {
    loadFriends();
  }, []);

  return {
    friends,
    requests,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    reload: loadFriends,
  };
}