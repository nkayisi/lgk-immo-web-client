"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bath,
  Bed,
  Building2,
  Edit3,
  Eye,
  Grid3X3,
  Home,
  List,
  MapPin,
  MoreVertical,
  Plus,
  Power,
  RefreshCw,
  Search,
  Square,
  Trash2,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// =============================================================================
// TYPES
// =============================================================================

type PropertyStatus = "active" | "pending" | "inactive" | "expired";
type PropertyType = "sale" | "rent";
type PropertyCategory = "house" | "apartment" | "land" | "commercial";

interface Property {
  id: string;
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  status: PropertyStatus;
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
  views: number;
  favorites: number;
  createdAt: string;
  expiresAt?: string;
}

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Villa moderne avec piscine",
    type: "sale",
    category: "house",
    status: "active",
    price: 450000,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Gombe",
    },
    features: {
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
    },
    images: ["/placeholder-property.jpg"],
    views: 234,
    favorites: 18,
    createdAt: "2024-01-15",
    expiresAt: "2024-04-15",
  },
  {
    id: "2",
    title: "Appartement de standing",
    type: "rent",
    category: "apartment",
    status: "active",
    price: 1500,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Ngaliema",
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
    },
    images: ["/placeholder-property.jpg"],
    views: 156,
    favorites: 12,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Terrain constructible",
    type: "sale",
    category: "land",
    status: "pending",
    price: 80000,
    currency: "USD",
    location: {
      city: "Kinshasa",
      neighborhood: "Mont-Ngafula",
    },
    features: {
      area: 500,
    },
    images: ["/placeholder-property.jpg"],
    views: 45,
    favorites: 3,
    createdAt: "2024-02-10",
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function PropertyCard({
  property,
  viewMode,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  property: Property;
  viewMode: "grid" | "list";
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const statusConfig: Record<
    PropertyStatus,
    {
      label: string;
      variant: "success" | "warning" | "secondary" | "destructive";
    }
  > = {
    active: { label: "Active", variant: "success" },
    pending: { label: "En attente", variant: "warning" },
    inactive: { label: "Inactive", variant: "secondary" },
    expired: { label: "Expirée", variant: "destructive" },
  };

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

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Image */}
              <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-slate-300" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {property.title}
                      </h3>
                      <Badge variant={statusConfig[property.status].variant}>
                        {statusConfig[property.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location.city},{" "}
                        {property.location.neighborhood}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          typeConfig[property.type].color
                        }`}
                      >
                        {typeConfig[property.type].label}
                      </span>
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
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {property.views} vues
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(property.id)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(property.id)}
                      >
                        <Power className="w-4 h-4 mr-2" />
                        {property.status === "active"
                          ? "Désactiver"
                          : "Activer"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(property.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        {/* Image */}
        <div className="relative h-48 bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon className="w-16 h-16 text-slate-300" />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                typeConfig[property.type].color
              }`}
            >
              {typeConfig[property.type].label}
            </span>
            <Badge variant={statusConfig[property.status].variant}>
              {statusConfig[property.status].label}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(property.id)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(property.id)}>
                  <Power className="w-4 h-4 mr-2" />
                  {property.status === "active" ? "Désactiver" : "Activer"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Republier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(property.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {property.views}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {property.favorites}
              </span>
            </div>
          </div>
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
        <Building2 className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Aucune annonce
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Vous n&apos;avez pas encore publié d&apos;annonce. Commencez dès
        maintenant pour atteindre des milliers d&apos;acheteurs potentiels.
      </p>
      <Link href="/dashboard/properties/new">
        <Button variant="primary" size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Créer ma première annonce
        </Button>
      </Link>
    </motion.div>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function PropertiesPage() {
  const [properties] = useState<Property[]>(mockProperties);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (id: string) => {
    // Navigation vers la page d'édition
    console.log("Edit property:", id);
  };

  const handleDelete = (id: string) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Logique de suppression
    console.log("Delete property:", propertyToDelete);
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleToggleStatus = (id: string) => {
    // Logique de changement de statut
    console.log("Toggle status:", id);
  };

  const stats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "active").length,
    pending: properties.filter((p) => p.status === "pending").length,
    views: properties.reduce((acc, p) => acc + p.views, 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes annonces</h1>
          <p className="text-slate-600 mt-1">
            Gérez et suivez vos annonces immobilières
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle annonce
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total annonces</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-600">
              {stats.active}
            </p>
            <p className="text-sm text-slate-500">Actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-slate-500">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.views}</p>
            <p className="text-sm text-slate-500">Vues totales</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Rechercher une annonce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expirée</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="popLayout">
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;annonce</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
