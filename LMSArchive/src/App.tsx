/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Book as BookIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Home,
  Filter, 
  User, 
  Shield, 
  LogOut,
  ChevronRight,
  Library,
  BookOpen,
  Star,
  StarHalf,
  Calendar,
  Hash,
  X,
  Moon,
  Sun,
  ArrowUpDown,
  Sparkles,
  BarChart3,
  Map as MapIcon,
  MessageSquare,
  Activity,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

// --- Types ---
interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  year: number;
  status: "available" | "borrowed";
  image: string;
  reservations?: string[];
  rating?: number;
  ratingCount?: number;
}

interface BorrowingRecord {
  id: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue";
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  mediumUrl: string;
}

type Role = "student" | "employee" | "admin";
type SortField = "title" | "author" | "year";
type SortOrder = "asc" | "desc";

interface UserProfile {
  name: string;
  institute: string;
  age: number;
  department: string;
  status: string;
  profileImage: string;
}

// --- App Component ---
export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [role, setRole] = useState<Role>("student");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<"inventory" | "genres" | "profile" | "recommendations" | "security" | "analytics" | "map" | "blog">("inventory");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<BorrowingRecord[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [visibleBooksCount, setVisibleBooksCount] = useState(7);
  const [visibleBlogsCount, setVisibleBlogsCount] = useState(3);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogModalImage, setBlogModalImage] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "The Future of Digital Archiving: Insights from 1984",
      excerpt: "Exploring how high-density vision matrices are revolutionizing volume indexing in modern libraries, inspired by the themes of Orwell's 1984.",
      author: "Dr. Archi Vist",
      date: "2026-05-10",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
      category: "ANALYTICS",
      mediumUrl: "https://medium.com/search?q=1984+George+Orwell+book+review"
    },
    {
      id: "2",
      title: "Reader Sentiment Analysis: A New Metric for The Alchemist",
      excerpt: "Understanding the impact of reader recalibration on the global sentiment index of classical literature like Paulo Coelho's masterpiece.",
      author: "Librarian Prime",
      date: "2026-05-12",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
      category: "LITERATURE",
      mediumUrl: "https://medium.com/search?q=The+Alchemist+Paulo+Coelho+review"
    },
    {
      id: "3",
      title: "Preserving the Classics: The Hobbit and Beyond",
      excerpt: "New containment protocols initiated to protect high-value first editions like Tolkien's The Hobbit from environmental degradation.",
      author: "Master Curator",
      date: "2026-05-13",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
      category: "CURATION",
      mediumUrl: "https://medium.com/search?q=The+Hobbit+Tolkien+book+review"
    },
    {
      id: "4",
      title: "Psychology of Money: A Modern Re-evaluation",
      excerpt: "How Morgan Housel's insights are being integrated into our financial literacy archives.",
      author: "Econ Specialist",
      date: "2026-05-14",
      image: "https://images.unsplash.com/photo-1550565118-3d1bbbde8f02?auto=format&fit=crop&q=80&w=800",
      category: "FINANCE",
      mediumUrl: "https://medium.com/search?q=The+Psychology+of+Money+Morgan+Housel+review"
    },
    {
      id: "5",
      title: "The Silent Patient: Psychological Thriller Indexing",
      excerpt: "Analyzing the circulation spikes of modern thrillers in our high-security digital sectors.",
      author: "Dr. Mind",
      date: "2026-05-15",
      image: "https://images.unsplash.com/photo-1518373714866-3f1478210930?auto=format&fit=crop&q=80&w=800",
      category: "CRIME",
      mediumUrl: "https://medium.com/search?q=The+Silent+Patient+Alex+Michaelides+review"
    }
  ]);

  // Fetch data
  useEffect(() => {
    fetchBooks();
    fetchHistory();
    fetchProfile();
    
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const scrollToSection = (id: string, section: "inventory" | "genres" | "profile" | "recommendations" | "security" | "analytics" | "map") => {
    setActiveSection(section);
    if (section !== "genres") setSelectedCategory(null);
  };

  const scrollToInventory = () => scrollToSection("inventory-section", "inventory");
  const scrollToProfile = () => scrollToSection("profile-section", "profile");
  const scrollToRecommendations = () => scrollToSection("recommendations-section", "recommendations");
  const scrollToSecurity = () => scrollToSection("security-section", "security");
  const scrollToAnalytics = () => scrollToSection("analytics-section", "analytics");
  const scrollToMap = () => scrollToSection("map-section", "map");

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileUpdate({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = async (book: Omit<Book, "id">) => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (res.ok) {
        fetchBooks();
        setIsModalOpen(false);
        setModalImage(null);
      }
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleUpdateBook = async (id: string, book: Partial<Book>) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (res.ok) {
        fetchBooks();
        setIsModalOpen(false);
        setEditingBook(null);
        setModalImage(null);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) fetchBooks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogModalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlogPost = (post: Omit<BlogPost, "id">) => {
    const newPost = { ...post, id: Math.random().toString(36).substr(2, 9) };
    setBlogPosts(prev => [newPost, ...prev]);
    setIsBlogModalOpen(false);
    setBlogModalImage(null);
  };

  const handleUpdateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setIsBlogModalOpen(false);
    setEditingBlogPost(null);
    setBlogModalImage(null);
  };

  const handleDeleteBlogPost = (id: string) => {
    if (!confirm("Are you sure you want to delete this transmission?")) return;
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleReserveBook = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    const currentReservations = book.reservations || [];
    const userName = "Marie Curie"; // Current logged in user for demo

    if (currentReservations.includes(userName)) {
      alert("System Alert: You have already secured a reservation for this volume.");
      return;
    }

    const updatedReservations = [...currentReservations, userName];

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservations: updatedReservations }),
      });
      if (res.ok) {
        fetchBooks();
        setViewingBook(prev => prev ? { ...prev, reservations: updatedReservations } : null);
      }
    } catch (err) {
      console.error("Reservation request transmission failure", err);
    }
  };

  const handleBorrowBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}/borrow`, { method: "POST" });
      if (res.ok) {
        fetchBooks();
        fetchHistory();
        setViewingBook(null);
      }
    } catch (err) {
      console.error("Borrow failed", err);
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}/return`, { method: "POST" });
      if (res.ok) {
        fetchBooks();
        fetchHistory();
        setViewingBook(null);
      }
    } catch (err) {
      console.error("Return failed", err);
    }
  };

  const handleRateBook = async (id: string, newRating: number) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    const currentRating = book.rating || 0;
    const currentCount = book.ratingCount || 0;
    
    // Simple average calculation for demo
    const newCount = currentCount + 1;
    const updatedRating = Number(((currentRating * currentCount + newRating) / newCount).toFixed(1));

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating: updatedRating, 
          ratingCount: newCount 
        }),
      });
      if (res.ok) {
        fetchBooks();
        setViewingBook(prev => prev ? { ...prev, rating: updatedRating, ratingCount: newCount } : null);
        alert("System Update: Reader sentiment index recalibrated.");
      }
    } catch (err) {
      console.error("Rating submission failure", err);
    }
  };

  const sortBooks = (bookList: Book[]) => {
    return [...bookList].sort((a, b) => {
      let comparison = 0;
      if (sortField === "year") {
        comparison = a.year - b.year;
      } else {
        comparison = a[sortField].toLowerCase().localeCompare(b[sortField].toLowerCase());
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const processedBooks = sortBooks(books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  }));

  const canManage = role === "employee" || role === "admin";

  const getRecommendations = () => {
    const borrowedBookTitles = history.map(h => h.bookTitle);
    const borrowedBooks = books.filter(b => borrowedBookTitles.includes(b.title));
    const borrowedCategories = borrowedBooks.map(b => b.category);
    
    if (borrowedCategories.length === 0) return [];

    const categoryCounts: Record<string, number> = {};
    borrowedCategories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return books.filter(b => 
      sortedCategories.includes(b.category) && 
      !borrowedBookTitles.includes(b.title)
    ).slice(0, 8);
  };

  const recommendedBooks = getRecommendations();

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-text-primary font-sans selection:bg-brand-red selection:text-white transition-colors duration-300">
      {/* Utility Bar */}
      <div className="bg-brand-dark border-b border-border-main h-auto sm:h-8 flex flex-col sm:flex-row items-center px-4 py-2 sm:py-0 justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary shrink-0 gap-2 sm:gap-0">
        <div className="flex gap-4 sm:gap-6 items-center flex-wrap justify-center">
          <button 
            onClick={() => setRole("student")}
            className={cn("h-full flex items-center cursor-pointer transition-colors px-2 py-1 sm:py-0", role === "student" ? "text-brand-red border-b-2 border-brand-red" : "hover:text-text-primary")}
          >
            User Portal
          </button>
          <button 
            onClick={() => setRole("employee")}
            className={cn("h-full flex items-center cursor-pointer transition-colors px-2 py-1 sm:py-0", role === "employee" ? "text-brand-red border-b-2 border-brand-red" : "hover:text-text-primary")}
          >
            Staff Portal
          </button>
          <button 
            onClick={() => setRole("admin")}
            className={cn("h-full flex items-center cursor-pointer transition-colors px-2 py-1 sm:py-0", role === "admin" ? "text-brand-red border-b-2 border-brand-red" : "hover:text-text-primary")}
          >
            Admin Console
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 hover:text-brand-red transition-colors mr-2 cursor-pointer"
          >
            {darkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <span className="hidden md:inline">System Active</span>
          <span className="hidden lg:inline">College Library HQ</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Rail - MOBILE ADAPTATION */}
        <aside className={cn(
          "bg-brand-surface border-r border-border-main transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden z-40",
          "fixed inset-y-0 left-0 lg:relative", // Mobile: overlay, Desktop: relative
          isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        )}>
          <div className="h-20 flex items-center px-6 justify-between overflow-hidden border-b border-border-main/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-1">
                <div className="bg-brand-red px-3 py-1 brand-skew flex items-center justify-center shrink-0">
                  <span className="text-white font-black italic text-xl brand-skew-reverse tracking-tighter">ARCH</span>
                </div>
                <span className={cn(
                  "text-text-primary font-black italic text-xl tracking-tighter uppercase transition-opacity duration-300",
                  isSidebarOpen ? "opacity-100" : "opacity-0"
                )}>
                  The<span className="text-brand-red">Archive</span>
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 transition-all duration-300",
                isSidebarOpen ? "opacity-100 scale-100 h-auto" : "opacity-0 scale-95 h-0 overflow-hidden"
              )}>
                <span className="flex h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
                <span className="text-[9px] font-black uppercase text-text-secondary tracking-widest italic">
                  Sector: <span className="text-text-primary">{activeSection.replace("-", " ")}</span>
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-4">
            <NavItem 
              icon={<Home />} 
              label="Home" 
              active={activeSection === "inventory"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("inventory"); setSelectedCategory(null); }}
            />
            <NavItem 
              icon={<Filter />} 
              label="Genres" 
              active={activeSection === "genres"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("genres"); setSelectedCategory(null); }} 
            />
            <NavItem 
              icon={<BarChart3 />} 
              label="Data Node" 
              active={activeSection === "analytics"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("analytics"); setSelectedCategory(null); }} 
            />
            <NavItem 
              icon={<MapIcon />} 
              label="Facility Map" 
              active={activeSection === "map"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("map"); setSelectedCategory(null); }} 
            />
            <NavItem 
              icon={<User />} 
              label="Profile" 
              active={activeSection === "profile"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("profile"); setSelectedCategory(null); }}
            />
            <NavItem 
              icon={<Sparkles />} 
              label="Insights" 
              active={activeSection === "recommendations"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("recommendations"); setSelectedCategory(null); }}
            />
            {role === "admin" && (
              <NavItem 
                icon={<Shield />} 
                label="Security" 
                active={activeSection === "security"}
                isSidebarOpen={isSidebarOpen} 
                onClick={() => { setActiveSection("security"); setSelectedCategory(null); }}
              />
            )}
            <NavItem 
              icon={<MessageSquare />} 
              label="Blog" 
              active={activeSection === "blog"} 
              isSidebarOpen={isSidebarOpen} 
              onClick={() => { setActiveSection("blog"); setSelectedCategory(null); }} 
            />
          </nav>

          <div className="p-4 border-t border-border-main mt-auto">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-4 px-4 py-3 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRight className={cn("w-5 h-5 transition-transform shrink-0", !isSidebarOpen && "rotate-180")} />
              {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest italic">Collapse System</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Overlay Trigger */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-50 bg-brand-red text-white p-4 rounded-full shadow-2xl"
            >
              <Library className="w-6 h-6" />
            </button>
          )}

          {/* Main Visual Header */}
          <header className="relative bg-brand-surface p-6 sm:p-8 border-b-8 border-brand-red flex flex-col xl:flex-row xl:items-end justify-between gap-6 shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 brightness-[0.4] pointer-events-none"
              alt=""
            />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-6xl lg:text-7xl xl:text-8xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                {activeSection === "inventory" ? (
                  <><span id="library-text" className="drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">Library</span> <span className="text-brand-red skew-x-[-15deg] inline-block hover:skew-x-0 transition-transform">Home</span></>
                ) : activeSection === "genres" ? (
                  <>Book <span className="text-brand-red">Categories</span></>
                ) : activeSection === "analytics" ? (
                  <>Data <span className="text-brand-red">Nexus</span></>
                ) : activeSection === "map" ? (
                  <>Facility <span className="text-brand-red">Grid</span></>
                ) : activeSection === "recommendations" ? (
                  <>Recommended <span className="text-brand-red">Reading</span></>
                ) : activeSection === "security" ? (
                  <>Library <span className="text-brand-red">Security</span></>
                ) : activeSection === "blog" ? (
                  <>The Library <span className="text-brand-red">Log</span></>
                ) : (
                  <>User <span className="text-brand-red">Profile</span></>
                )}
              </h1>
              <p className="text-text-secondary font-bold text-[10px] sm:text-sm mt-3 italic uppercase tracking-wider">
                {activeSection === "inventory" ? `Database sync: ${processedBooks.length} Volumes Online` : 
                 activeSection === "genres" ? `High-Speed Classification System` : 
                 activeSection === "analytics" ? `Real-Time Circulation Telemetry` :
                 activeSection === "map" ? `Interactive Facility Navigation` :
                 activeSection === "recommendations" ? `AI-Powered Discovery Engine` :
                 activeSection === "security" ? `Administrative Security Protocol V4` :
                 activeSection === "blog" ? `Latest Transmission from Central Archive` :
                 `Librarian Access Grade 1`}
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch xl:items-center gap-4">
              <div className="absolute -top-6 left-0 hidden xl:block opacity-50">
                <p className="text-[9px] font-black italic uppercase text-text-secondary tracking-[0.2em]">
                  "A library is a hospital for the mind." — Archive Protocol 001
                </p>
              </div>
              <div className="relative group w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-brand-red transition-colors" />
                <input 
                  type="text"
                  placeholder="SEARCH DATABASE..."
                  className="bg-brand-dark text-text-primary text-[10px] sm:text-xs px-10 py-3 w-full sm:w-64 border-l-4 border-brand-red outline-none placeholder:text-text-secondary font-bold italic transition-all focus:bg-brand-surface"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-red transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Controls */}
              {activeSection === "inventory" && (
                <div className="flex items-center bg-brand-dark border-l-4 border-brand-red px-2 py-2 gap-2">
                  <span className="text-[9px] font-black italic text-brand-red uppercase tracking-widest pl-2 hidden lg:block">Sort Node:</span>
                  <div className="flex gap-1">
                    {(["title", "author", "year"] as SortField[]).map((field) => (
                      <button
                        key={field}
                        onClick={() => toggleSort(field)}
                        className={cn(
                          "px-3 py-1 text-[9px] font-black uppercase italic transition-all",
                          sortField === field 
                            ? "bg-brand-red text-white" 
                            : "text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {field === "title" && "T"}
                        {field === "author" && "A"}
                        {field === "year" && "Y"}
                        {sortField === field && (
                          <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {canManage && (
                <button 
                  onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
                  className="group relative bg-brand-red text-white font-black italic px-6 sm:px-8 py-3 sm:py-4 uppercase tracking-tighter text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]"
                >
                  + Add Entry
                </button>
              )}
            </div>
          </header>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-brand-dark scroll-smooth">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {activeSection === "inventory" && (
                  <motion.div 
                    key="inventory"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 sm:space-y-12"
                  >
                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <StatCard label="Total Units" value={books.length.toString().padStart(2, "0")} />
                      <StatCard label="On Loan" value={books.filter(b => b.status === "borrowed").length.toString().padStart(2, "0")} color="purple" />
                      <StatCard label="Uptime" value="99.9%" color="blue" />
                      <StatCard label="Latency" value="14ms" color="blue" />
                    </div>

                    {/* Book Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <AnimatePresence mode="popLayout">
                        {processedBooks.slice(0, visibleBooksCount).map((book, idx) => (
                          <BookCard 
                            key={book.id} 
                            book={book} 
                            index={idx}
                            canManage={canManage}
                            onEdit={() => { setEditingBook(book); setIsModalOpen(true); }}
                            onDelete={() => handleDeleteBook(book.id)}
                            onView={() => setViewingBook(book)}
                            onBorrow={() => handleBorrowBook(book.id)}
                            onReturn={() => handleReturnBook(book.id)}
                            history={history}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {visibleBooksCount < processedBooks.length && (
                      <div className="flex justify-center mt-12 pb-12">
                        <button 
                          onClick={() => setVisibleBooksCount(prev => prev + 7)}
                          className="group bg-brand-surface border-4 border-brand-red text-text-primary font-black italic px-10 py-4 uppercase tracking-tighter hover:bg-brand-red hover:text-white transition-all brand-skew"
                        >
                          <span className="brand-skew-reverse flex items-center gap-2">
                            Expand Visual Matrix <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                          </span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === "genres" && (
                  <motion.div 
                    key="genres"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-screen"
                  >
                    {!selectedCategory ? (
                      <>
                        <div className="border-b-8 border-brand-red mb-8 pb-8">
                          <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                            The <span className="text-brand-red">Index</span>
                          </h2>
                          <p className="text-text-secondary font-bold text-xs mt-3 italic uppercase tracking-wider">
                            Book Classification Node
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {Array.from(new Set(books.map(b => b.category))).map((cat: string) => (
                            <GenreCard 
                              key={cat} 
                              genre={cat} 
                              count={books.filter(b => b.category === cat).length}
                              onSelect={() => setSelectedCategory(cat)}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border-b-8 border-brand-red mb-8 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                          <div>
                            <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                              Category: <span className="text-brand-red">{selectedCategory}</span>
                            </h2>
                            <button 
                              onClick={() => setSelectedCategory(null)}
                              className="text-text-secondary font-bold text-sm mt-3 italic uppercase tracking-wider flex items-center gap-2 hover:text-brand-red transition-colors"
                            >
                              ← Return to Index
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">
                              Database Scan
                            </p>
                            <p className="text-3xl font-display font-black italic tracking-tighter text-text-primary">
                              {books.filter(b => b.category === selectedCategory).length.toString().padStart(2, "0")} <span className="text-xs text-text-secondary">VOLUMES</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                          <AnimatePresence mode="popLayout">
                            {sortBooks(books.filter(b => b.category === selectedCategory))
                              .map((book, idx) => (
                                <BookCard 
                                  key={book.id} 
                                  book={book} 
                                  index={idx}
                                  canManage={canManage}
                                  onEdit={() => { setEditingBook(book); setIsModalOpen(true); }}
                                  onDelete={() => handleDeleteBook(book.id)}
                                  onView={() => setViewingBook(book)}
                                  onBorrow={() => handleBorrowBook(book.id)}
                                  onReturn={() => handleReturnBook(book.id)}
                                  history={history}
                                />
                              ))}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {activeSection === "recommendations" && (
                  <motion.div 
                    key="recommendations"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-screen"
                  >
                    <div className="border-b-8 border-brand-red mb-12 pb-8">
                      <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                        Personalized <span className="text-brand-red">Curations</span>
                      </h2>
                      <p className="text-text-secondary font-bold text-sm mt-3 italic uppercase tracking-wider">
                        Algorithmic Analysis Based on Activity Log
                      </p>
                    </div>

                    {recommendedBooks.length > 0 ? (
                      <div className="space-y-12">
                        <div className="bg-brand-surface border-l-8 border-brand-red p-8 shadow-xl relative overflow-hidden">
                          <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-4">Discovery Insight</p>
                          <p className="text-xl sm:text-2xl font-display font-black italic uppercase text-text-primary max-w-2xl leading-tight">
                            Based on your recent interest in <span className="text-brand-red">
                              {Array.from(new Set(history.map(h => books.find(b => b.title === h.bookTitle)?.category).filter(Boolean))).join(", ")}
                            </span>, we have calibrated these selections for your profile.
                          </p>
                          <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-brand-red opacity-5 rotate-12" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                          <AnimatePresence mode="popLayout">
                            {recommendedBooks.map((book, idx) => (
                              <BookCard 
                                key={book.id} 
                                book={book} 
                                index={idx}
                                canManage={false}
                                onEdit={() => {}}
                                onDelete={() => {}}
                                onView={() => setViewingBook(book)}
                                onBorrow={() => handleBorrowBook(book.id)}
                                onReturn={() => handleReturnBook(book.id)}
                                history={history}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-brand-surface border-t-8 border-border-main p-12 text-center">
                        <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-4">Null Telemetry</p>
                        <h3 className="text-3xl font-display font-black italic uppercase text-text-primary mb-6">
                          Insufficient Data for Profile Mapping
                        </h3>
                        <p className="text-text-secondary max-w-md mx-auto mb-8 font-medium">
                          Borrow volumes from the inventory to activate the neural suggestion engine. 
                          Minimum 1 circulation record required for calibration.
                        </p>
                        <button 
                          onClick={() => setActiveSection("inventory")}
                          className="bg-brand-red text-white font-black italic px-8 py-3 uppercase tracking-tighter text-sm hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                        >
                          Access Inventory
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === "security" && (
                  <motion.div 
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-screen"
                  >
                    <div className="border-b-8 border-brand-red mb-12 pb-8">
                      <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                        System <span className="text-brand-red">Fortress</span>
                      </h2>
                      <p className="text-text-secondary font-bold text-sm mt-3 italic uppercase tracking-wider">
                        Security Node & Access Logs
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-brand-surface border-t-8 border-brand-red p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-display font-black italic uppercase text-text-primary">Security Status</h3>
                          <div className="flex items-center gap-2 bg-brand-dark px-3 py-1 border border-green-500/30">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-500 uppercase italic">Active</span>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <SecurityToggle label="Mainframe Firewall" enabled={true} />
                          <SecurityToggle label="Librarian Multi-Factor" enabled={true} />
                          <SecurityToggle label="Database Encryption" enabled={true} />
                          <SecurityToggle label="Intrusion Detection" enabled={false} />
                        </div>
                      </div>

                      <div className="bg-brand-surface border-t-8 border-text-primary p-8 shadow-xl flex flex-col h-[500px]">
                        <h3 className="text-2xl font-display font-black italic uppercase text-text-primary mb-6">Access Logs</h3>
                        <div className="flex-1 overflow-y-auto bg-brand-dark p-4 font-mono text-[10px] space-y-2 border border-border-main">
                          <p className="text-green-500">[2026-05-12 11:15:22] System: Security handshake successful.</p>
                          <p className="text-text-secondary">[2026-05-12 11:15:45] Node-A: Fetching profile data for ID: MC-01.</p>
                          <p className="text-brand-red">[2026-05-12 11:16:10] Warning: Unauthorized read attempt on confidential volume index.</p>
                          <p className="text-text-secondary">[2026-05-12 11:17:05] Audit: Background sync completed for inventory.</p>
                          <p className="text-blue-400">[2026-05-12 11:18:30] Insight: Recommendation engine recalibrated.</p>
                          <p className="text-text-secondary">[2026-05-12 11:19:00] Admin: Entering Fortress console.</p>
                          <p className="text-green-500 animate-pulse">_ system listening...</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "analytics" && (
                  <motion.div 
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 pb-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-brand-surface border-t-8 border-brand-red p-6 sm:p-8 shadow-xl">
                        <div className="flex items-center gap-2 mb-8">
                          <Activity className="w-5 h-5 text-brand-red" />
                          <h3 className="text-xl font-black italic uppercase text-text-primary tracking-tighter">Borrowing Pulse</h3>
                        </div>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { name: 'Mon', value: 400 },
                              { name: 'Tue', value: 300 },
                              { name: 'Wed', value: 600 },
                              { name: 'Thu', value: 800 },
                              { name: 'Fri', value: 500 },
                              { name: 'Sat', value: 900 },
                              { name: 'Sun', value: 400 },
                            ]}>
                              <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ef4444', color: '#fff' }}
                                itemStyle={{ color: '#ef4444' }}
                              />
                              <Area type="monotone" dataKey="value" stroke="#ef4444" fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-brand-surface border-t-8 border-brand-purple p-6 sm:p-8 shadow-xl">
                        <div className="flex items-center gap-2 mb-8">
                          <Cpu className="w-5 h-5 text-brand-purple" />
                          <h3 className="text-xl font-black italic uppercase text-text-primary tracking-tighter">Genre Distribution</h3>
                        </div>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={
                              Array.from(new Set(books.map(b => b.category))).map((cat) => ({
                                name: (cat as string).toUpperCase(),
                                count: books.filter(b => b.category === cat).length
                              }))
                            }>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #7c3aed', color: '#fff' }}
                              />
                              <Bar dataKey="count" fill="#7c3aed" barSize={30} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-surface border-l-8 border-brand-red p-8 shadow-xl">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                          <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-2">Total System Load</p>
                          <p className="text-2xl font-display font-black italic uppercase text-text-primary">Operational Level: Alpha Prime</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full md:w-auto">
                          <div>
                            <p className="text-[10px] font-black uppercase text-text-secondary italic">CPU Load</p>
                            <p className="text-xl font-black text-brand-red">12%</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-text-secondary italic">Mem Scan</p>
                            <p className="text-xl font-black text-brand-red">3.2TB</p>
                          </div>
                          <div className="flex flex-col">
                            <button 
                              onClick={async () => {
                                const confirmSync = confirm("Initiate bulk visual calibration? This will refresh all standard volumes with high-density vision matrices based on ISBN data.");
                                if (!confirmSync) return;
                                
                                try {
                                  let updatedCount = 0;
                                  for (const book of books) {
                                    if (book.isbn) {
                                      // Normalize ISBN (remove dashes)
                                      const cleanIsbn = book.isbn.replace(/-/g, "");
                                      const newImageUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
                                      
                                      await fetch(`/api/books/${book.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ image: newImageUrl }),
                                      });
                                      updatedCount++;
                                    }
                                  }
                                  await fetchBooks();
                                  alert(`Visual Calibration Complete. ${updatedCount} Vision Matrices Synchronized and Fixed.`);
                                } catch (err) {
                                  console.error("Calibration failed", err);
                                  alert("System Alert: Calibration sequence interrupted. Check network node.");
                                }
                              }}
                              className="text-[10px] font-black uppercase text-brand-red italic group flex items-center hover:text-white transition-colors"
                            >
                              Sync Logic <Activity className="ml-1 w-3 h-3 group-hover:animate-pulse" />
                            </button>
                            <p className="text-xl font-black text-green-500">READY</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-text-secondary italic">Nodes</p>
                            <p className="text-xl font-black text-text-primary">124</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "map" && (
                  <motion.div 
                    key="map"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="min-h-screen pb-12"
                  >
                    <div className="bg-brand-surface border-8 border-brand-dark p-4 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] border-l-brand-red">
                      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                        <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-1">Navigation HUD</p>
                        <h3 className="text-2xl font-display font-black italic uppercase text-text-primary">Floor Plan: Sector 7G</h3>
                      </div>

                      <div className="w-full max-w-3xl aspect-square sm:aspect-video relative bg-brand-dark/50 border border-border-main flex items-center justify-center p-4">
                        <svg viewBox="0 0 800 450" className="w-full h-full opacity-80">
                          {/* Floor Layout */}
                          <rect x="50" y="50" width="700" height="350" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="10 5" />
                          
                          {/* Shelves */}
                          <g className="hover:opacity-100 transition-opacity cursor-help">
                             <rect x="100" y="100" width="150" height="40" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="2" />
                             <text x="175" y="125" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold" className="italic font-black">AI & TECH</text>
                          </g>

                          <g className="hover:opacity-100 transition-opacity cursor-help">
                             <rect x="300" y="100" width="150" height="40" fill="#7c3aed" fillOpacity="0.1" stroke="#7c3aed" strokeWidth="2" />
                             <text x="375" y="125" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="bold" className="italic font-black">PHILOSOPHY</text>
                          </g>

                          <g className="hover:opacity-100 transition-opacity cursor-help">
                             <rect x="550" y="100" width="150" height="40" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
                             <text x="625" y="125" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold" className="italic font-black">ARCHIVE</text>
                          </g>

                          {/* Reading Zones */}
                          <circle cx="400" cy="300" r="60" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5 5" className="animate-[spin_20s_linear_infinite]" />
                          <text x="400" y="305" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold" className="italic font-black">CORE TERMINAL</text>

                          {/* Nodes */}
                          <circle cx="100" cy="50" r="4" fill="#ef4444" className="animate-pulse" />
                          <circle cx="750" cy="50" r="4" fill="#ef4444" className="animate-pulse" />
                          <circle cx="100" cy="400" r="4" fill="#ef4444" className="animate-pulse" />
                          <circle cx="750" cy="400" r="4" fill="#ef4444" className="animate-pulse" />
                        </svg>

                        <div className="absolute bottom-4 right-4 text-right">
                          <p className="text-[10px] font-black uppercase text-brand-red italic mb-1">User Position</p>
                          <p className="text-xs font-mono text-text-primary">X: 12.4 | Y: 88.1</p>
                        </div>

                        {/* Interactive Legend */}
                        <div className="absolute bottom-4 left-4 flex gap-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-brand-red" />
                             <span className="text-[8px] font-black uppercase text-text-secondary">High Traffic</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-brand-purple" />
                             <span className="text-[8px] font-black uppercase text-text-secondary">Quiet Zone</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 flex gap-8">
                        <button className="text-[10px] font-black uppercase text-text-secondary hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red">Level 01: Core</button>
                        <button className="text-[10px] font-black uppercase text-text-secondary hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red">Level 02: Archives</button>
                        <button className="text-[10px] font-black uppercase text-text-secondary hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red">Level 03: Observation</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "profile" && userProfile && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-screen"
                  >
                    <div className="border-b-8 border-brand-red mb-12 pb-8">
                      <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                        User <span className="text-brand-red">Profile</span>
                      </h2>
                      <p className="text-text-secondary font-bold text-sm mt-3 italic uppercase tracking-wider">
                        Librarian Access Grade 1
                      </p>
                    </div>

                    <div className="max-w-4xl bg-brand-surface border-t-8 border-brand-red p-6 sm:p-12 shadow-2xl relative overflow-hidden group">
                      <span className="absolute -bottom-10 -right-10 text-[120px] sm:text-[200px] font-black text-text-primary opacity-5 leading-none select-none italic">
                        {role.toUpperCase().slice(0, 3)}
                      </span>

                      <div className="flex flex-col md:flex-row gap-8 sm:gap-12 relative z-10">
                        <div className="w-full sm:w-64 h-64 sm:h-80 bg-black shrink-0 brand-skew relative overflow-hidden ring-4 sm:ring-8 ring-zinc-900 shadow-xl mx-auto md:mx-0 group/profile-img">
                          <img 
                            src={userProfile.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover brand-skew-reverse scale-110 grayscale group-hover:grayscale-0 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-red/40 to-transparent flex items-center justify-center opacity-0 group-hover/profile-img:opacity-100 transition-opacity">
                            <label className="cursor-pointer bg-brand-red text-white p-4 brand-skew hover:scale-110 transition-transform">
                              <span className="brand-skew-reverse block">
                                <Plus className="w-8 h-8" />
                              </span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-brand-dark/80 px-2 py-1 text-[8px] font-black italic uppercase text-white tracking-widest pointer-events-none opacity-0 group-hover/profile-img:opacity-100 transition-opacity">
                            Change Identity Matrix
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                          <div className="space-y-6 sm:space-y-8">
                            <div>
                              <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-2">Member Name</p>
                              <h3 className="text-3xl sm:text-5xl font-display font-black italic uppercase leading-none tracking-tighter text-text-primary">
                                {userProfile.name}
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:gap-8 py-6 sm:py-8 border-y-2 border-border-main">
                              <div>
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Academic Institute</p>
                                <p className="text-lg sm:text-xl font-display font-black italic uppercase text-text-primary">
                                  {userProfile.institute}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Age</p>
                                <p className="text-lg sm:text-xl font-display font-black italic uppercase text-text-primary">
                                  {userProfile.age} Years
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Status</p>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-xs font-black uppercase italic text-text-primary">{userProfile.status}</span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Department</p>
                                <span className="text-xs font-black uppercase italic text-text-primary">{userProfile.department}</span>
                              </div>
                            </div>
                          </div>

                          <button className="mt-8 sm:mt-12 w-full sm:w-fit bg-brand-red text-white font-black italic px-10 py-4 uppercase tracking-tighter text-sm hover:brightness-110 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]">
                            Update Profile Data
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Borrowing History Section */}
                    <div className="mt-16 max-w-5xl">
                      <div className="flex items-end justify-between border-b-4 border-text-primary mb-8 pb-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-1">Telemetry</p>
                          <h3 className="text-4xl font-display font-black italic uppercase tracking-tighter text-text-primary">
                            Borrowing <span className="text-brand-red">History</span>
                          </h3>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Archive Node</p>
                          <p className="text-xl font-display font-black italic text-text-primary">HIST-LOG-V2.1</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {history.map((record) => (
                          <div 
                            key={record.id}
                            className="bg-brand-surface border-l-8 border-border-main px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-red transition-all group shadow-sm"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={cn(
                                  "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest italic border",
                                  record.status === "returned" ? "bg-brand-dark text-text-secondary border-border-main" :
                                  record.status === "overdue" ? "bg-brand-purple text-white border-brand-purple" :
                                  "bg-brand-red text-white border-brand-red"
                                )}>
                                  {record.status}
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary uppercase italic">ID: {record.id}</span>
                              </div>
                              <h4 className="text-2xl font-display font-black italic uppercase text-text-primary leading-tight group-hover:text-brand-red transition-colors">
                                {record.bookTitle}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-8 md:gap-12 shrink-0">
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Borrow Date</p>
                                <span className="text-sm font-black italic text-text-primary uppercase tracking-tighter">
                                  {new Date(record.borrowDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Due Date</p>
                                <span className={cn(
                                  "text-sm font-black italic uppercase tracking-tighter",
                                  record.status === "overdue" ? "text-brand-red" : "text-text-primary"
                                )}>
                                  {new Date(record.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex flex-col min-w-[100px]">
                                <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Status Date</p>
                                <span className="text-sm font-black italic text-text-primary uppercase tracking-tighter">
                                  {record.returnDate 
                                    ? `Returned ${new Date(record.returnDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`
                                    : "Outstanding"
                                  }
                                </span>
                              </div>
                            </div>

                            <button className="bg-brand-dark p-3 brand-skew group-hover:bg-brand-red transition-colors">
                              <ChevronRight className="w-5 h-5 text-text-primary brand-skew-reverse" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeSection === "blog" && (
                  <motion.div 
                    key="blog"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-screen pb-12"
                  >
                    <div className="border-b-8 border-brand-red mb-12 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                      <div>
                        <h2 className="text-4xl sm:text-6xl font-black italic uppercase leading-none tracking-tighter text-text-primary">
                          Library <span className="text-brand-red">Transmissions</span>
                        </h2>
                        <p className="text-text-secondary font-bold text-sm mt-3 italic uppercase tracking-wider">
                          Insights, Events & Technical Updates
                        </p>
                      </div>
                      {canManage && (
                        <button 
                          onClick={() => { setEditingBlogPost(null); setIsBlogModalOpen(true); }}
                          className="bg-brand-red text-white font-black italic px-8 py-3 uppercase tracking-tighter text-lg hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                        >
                          + New Transmission
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                      {blogPosts.slice(0, visibleBlogsCount).map((post, idx) => (
                        <BlogCard 
                          key={post.id} 
                          post={post} 
                          index={idx} 
                          canManage={canManage}
                          onEdit={() => { setEditingBlogPost(post); setIsBlogModalOpen(true); }}
                          onDelete={() => handleDeleteBlogPost(post.id)}
                        />
                      ))}
                    </div>

                    {visibleBlogsCount < blogPosts.length && (
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setVisibleBlogsCount(prev => prev + 3)}
                          className="bg-brand-surface border-4 border-brand-red text-text-primary font-black italic px-10 py-4 uppercase tracking-tighter hover:bg-brand-red hover:text-white transition-all brand-skew group"
                        >
                          <span className="brand-skew-reverse flex items-center gap-2">
                             Load More Transmissions <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                          </span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pb-20" />
            </div>
          </div>

          {/* System Footer */}
          <footer className="bg-brand-surface h-16 border-t border-border-main flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-6 text-[10px] font-bold italic text-text-secondary uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Database Online: LIB_COLLEGE_V1
              </div>
              <div className="hidden sm:flex items-center gap-2">
                Server: PROD-01
              </div>
            </div>
            <div className="text-text-primary font-black italic text-[10px] uppercase tracking-widest opacity-30">
              © 2026 COLLEGE LIBRARY SYSTEMS
            </div>
          </footer>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                setModalImage(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-brand-surface border border-border-main w-full max-w-lg p-8 brand-skew shadow-2xl"
            >
              <div className="brand-skew-reverse">
                <h2 className="font-display font-black text-3xl uppercase italic tracking-tighter text-text-primary mb-6">
                  {editingBook ? "Record Update" : "New Entry"}
                </h2>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const bookData = {
                      title: formData.get("title") as string,
                      author: formData.get("author") as string,
                      category: formData.get("category") as string,
                      isbn: formData.get("isbn") as string,
                      year: parseInt(formData.get("year") as string),
                      status: formData.get("status") as any,
                      image: modalImage || (formData.get("image") as string) || (editingBook?.image) || "https://images.unsplash.com/photo-1543004218-ee141d0ef1d4?auto=format&fit=crop&q=80&w=400",
                    };
                    if (editingBook) {
                      handleUpdateBook(editingBook.id, bookData).then(() => setModalImage(null));
                    } else {
                      handleAddBook(bookData).then(() => setModalImage(null));
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Title" name="title" defaultValue={editingBook?.title} required />
                    <Field label="Author" name="author" defaultValue={editingBook?.author} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Category" name="category" defaultValue={editingBook?.category} required />
                    <Field label="ISBN Code" name="isbn" defaultValue={editingBook?.isbn} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Year" name="year" type="number" defaultValue={editingBook?.year} required />
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">Status</label>
                      <select 
                        name="status" 
                        defaultValue={editingBook?.status || "available"}
                        className="w-full bg-brand-dark border border-border-main rounded-none px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-text-primary"
                      >
                        <option value="available" className="bg-brand-surface">Available</option>
                        <option value="borrowed" className="bg-brand-surface">Borrowed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">Cover Image URL</label>
                      <input 
                        name="image"
                        type="text"
                        defaultValue={editingBook?.image}
                        placeholder="Or provide URL..."
                        className="w-full bg-brand-dark border border-border-main rounded-none px-3 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors font-bold text-text-primary placeholder:text-text-secondary/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">Upload Cover</label>
                      <label className="flex items-center justify-center w-full h-[46px] bg-brand-dark border border-border-main hover:border-brand-red cursor-pointer transition-colors group">
                        <Plus className="w-5 h-5 text-text-secondary group-hover:text-brand-red" />
                        <span className="ml-2 text-[10px] font-black uppercase italic text-text-secondary group-hover:text-text-primary">
                          {modalImage ? "Image Ready" : "Select File"}
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleBookImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {modalImage && (
                    <div className="h-24 w-full bg-brand-dark border border-border-main p-2 flex items-center gap-4">
                      <div className="h-full aspect-[3/4] overflow-hidden">
                        <img src={modalImage} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] font-black text-brand-red uppercase italic tracking-widest">Digital Snapshot Ready</p>
                        <button 
                          type="button" 
                          onClick={() => setModalImage(null)}
                          className="text-[10px] font-bold text-text-secondary hover:text-brand-red uppercase"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      type="submit"
                      className="flex-1 bg-text-primary text-brand-dark font-display font-black uppercase italic py-3 brand-skew hover:bg-brand-red hover:text-white transition-all outline-none"
                    >
                      <span className="brand-skew-reverse">Save Changes</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setModalImage(null);
                      }}
                      className="px-6 border border-border-main text-text-secondary font-display font-black uppercase italic py-3 brand-skew hover:bg-brand-dark hover:text-text-primary transition-all outline-none"
                    >
                      <span className="brand-skew-reverse">Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {viewingBook && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingBook(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 20 }}
              className="relative bg-brand-surface border-4 sm:border-8 border-brand-red w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl text-text-primary"
            >
              {/* Image Section */}
              <div className="md:w-1/2 bg-brand-dark relative group overflow-hidden h-64 md:h-auto">
                <img 
                  src={viewingBook.image} 
                  alt={viewingBook.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543004218-ee141d0ef1d4?auto=format&fit=crop&q=80&w=400";
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-brand-red text-white px-4 py-1 text-[10px] font-black italic uppercase brand-skew">
                  <span className="brand-skew-reverse block">ISBN: {viewingBook.isbn}</span>
                </div>
              </div>

              {/* Data Section */}
              <div className="md:w-1/2 p-6 md:p-12 flex flex-col bg-brand-surface relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 brightness-[0.4] pointer-events-none"
                  alt=""
                />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-brand-red/10 text-brand-red px-3 py-1 text-[10px] font-black uppercase tracking-widest italic border border-brand-red/20">
                      {viewingBook.category}
                    </span>
                    <span className="bg-brand-dark text-text-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest italic border border-border-main">
                      {viewingBook.year}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-display font-black italic uppercase leading-none tracking-tighter text-text-primary mb-2">
                    {viewingBook.title}
                  </h2>
                  <p className="text-lg md:text-xl text-text-secondary font-bold italic uppercase mb-4">
                    BY {viewingBook.author}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={viewingBook.rating || 0} count={viewingBook.ratingCount || 0} size={20} />
                    <div className="h-4 w-[1px] bg-border-main" />
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black uppercase text-text-secondary italic">Sentiment:</p>
                      <p className="text-sm font-black text-brand-red italic uppercase">
                        {viewingBook.rating && viewingBook.rating >= 4.5 ? "PRIME" : viewingBook.rating && viewingBook.rating >= 4 ? "STABLE" : "VARIED"}
                      </p>
                    </div>
                  </div>

                  {history.some(h => h.bookTitle === viewingBook.title && h.status === "returned") && (
                    <div className="bg-brand-red/10 border-l-4 border-brand-red p-4 mb-8 brand-skew">
                      <div className="brand-skew-reverse flex items-center gap-3">
                        <Activity className="w-5 h-5 text-brand-red animate-pulse" />
                        <p className="text-xs font-black text-brand-red italic uppercase tracking-wider">
                          The book is read, want to read again?
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 md:gap-8 py-6 md:py-8 border-y-2 border-border-main">
                    <div>
                      <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Status</p>
                      <div className={cn(
                        "text-lg font-display font-black italic uppercase",
                        viewingBook.status === "available" ? "text-green-500" : "text-brand-purple"
                      )}>
                        {viewingBook.status}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1">Book ID</p>
                      <div className="text-lg font-display font-black italic uppercase text-text-primary">
                        {viewingBook.id.slice(-8)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                      This volume is indexed in the college library database. Central records confirm material is 
                      part of the <span className="text-brand-red uppercase italic">{viewingBook.category}</span> category. 
                      Circulation status is currently <span className="font-black italic uppercase text-text-primary">{viewingBook.status}</span>.
                    </p>
                    {viewingBook.reservations && viewingBook.reservations.length > 0 && (
                      <div className="bg-brand-dark/50 border-l-4 border-brand-purple p-4 mt-4">
                        <p className="text-[10px] font-black uppercase text-brand-purple italic tracking-widest mb-2">Active Reservations</p>
                        <div className="flex flex-wrap gap-2">
                          {viewingBook.reservations.map((user, i) => (
                            <span key={i} className="text-[10px] font-bold text-text-primary bg-brand-surface px-2 py-1 border border-border-main">
                              {user}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating Submission */}
                  <div className="mt-8 pt-8 border-t border-border-main/50">
                    <p className="text-[10px] font-black uppercase text-brand-red italic tracking-[0.3em] mb-4">Sentiment Input Node</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateBook(viewingBook.id, star)}
                            className="group/star relative transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star 
                              className={cn(
                                "w-8 h-8 transition-colors",
                                (viewingBook.rating || 0) >= star ? "fill-brand-red text-brand-red" : "text-text-secondary opacity-30 hover:opacity-100"
                              )} 
                            />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[8px] font-black px-2 py-1 brand-skew opacity-0 group-hover/star:opacity-100 transition-opacity">
                              <span className="brand-skew-reverse block">RATE {star}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs font-bold text-text-secondary italic leading-tight">
                          Submit your visual calibration data. 
                          This recalibrates the global index for this volume.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                  <button 
                    onClick={() => setViewingBook(null)}
                    className="flex-1 bg-brand-dark text-text-primary font-black italic px-8 py-4 uppercase tracking-tighter text-sm hover:bg-brand-red hover:text-white transition-all"
                  >
                    Close Review
                  </button>
                  {viewingBook.status === "available" ? (
                    <button 
                      onClick={() => handleBorrowBook(viewingBook.id)}
                      className="flex-1 bg-brand-red text-white font-black italic px-8 py-4 uppercase tracking-tighter text-sm hover:brightness-110 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                    >
                      Borrow Now
                    </button>
                  ) : (
                    <div className="flex flex-1 gap-2">
                      <button 
                        onClick={() => handleReturnBook(viewingBook.id)}
                        className="flex-1 bg-brand-red text-white font-black italic px-4 py-4 uppercase tracking-tighter text-[10px] sm:text-xs hover:brightness-110 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                      >
                        Return Volume
                      </button>
                      <button 
                        onClick={() => handleReserveBook(viewingBook.id)}
                        className="flex-1 bg-brand-purple text-white font-black italic px-4 py-4 uppercase tracking-tighter text-[10px] sm:text-xs hover:brightness-110 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                      >
                        Reserve
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Close Icon for quick exit */}
              <button 
                onClick={() => setViewingBook(null)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Plus className="w-8 h-8 rotate-45" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
       {/* Blog Modal */}
       <AnimatePresence>
         {isBlogModalOpen && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => {
                 setIsBlogModalOpen(false);
                 setBlogModalImage(null);
                 setEditingBlogPost(null);
               }}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-brand-surface border border-border-main w-full max-w-lg p-8 brand-skew shadow-2xl overflow-y-auto max-h-[90vh]"
             >
               <div className="brand-skew-reverse">
                 <h2 className="font-display font-black text-3xl uppercase italic tracking-tighter text-text-primary mb-6">
                   {editingBlogPost ? "Log Verification" : "New Transmission"}
                 </h2>
                 <form 
                   onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const postData = {
                       title: formData.get("title") as string,
                       excerpt: formData.get("excerpt") as string,
                       author: formData.get("author") as string,
                       category: formData.get("category") as string,
                       mediumUrl: formData.get("mediumUrl") as string,
                       date: editingBlogPost?.date || new Date().toISOString().split('T')[0],
                       image: blogModalImage || (formData.get("image") as string) || (editingBlogPost?.image) || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
                     };
                     if (editingBlogPost) {
                       handleUpdateBlogPost(editingBlogPost.id, postData);
                     } else {
                       handleAddBlogPost(postData);
                     }
                   }}
                   className="space-y-4"
                 >
                   <Field label="Transmission Title" name="title" defaultValue={editingBlogPost?.title} required />
                   <div className="space-y-1 text-text-primary">
                      <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1 text-text-primary">Summary / Excerpt</label>
                      <textarea 
                        name="excerpt"
                        defaultValue={editingBlogPost?.excerpt}
                        required
                        className="w-full bg-brand-dark border border-border-main rounded-none px-3 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors font-bold text-text-primary placeholder:text-text-secondary/40 min-h-[100px]"
                      />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Field label="Author Signature" name="author" defaultValue={editingBlogPost?.author} required />
                     <Field label="Sector / Category" name="category" defaultValue={editingBlogPost?.category} required />
                   </div>
                   <Field label="Medium Source URL" name="mediumUrl" defaultValue={editingBlogPost?.mediumUrl} required />
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">Visual Matrix URL</label>
                       <input 
                         name="image"
                         type="text"
                         defaultValue={editingBlogPost?.image}
                         placeholder="https://..."
                         className="w-full bg-brand-dark border border-border-main rounded-none px-3 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors font-bold text-text-primary placeholder:text-text-secondary/40"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">Capture Image</label>
                       <label className="flex items-center justify-center w-full h-[46px] bg-brand-dark border border-border-main hover:border-brand-red cursor-pointer transition-colors group">
                         <Plus className="w-5 h-5 text-text-secondary group-hover:text-brand-red" />
                         <span className="ml-2 text-[10px] font-black uppercase italic text-text-secondary group-hover:text-text-primary">
                           {blogModalImage ? "Matrix Locked" : "Select Frame"}
                         </span>
                         <input 
                           type="file" 
                           className="hidden" 
                           accept="image/*"
                           onChange={handleBlogImageUpload}
                         />
                       </label>
                     </div>
                   </div>
                   
                   {blogModalImage && (
                     <div className="h-24 w-full bg-brand-dark border border-border-main p-2 flex items-center gap-4">
                       <div className="h-full aspect-video overflow-hidden">
                         <img src={blogModalImage} className="w-full h-full object-cover" alt="Preview" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[8px] font-black text-brand-red uppercase italic tracking-widest">Image Matrix Ready</p>
                         <button 
                           type="button" 
                           onClick={() => setBlogModalImage(null)}
                           className="text-[10px] font-bold text-text-secondary hover:text-brand-red uppercase"
                         >
                           Invalidate
                         </button>
                       </div>
                     </div>
                   )}
                   
                   <div className="flex flex-col sm:flex-row gap-4 pt-4">
                     <button 
                       type="submit"
                       className="flex-1 bg-brand-red text-white font-display font-black uppercase italic py-4 brand-skew hover:brightness-110 transition-all outline-none"
                     >
                       <span className="brand-skew-reverse">{editingBlogPost ? "Commit Updates" : "Send Transmission"}</span>
                     </button>
                     <button 
                       type="button"
                       onClick={() => {
                         setIsBlogModalOpen(false);
                         setBlogModalImage(null);
                         setEditingBlogPost(null);
                       }}
                       className="px-6 border border-border-main text-text-secondary font-display font-black uppercase italic py-4 brand-skew hover:bg-brand-dark hover:text-text-primary transition-all outline-none"
                     >
                       <span className="brand-skew-reverse">Abort</span>
                     </button>
                   </div>
                 </form>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
     </div>
  );
}

// --- Subcomponents ---

interface SecurityToggleProps {
  label: string;
  enabled: boolean;
}

const SecurityToggle: React.FC<SecurityToggleProps> = ({ label, enabled: initialEnabled }) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  
  return (
    <div className="flex items-center justify-between p-4 bg-brand-dark border border-border-main group hover:border-brand-red transition-all">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-1 group-hover:text-text-primary">Protocol</span>
        <span className="text-sm font-black italic uppercase text-text-primary">{label}</span>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "w-12 h-6 flex items-center transition-colors px-1",
          enabled ? "bg-brand-red" : "bg-zinc-700"
        )}
      >
        <div className={cn(
          "w-4 h-4 bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isSidebarOpen: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, isSidebarOpen, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3 rounded-none transition-all group relative overflow-hidden",
        active ? "bg-brand-red text-white" : "text-text-secondary hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-text-primary"
      )}
    >
      <div className={cn("w-6 h-6 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-brand-red")}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-black uppercase tracking-widest italic transition-opacity",
        isSidebarOpen ? "opacity-100" : "opacity-0 invisible w-0"
      )}>{label}</span>
      {isSidebarOpen && (
        <ChevronRight className={cn("ml-auto w-4 h-4 opacity-0 transition-all", active ? "opacity-100 text-white" : "group-hover:opacity-100 group-hover:translate-x-1")} />
      )}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color?: "blue" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = "blue" }) => {
  return (
    <div className={cn(
      "bg-brand-surface border-t-8 p-6 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all",
      color === "blue" ? "border-brand-red" : "border-brand-purple"
    )}>
      <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-display font-black italic tracking-tighter text-text-primary">{value}</span>
      </div>
      <div className={cn(
        "absolute -right-2 -bottom-4 w-12 h-12 rotate-12 opacity-5",
        color === "blue" ? "bg-brand-red" : "bg-brand-purple"
      )} />
    </div>
  );
}

interface GenreCardProps {
  genre: string;
  count: number;
  onSelect: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, count, onSelect }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="bg-brand-surface border-l-8 border-brand-red p-8 shadow-md cursor-pointer group flex items-center justify-between"
    >
      <div>
        <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter text-text-primary group-hover:text-brand-red transition-colors">
          {genre}
        </h3>
        <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mt-1">
          {count} Volumes Indexed
        </p>
      </div>
      <ChevronRight className="w-8 h-8 text-text-secondary group-hover:text-brand-red transition-all group-hover:translate-x-2" />
    </motion.div>
  );
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index, canManage, onEdit, onDelete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-brand-surface border-t-8 border-border-main p-6 shadow-md relative overflow-hidden flex flex-col group hover:border-brand-red transition-all"
    >
      <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 bg-brand-red text-white px-3 py-1 text-[10px] font-black italic uppercase brand-skew">
          <span className="brand-skew-reverse block">{post.category}</span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest mb-2">
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h3 className="font-display font-black text-2xl uppercase italic leading-tight text-text-primary mb-4 group-hover:text-brand-red transition-all">
          {post.title}
        </h3>
        <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {canManage && (
        <div className="flex gap-2 mb-6">
          <button 
            onClick={onEdit}
            className="flex-1 bg-brand-dark text-text-secondary py-2 text-[8px] font-black uppercase italic hover:bg-brand-red hover:text-white transition-all border border-border-main"
          >
            Update Log
          </button>
          <button 
            onClick={onDelete}
            className="flex-1 bg-brand-dark text-text-secondary py-2 text-[8px] font-black uppercase italic hover:bg-brand-purple hover:text-white transition-all border border-border-main"
          >
            Wipe Entry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border-main/50 pt-4 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-dark flex items-center justify-center brand-skew">
            <span className="brand-skew-reverse text-[10px] font-black text-brand-red">
              {post.author.charAt(0)}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase italic text-text-secondary">{post.author}</span>
        </div>
        <a 
          href={post.mediumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase text-text-primary hover:text-brand-red italic flex items-center gap-2 transition-colors"
        >
          Read Entry <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

const StarRating: React.FC<{ rating: number; count?: number; size?: number }> = ({ rating, count, size = 12 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={size} 
            className={cn(
              "shrink-0",
              i < fullStars ? "fill-brand-red text-brand-red" : 
              (i === fullStars && hasHalfStar) ? "fill-brand-red/50 text-brand-red" : 
              "text-text-secondary opacity-30"
            )} 
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-black italic text-text-secondary ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

interface BookCardProps {
  book: Book;
  index: number;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onView: () => void;
  onBorrow: () => void;
  onReturn: () => void;
  history: BorrowingRecord[];
}

const BookCard: React.FC<BookCardProps> = ({ book, index, canManage, onEdit, onDelete, onView, onBorrow, onReturn, history }) => {
  const isRead = history.some(h => h.bookTitle === book.title && h.status === "returned");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        "group bg-brand-surface border-t-8 p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[480px]",
        book.status === "available" ? "border-brand-red" : "border-brand-purple"
      )}
    >
      {isRead && (
        <div className="absolute top-2 right-2 z-20 bg-brand-red text-white text-[8px] font-black uppercase italic px-2 py-0.5 brand-skew">
          <span className="brand-skew-reverse block">READ</span>
        </div>
      )}
      
      <span className="absolute top-2 right-2 text-[80px] font-black text-text-primary opacity-5 leading-none -z-0 select-none transition-colors group-hover:opacity-10">
        {(index + 1).toString().padStart(2, "0")}
      </span>

      <div className="relative z-10 flex-1">
        {/* Book Image */}
        <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden relative group/img cursor-pointer" onClick={onView}>
          <img 
            src={book.image} 
            alt={book.title} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543004218-ee141d0ef1d4?auto=format&fit=crop&q=80&w=400";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <p className="text-white text-[10px] font-black italic uppercase tracking-widest">Click to Review Volume</p>
          </div>
        </div>

        <div className={cn(
          "inline-block px-3 py-1 text-[10px] font-bold uppercase italic mb-4 mr-2",
          book.status === "available" ? "bg-brand-red text-white" : "bg-brand-purple text-white"
        )}>
          {book.status === "available" ? "STATUS: AVAILABLE" : "STATUS: BORROWED"}
        </div>

        {book.reservations && book.reservations.length > 0 && (
          <div className="inline-block px-3 py-1 text-[10px] font-bold uppercase italic mb-4 bg-brand-dark text-brand-purple border border-brand-purple/30">
            {book.reservations.length} RESERVED
          </div>
        )}

        <button 
          onClick={onView}
          className="text-left block w-full focus:outline-none"
        >
          <h3 className="font-display font-black text-2xl uppercase italic leading-tight text-text-primary mb-1 group-hover:text-brand-red transition-colors">
            {book.title}
          </h3>
        </button>
        <p className="text-text-secondary font-bold text-xs italic uppercase mb-3">{book.author}</p>
        
        <div className="mb-4">
          <StarRating rating={book.rating || 0} count={book.ratingCount || 0} />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-brand-dark px-2 py-1 text-[10px] font-black text-text-secondary border border-border-main uppercase tracking-tighter">{book.category}</span>
          <span className="bg-brand-dark px-2 py-1 text-[10px] font-black text-text-secondary border border-border-main uppercase tracking-tighter">{book.year}</span>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <button 
          onClick={onView}
          className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase italic text-text-secondary hover:text-brand-red transition-colors border-t border-border-main pt-3"
        >
          <Search className="w-3 h-3" />
          View Details
        </button>

        {canManage ? (
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="flex-1 bg-brand-dark text-text-secondary py-3 text-[10px] font-black uppercase italic hover:bg-brand-red hover:text-white transition-all outline-none"
            >
              Update
            </button>
            <button 
              onClick={onDelete}
              className="flex-1 bg-brand-dark text-text-secondary py-3 text-[10px] font-black uppercase italic hover:bg-brand-purple hover:text-white transition-all outline-none"
            >
              Delete
            </button>
          </div>
        ) : (
          <button 
            onClick={book.status === "available" ? onBorrow : onReturn}
            className={cn(
              "w-full py-3 text-[10px] font-black uppercase italic transition-all shadow-xl",
              book.status === "available" ? "bg-text-primary text-brand-dark" : "bg-brand-red text-white"
            )}
          >
            {book.status === "available" ? "Borrow Book" : "Return Book"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Field({ label, name, type = "text", defaultValue, required = false }: {
  label: string,
  name: string,
  type?: string,
  defaultValue?: any,
  required?: boolean
}) {
  return (
    <div className="space-y-1 text-text-primary">
      <label className="text-[10px] font-black uppercase text-text-secondary italic tracking-widest pl-1">{label}</label>
      <input 
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full bg-brand-dark border border-border-main rounded-none px-3 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors font-bold text-text-primary placeholder:text-text-secondary/40"
      />
    </div>
  );
}

