import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <Heart className="h-6 w-6 text-white" />
          </div> */}
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
          <Button variant="healthcare" size="sm">
            Get Started
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;