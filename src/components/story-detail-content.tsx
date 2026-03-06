
import { useState } from "react"

import { Link } from "react-router-dom"
import {
  BookOpen,
  Eye,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Story } from "@/lib/data"
import { generateChapters, formatViews } from "@/lib/data"



export function StoryDetailContent({ story }: StoryDetailContentProps) {
  const [showAllChapters, setShowAllChapters] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const chapters = generateChapters(story.chapters)

  const displayedChapters = showAllChapters ? chapters : chapters.slice(0, 20)
  const sortedChapters =
    sortOrder === "desc" ? [...displayedChapters].reverse() : displayedChapters

  return (
    <div>
      {/* Story Header */}
      <div className="relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0">
          <img
            src={story.cover}
            alt=""
           
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl"
           
           />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Cover */}
            <div className="flex-shrink-0 self-center md:self-start">
              <div className="relative h-72 w-48 overflow-hidden rounded-lg shadow-2xl md:h-80 md:w-56">
                <img
                  src={story.cover}
                  alt={story.title}
                 
                  className="absolute inset-0 w-full h-full object-cover"
                 
                 
                 />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col">
              <h1 className="text-center font-serif text-2xl font-bold text-foreground md:text-left md:text-3xl lg:text-4xl">
                {story.title}
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground md:text-left">
                Tac gia: <span className="font-medium text-foreground">{story.author}</span>
              </p>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{story.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(story.views)} luot doc</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{story.chapters} chuong</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{story.updatedAt}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Badge
                  variant={story.status === "completed" ? "default" : "secondary"}
                >
                  {story.status === "completed" ? "Hoan Thanh" : "Dang Ra"}
                </Badge>
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {story.description}
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Button asChild size="lg" className="font-medium">
                  <Link to={`/story/${story.id}/read/1`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Doc Tu Dau
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <Link to={`/story/${story.id}/read/${story.chapters > 1 ? story.chapters : 1}`}>
                    Doc Moi Nhat
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Yeu thich</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Chia se</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="rounded-lg border border-border bg-card">
          {/* Chapter Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Danh Sach Chuong
              </h2>
              <span className="text-sm text-muted-foreground">
                ({story.chapters} chuong)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-sm text-muted-foreground"
            >
              {sortOrder === "desc" ? (
                <>
                  Moi nhat <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Cu nhat <ChevronUp className="ml-1 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>

          {/* Chapter Items */}
          <div className="divide-y divide-border">
            {sortedChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/story/${story.id}/read/${chapter.id}`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/50"
              >
                <span className="text-sm text-foreground hover:text-primary">
                  {chapter.title}
                </span>
                <div className="flex items-center gap-4">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatViews(chapter.views)} luot doc
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {chapter.createdAt}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More */}
          {!showAllChapters && chapters.length > 20 && (
            <div className="border-t border-border p-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllChapters(true)}
                className="font-medium"
              >
                Xem them {chapters.length - 20} chuong
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
