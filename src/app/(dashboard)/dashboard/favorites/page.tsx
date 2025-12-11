"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  HeartOff,
  MapPin,
  Bed,
  Bath,
  Square,
  Building2,
  Home,
  Search,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Trash2,
  Phone,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// =============================================================================
// TYPES
// =============================================================================

type PropertyType = "sale" | "rent";
type PropertyCategory = "house" | "apartment" | "land" | "commercial";

interface FavoriteProperty {
  id: string;
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  price: number;
  currency: string;
  location: {
    city: string;
    neighborhood: string;
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number;
  };
  images: string[];
  owner: {
    name: string;
    phone?: string;
  };
  savedAt: string;
}

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const mockFavorites: FavoriteProperty[] = [
  {
    id: "1",
    title: "Belle villa avec jardin",
    type: "sale",
    category: "house",
    price: 320000,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Binza",
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
    },
    images: ["/placeholder-property.jpg"],
    owner: {
      name: "Jean Kabongo",
      phone: "+243 812 345 678",
    },
    savedAt: "2024-02-15",
  },
  {
    id: "2",
    title: "Appartement meublé centre-ville",
    type: "rent",
    category: "apartment",
    price: 800,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Gombe",
    },
    features: {
      bedrooms: 2,
      bathrooms: 1,
      area: 85,
    },
    images: ["/placeholder-property.jpg"],
    owner: {
      name: "Marie Lumumba",
    },
    savedAt: "2024-02-10",
  },
  {
    id: "3",
    title: "Terrain à bâtir 1000m²",
    type: "sale",
    category: "land",
    price: 150000,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Mont-Ngafula",
    },
    features: {
      area: 1000,
    },
    images: ["/placeholder-property.jpg"],
    owner: {
      name: "Pierre Mukendi",
      phone: "+243 998 765 432",
    },
    savedAt: "2024-02-05",
  },
  {
    id: "4",
    title: "Duplex moderne avec terrasse",
    type: "rent",
    category: "apartment",
    price: 1200,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Ngaliema",
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
    },
    images: ["/placeholder-property.jpg"],
    owner: {
      name: "Sophie Tshisekedi",
    },
    savedAt: "2024-01-28",
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function FavoriteCard({
  property,
  viewMode,
  onRemove,
  onContact,
}: {
  property: FavoriteProperty;
  viewMode: "grid" | "list";
  onRemove: (id: string) => void;
  onContact: (property: FavoriteProperty) => void;
}) {
  const typeConfig: Record<PropertyType, { label: string; color: string }> = {
    sale: { label: "Vente", color: "bg-emerald-100 text-emerald-700" },
    rent: { label: "Location", color: "bg-blue-100 text-blue-700" },
  };

  const categoryIcons: Record<PropertyCategory, typeof Home> = {
    house: Home,
    apartment: Building2,
    land: Square,
    commercial: Building2,
  };

  const CategoryIcon = categoryIcons[property.category];

  const formatPrice = (price: number, currency: string, type: PropertyType) => {
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return `${formatted} ${currency}${type === "rent" ? "/mois" : ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Image */}
              <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-slate-300" />
                </div>
                <button
                  onClick={() => onRemove(property.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-white hover:text-rose-600 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {property.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          typeConfig[property.type].color
                        }`}
                      >
                        {typeConfig[property.type].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {property.location.city}, {property.location.neighborhood}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                    {formatPrice(
                      property.price,
                      property.currency,
                      property.type
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {property.features.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.features.bedrooms}
                      </span>
                    )}
                    {property.features.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.features.bathrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.features.area} m²
                    </span>
                    <span className="text-slate-400">
                      Sauvegardé le {formatDate(property.savedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onContact(property)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contacter
                    </Button>
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        {/* Image */}
        <div className="relative h-48 bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon className="w-16 h-16 text-slate-300" />
          </div>
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                typeConfig[property.type].color
              }`}
            >
              {typeConfig[property.type].label}
            </span>
          </div>
          <button
            onClick={() => onRemove(property.id)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-white hover:text-rose-600 transition-colors shadow-sm"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {property.location.city}, {property.location.neighborhood}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
            {property.features.bedrooms && (
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {property.features.bedrooms}
              </span>
            )}
            {property.features.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {property.features.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {property.features.area} m²
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-lg font-bold text-emerald-600">
              {formatPrice(property.price, property.currency, property.type)}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onContact(property)}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Link href={`/properties/${property.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Sauvegardé le {formatDate(property.savedAt)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
        <HeartOff className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Aucun favori
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Vous n&apos;avez pas encore sauvegardé de biens. Explorez nos annonces
        et ajoutez vos coups de cœur en favoris.
      </p>
      <Link href="/search">
        <Button variant="primary" size="lg" className="gap-2">
          <Search className="w-5 h-5" />
          Explorer les biens
        </Button>
      </Link>
    </motion.div>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>(mockFavorites);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<string | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<FavoriteProperty | null>(null);

  const filteredFavorites = favorites.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleRemove = (id: string) => {
    setPropertyToRemove(id);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = () => {
    if (propertyToRemove) {
      setFavorites((prev) => prev.filter((p) => p.id !== propertyToRemove));
    }
    setRemoveDialogOpen(false);
    setPropertyToRemove(null);
  };

  const handleContact = (property: FavoriteProperty) => {
    setSelectedProperty(property);
    setContactDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">Mes favoris</h1>
        <p className="text-slate-600 mt-1">
          {favorites.length} bien{favorites.length > 1 ? "s" : ""} sauvegardé
          {favorites.length > 1 ? "s" : ""}
        </p>
      </motion.div>

      {favorites.length > 0 && (
        <>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher dans mes favoris..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="sale">Vente</SelectItem>
                  <SelectItem value="rent">Location</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="popLayout">
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredFavorites.map((property) => (
              <FavoriteCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                onRemove={handleRemove}
                onContact={handleContact}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer des favoris</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer ce bien de vos favoris ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              <Trash2 className="w-4 h-4 mr-2" />
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter le propriétaire</DialogTitle>
            <DialogDescription>
              Envoyez un message concernant : {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                {selectedProperty?.owner.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {selectedProperty?.owner.name}
                </p>
                {selectedProperty?.owner.phone && (
                  <p className="text-sm text-slate-500">
                    {selectedProperty.owner.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {selectedProperty?.owner.phone && (
                <Button variant="outline" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Appeler
                </Button>
              )}
              <Link href="/dashboard/messages" className="flex-1">
                <Button variant="primary" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Envoyer un message
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
