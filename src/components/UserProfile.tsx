'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserData {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

export default function UserProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const sid = searchParams.get('session');
    if (sid) {
      setSessionId(sid);
      fetchUserData(sid);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchUserData = async (sid: string) => {
    try {
      const response = await fetch(`/api/game/session?session=${sid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    router.push(`/api/twitch/logout?session=${sessionId}`);
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-2 rounded-lg">
      {user.profile_image_url && (
        <img
          src={user.profile_image_url}
          alt={user.display_name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{user.display_name}</span>
        <span className="text-xs text-gray-300">✅ متصل</span>
      </div>
      <button
        onClick={handleLogout}
        className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold transition"
      >
        تسجيل خروج
      </button>
    </div>
  );
}
