import { Heart, Shield, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-card-border">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="SkinSide Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-bold text-foreground">SkinSide</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting patients to safe, ethical dermatology clinical trials in Dublin.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">For Patients</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/learn-more" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Patient Support</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-card-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SkinSide. All rights reserved. | Registered in Ireland</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
