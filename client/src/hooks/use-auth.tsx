import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { toast } = useToast();

  // Modified query to better handle 401s and add detailed error logging
  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: (failureCount, error: any) => {
      console.log('Auth query failed:', { failureCount, error });
      // Don't retry on 401s
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('User not authenticated');
            return null;
          }
          throw new Error('Failed to fetch user data');
        }

        return response.json();
      } catch (error) {
        console.error('Auth query error:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        console.log('Attempting login...');
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include',
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Login failed:', data);
          throw new Error(data.error || '로그인에 실패했습니다');
        }

        console.log('Login successful');
        return response.json();
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
      }
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(['/api/auth/user'], user);
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log('Attempting logout...');
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Logout failed:', data);
          throw new Error(data.error || '로그아웃에 실패했습니다');
        }

        console.log('Logout successful');
      } catch (error) {
        console.error('Logout error:', error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      toast({
        title: "로그아웃",
        description: "안전하게 로그아웃되었습니다",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "로그아웃 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}