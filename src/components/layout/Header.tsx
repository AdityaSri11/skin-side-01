import { Button } from "@/components/ui/button";
import { Heart, Menu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

import logo from "@/assets/logo.png";

interface HeaderProps {
  onAIMatchClick?: () => void;
}

const Header = ({ onAIMatchClick }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        setUserRole(roleData?.role || null);
      } else {
        setUserRole(null);
      }
    };

    fetchUserAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: roleData }) => {
            setUserRole(roleData?.role || null);
          });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SkinSide Logo"
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">SkinSide</span>
            <span className="text-xs text-muted-foreground">Dublin, Ireland</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/trials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Find Trials
          </Link>
          <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Profile
          </Link>
          {userRole !== 'doctor' && (
            <Link to="/doctor-auth">
              <Button variant="outline" size="sm">
                Doctor Login
              </Button>
            </Link>
          )}
          {user ? (
            <Button variant="healthcare" size="sm" onClick={onAIMatchClick}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Match
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="healthcare" size="sm">
                Get Started
              </Button>
            </Link>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;