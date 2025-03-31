"use client";

import { ProtectedComponent } from "./protected-component";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { BookmarkIcon, ClockIcon, ChevronRightIcon, TagIcon, EyeIcon, AlertCircleIcon, SearchIcon, NewspaperIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const categories = [
  "general",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

// Badge color mapping
const categoryColors: Record<string, { bg: string, text: string, darkBg: string, darkText: string }> = {
  general: { bg: "bg-gray-100", text: "text-gray-800", darkBg: "dark:bg-gray-800", darkText: "dark:text-gray-200" },
  business: { bg: "bg-blue-100", text: "text-blue-800", darkBg: "dark:bg-blue-900", darkText: "dark:text-blue-300" },
  technology: { bg: "bg-purple-100", text: "text-purple-800", darkBg: "dark:bg-purple-900", darkText: "dark:text-purple-300" },
  entertainment: { bg: "bg-pink-100", text: "text-pink-800", darkBg: "dark:bg-pink-900", darkText: "dark:text-pink-300" },
  sports: { bg: "bg-green-100", text: "text-green-800", darkBg: "dark:bg-green-900", darkText: "dark:text-green-300" },
  science: { bg: "bg-indigo-100", text: "text-indigo-800", darkBg: "dark:bg-indigo-900", darkText: "dark:text-indigo-300" },
  health: { bg: "bg-red-100", text: "text-red-800", darkBg: "dark:bg-red-900", darkText: "dark:text-red-300" },
};

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${activeCategory}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'API returned an error');
        }
        
        setArticles(data.articles || []);
        setFilteredArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  // Filter articles when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        (article.description && article.description.toLowerCase().includes(query))
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Loading skeletons for articles
  const ArticleSkeleton = () => (
    <Card className="border border-border overflow-hidden transition-all">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-4/5" />
      </CardHeader>
      <CardContent className="pt-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <ProtectedComponent>
      <motion.div 
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-4xl font-semibold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Latest News and Insights
          </motion.h1>
          <div className="flex flex-wrap justify-center mb-4 space-x-2">
            {!isLoading && !error && (
              <>
                <Badge className="bg-primary text-white text-sm px-3 py-1 mb-2 pointer-events-none">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  {filteredArticles.length} Articles
                </Badge>
                <Badge className={`${categoryColors[activeCategory].bg} ${categoryColors[activeCategory].text} ${categoryColors[activeCategory].darkBg} ${categoryColors[activeCategory].darkText} text-sm px-3 py-1 mb-2 pointer-events-none`}>
                  <TagIcon className="w-4 h-4 mr-1" />
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                </Badge>
              </>
            )}
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay updated with the latest stories and developments across various industries and topics.
          </p>

          <motion.div 
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-primary/20 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>

        {/* Modern categories section */}
        <motion.div 
          className="mb-10 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow-sm max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-medium mb-4 text-center">Browse Categories</h2>
          <div className="flex justify-center overflow-x-auto py-2 hide-scrollbar">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all
                    ${activeCategory === category 
                      ? `${categoryColors[category].bg} ${categoryColors[category].text} ${categoryColors[category].darkBg} ${categoryColors[category].darkText} shadow-sm transform scale-105`
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                    }
                  `}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="text-center p-8 mb-8 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircleIcon className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-800 dark:text-red-300 mb-2">Unable to load news</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Retry fetching by resetting the active category
                setActiveCategory(activeCategory);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {!error && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              // Show skeletons while loading
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <ArticleSkeleton />
                </motion.div>
              ))
            ) : filteredArticles.length === 0 ? (
              // Show empty state when no articles match search
              <motion.div 
                className="col-span-full text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No articles found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or select a different category
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </motion.div>
            ) : (
              // Show articles
              filteredArticles.map((article, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                >
                  <Card className="border border-border overflow-hidden transition-all hover:shadow-md group">
                    {article.urlToImage ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${categoryColors[activeCategory].bg} ${categoryColors[activeCategory].text} ${categoryColors[activeCategory].darkBg} ${categoryColors[activeCategory].darkText} pointer-events-none`}>
                            {activeCategory}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative">
                        <NewspaperIcon className="h-12 w-12 text-gray-400" />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${categoryColors[activeCategory].bg} ${categoryColors[activeCategory].text} ${categoryColors[activeCategory].darkBg} ${categoryColors[activeCategory].darkText} pointer-events-none`}>
                            {activeCategory}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-2 flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 pointer-events-none">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {formatDate(article.publishedAt)}
                        </Badge>
                        {article.source.name && (
                          <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 pointer-events-none">
                            {article.source.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl leading-tight font-semibold line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-muted-foreground mb-4 line-clamp-3">{article.description || "No description available"}</p>
                      <div className="flex justify-between items-center mt-4">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary font-medium hover:underline group"
                        >
                          Read more 
                          <ChevronRightIcon className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        {session && (
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <BookmarkIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </ProtectedComponent>
  );
}