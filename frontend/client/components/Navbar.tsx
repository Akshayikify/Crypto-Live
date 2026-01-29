import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Monitor, Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Market", href: "/market" },
    { label: "Wallet", href: "/wallet" },
    { label: "About", href: "/about" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-smooth"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent hidden sm:inline">
              CryptoLive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Theme Toggle & Auth */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center gap-1 glass-sm p-1">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "p-1.5 rounded-lg transition-smooth",
                  theme === "light"
                    ? "bg-white/20 dark:bg-black/30"
                    : "hover:bg-white/10",
                )}
                title="Light theme"
              >
                <Sun size={18} className="text-yellow-500" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-1.5 rounded-lg transition-smooth",
                  theme === "dark"
                    ? "bg-white/20 dark:bg-black/30"
                    : "hover:bg-white/10",
                )}
                title="Dark theme"
              >
                <Moon size={18} className="text-slate-400" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "p-1.5 rounded-lg transition-smooth",
                  theme === "system"
                    ? "bg-white/20 dark:bg-black/30"
                    : "hover:bg-white/10",
                )}
                title="System theme"
              >
                <Monitor
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>

            {/* Auth Button */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 glass-sm px-4 py-2 hover:bg-white/20 dark:hover:bg-black/30 transition-smooth">
                  <span className="text-sm font-medium">Login</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 glass-sm"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 animate-in fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
