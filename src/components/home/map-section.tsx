"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Home,
  Building2,
  LandPlot,
  Key,
  ShoppingBag,
  X,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Locate,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Fonction pour convertir lat/lng en coordonnées de tile
const latLngToTile = (lat: number, lng: number, zoom: number) => {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );
  return { x, y };
};

// Types de biens
const propertyTypes = [
  { id: "house", label: "Maison", icon: Home },
  { id: "apartment", label: "Appartement", icon: Building2 },
  { id: "land", label: "Terrain", icon: LandPlot },
  { id: "commercial", label: "Commercial", icon: Building2 },
];

// Biens immobiliers avec coordonnées (Kinshasa)
const mapProperties = [
  {
    id: "1",
    title: "Villa Moderne avec Piscine",
    type: "house",
    location: "Gombe, Kinshasa",
    price: 450000,
    pricePerMonth: 3500,
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    isForRent: true,
    isForSale: true,
    isNew: true,
    isVerified: true,
    lat: -4.3117,
    lng: 15.3125,
  },
  {
    id: "2",
    title: "Appartement Vue Fleuve",
    type: "apartment",
    location: "Ngaliema, Kinshasa",
    price: 180000,
    pricePerMonth: 1200,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    isForRent: true,
    isForSale: false,
    isNew: false,
    isVerified: true,
    lat: -4.328,
    lng: 15.265,
  },
  {
    id: "3",
    title: "Maison Familiale Sécurisée",
    type: "house",
    location: "Ma Campagne, Kinshasa",
    price: 320000,
    pricePerMonth: 2200,
    bedrooms: 5,
    bathrooms: 3,
    area: 280,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    isForRent: false,
    isForSale: true,
    isNew: true,
    isVerified: true,
    lat: -4.345,
    lng: 15.29,
  },
  {
    id: "4",
    title: "Studio Moderne Centre-ville",
    type: "apartment",
    location: "Gombe, Kinshasa",
    price: 75000,
    pricePerMonth: 600,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    isForRent: true,
    isForSale: true,
    isNew: false,
    isVerified: true,
    lat: -4.305,
    lng: 15.32,
  },
  {
    id: "5",
    title: "Terrain Constructible",
    type: "land",
    location: "Limete, Kinshasa",
    price: 95000,
    pricePerMonth: null,
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    isForRent: false,
    isForSale: true,
    isNew: true,
    isVerified: true,
    lat: -4.36,
    lng: 15.35,
  },
  {
    id: "6",
    title: "Penthouse de Luxe",
    type: "apartment",
    location: "Gombe, Kinshasa",
    price: 550000,
    pricePerMonth: 4500,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    isForRent: true,
    isForSale: true,
    isNew: false,
    isVerified: true,
    lat: -4.318,
    lng: 15.305,
  },
  {
    id: "7",
    title: "Duplex avec Terrasse",
    type: "apartment",
    location: "Bandalungwa, Kinshasa",
    price: 220000,
    pricePerMonth: 1800,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    isForRent: true,
    isForSale: true,
    isNew: true,
    isVerified: true,
    lat: -4.338,
    lng: 15.33,
  },
  {
    id: "8",
    title: "Villa Standing Ngaliema",
    type: "house",
    location: "Ngaliema, Kinshasa",
    price: 680000,
    pricePerMonth: 5000,
    bedrooms: 6,
    bathrooms: 4,
    area: 450,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    isForRent: true,
    isForSale: true,
    isNew: false,
    isVerified: true,
    lat: -4.322,
    lng: 15.255,
  },
];

// Taille des tiles
const TILE_SIZE = 256;

export function MapSection() {
  const [activeFilter, setActiveFilter] = useState<"rent" | "buy">("rent");
  const [selectedProperty, setSelectedProperty] = useState<
    (typeof mapProperties)[0] | null
  >(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  // État de la carte interactive
  const [zoom, setZoom] = useState(14);
  const [center, setCenter] = useState({ lat: -4.325, lng: 15.3 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Calculer les tiles visibles
  const tiles = useMemo(() => {
    const mapWidth = 900;
    const mapHeight = 600;

    const centerTile = latLngToTile(center.lat, center.lng, zoom);
    const tilesX = Math.ceil(mapWidth / TILE_SIZE) + 2;
    const tilesY = Math.ceil(mapHeight / TILE_SIZE) + 2;

    const result = [];
    const startX = centerTile.x - Math.floor(tilesX / 2);
    const startY = centerTile.y - Math.floor(tilesY / 2);

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const tileX = startX + x;
        const tileY = startY + y;
        result.push({
          x: tileX,
          y: tileY,
          url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
          posX: (x - tilesX / 2) * TILE_SIZE + offset.x,
          posY: (y - tilesY / 2) * TILE_SIZE + offset.y,
        });
      }
    }
    return result;
  }, [zoom, center, offset]);

  // Convertir lat/lng en position pixel sur la carte
  const latLngToPixel = useCallback(
    (lat: number, lng: number) => {
      const mapWidth = mapRef.current?.clientWidth || 900;
      const mapHeight = 600;

      const centerTile = latLngToTile(center.lat, center.lng, zoom);
      const pointTile = latLngToTile(lat, lng, zoom);

      // Position relative au centre en tiles
      const tileOffsetX = pointTile.x - centerTile.x;
      const tileOffsetY = pointTile.y - centerTile.y;

      // Calcul plus précis avec fraction de tile
      const n = Math.pow(2, zoom);
      const exactX = ((lng + 180) / 360) * n;
      const exactY =
        ((1 -
          Math.log(
            Math.tan((lat * Math.PI) / 180) +
              1 / Math.cos((lat * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
        n;
      const centerExactX = ((center.lng + 180) / 360) * n;
      const centerExactY =
        ((1 -
          Math.log(
            Math.tan((center.lat * Math.PI) / 180) +
              1 / Math.cos((center.lat * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
        n;

      const pixelX =
        mapWidth / 2 + (exactX - centerExactX) * TILE_SIZE + offset.x;
      const pixelY =
        mapHeight / 2 + (exactY - centerExactY) * TILE_SIZE + offset.y;

      return { x: pixelX, y: pixelY };
    },
    [zoom, center, offset]
  );

  // Filtrer les biens
  const filteredProperties = mapProperties.filter((property) => {
    if (activeFilter === "rent") return property.isForRent;
    return property.isForSale;
  });

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProperty]);

  // Gestion du zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 10));
  };

  const handleResetView = () => {
    setZoom(13);
    setCenter({ lat: -4.33, lng: 15.3 });
  };

  // Gestion du drag pour navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignorer si on clique sur un bouton ou le panel de détails
    if ((e.target as HTMLElement).closest("button")) return;
    if ((e.target as HTMLElement).closest("[data-panel]")) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      // Calculer le déplacement en pixels
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Mettre à jour l'offset pour un déplacement fluide
      setOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      // Mettre à jour le point de départ pour le prochain mouvement
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  // Quand on relâche, convertir l'offset en changement de centre
  const handleMouseUp = useCallback(() => {
    if (isDragging && (offset.x !== 0 || offset.y !== 0)) {
      // Convertir l'offset pixel en coordonnées géographiques
      const n = Math.pow(2, zoom);
      const lngPerPixel = 360 / (n * TILE_SIZE);
      const latPerPixel = 180 / (n * TILE_SIZE);

      setCenter((prev) => ({
        lat:
          prev.lat +
          offset.y * latPerPixel * Math.cos((prev.lat * Math.PI) / 180),
        lng: prev.lng - offset.x * lngPerPixel,
      }));
      setOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
  }, [isDragging, offset, zoom]);

  const formatPrice = (property: (typeof mapProperties)[0]) => {
    if (activeFilter === "rent" && property.pricePerMonth) {
      return `$${property.pricePerMonth.toLocaleString()}`;
    }
    return `$${(property.price / 1000).toFixed(0)}k`;
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) =>
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Explorez sur la carte
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Découvrez les biens disponibles dans votre zone préférée
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-slate-200">
            <button
              onClick={() => setActiveFilter("rent")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === "rent"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Key className="w-4 h-4" />
              Location
            </button>
            <button
              onClick={() => setActiveFilter("buy")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === "buy"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Achat
            </button>
          </div>
        </motion.div>

        {/* Carte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Container de la carte */}
          <div
            ref={mapRef}
            className={`relative h-[700px] select-none overflow-hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Tiles OpenStreetMap */}
            <div className="absolute inset-0">
              {tiles.map((tile) => (
                <img
                  key={`${tile.x}-${tile.y}-${zoom}`}
                  src={tile.url}
                  alt=""
                  className="absolute"
                  style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    left: `calc(50% + ${tile.posX}px)`,
                    top: `calc(50% + ${tile.posY}px)`,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              ))}
            </div>

            {/* Markers - au-dessus de la carte */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <AnimatePresence>
                {filteredProperties.map((property) => {
                  const position = latLngToPixel(property.lat, property.lng);
                  const isHovered = hoveredProperty === property.id;
                  const isSelected = selectedProperty?.id === property.id;

                  // Ne pas afficher si hors de la carte
                  const mapWidth = mapRef.current?.clientWidth || 900;
                  if (
                    position.x < -50 ||
                    position.x > mapWidth + 50 ||
                    position.y < -50 ||
                    position.y > 650
                  ) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={property.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute pointer-events-auto"
                      style={{
                        left: position.x,
                        top: position.y,
                        transform: "translate(-50%, -50%)",
                        zIndex: isSelected ? 30 : isHovered ? 20 : 10,
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        onMouseEnter={() => setHoveredProperty(property.id)}
                        onMouseLeave={() => setHoveredProperty(null)}
                        className={`relative px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white scale-110 z-20"
                            : isHovered
                            ? "bg-emerald-500 text-white z-20"
                            : "bg-white text-slate-900 hover:bg-emerald-500 hover:text-white"
                        }`}
                      >
                        {formatPrice(property)}

                        {/* Indicateur de type */}
                        <span
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected || isHovered
                              ? "bg-white text-slate-900"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {property.type === "house" && "🏠"}
                          {property.type === "apartment" && "🏢"}
                          {property.type === "land" && "🌳"}
                          {property.type === "commercial" && "🏪"}
                        </span>
                      </motion.button>

                      {/* Tooltip au survol */}
                      <AnimatePresence>
                        {isHovered && !isSelected && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30"
                          >
                            <div className="relative h-24">
                              <Image
                                src={property.image}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="font-medium text-slate-900 text-xs truncate">
                                {property.title}
                              </p>
                              <p className="text-slate-500 text-[10px] flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {property.location}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Légende */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
              <p className="text-xs font-medium text-slate-700 mb-2">Légende</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>🏠</span> Maison
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>🏢</span> Appartement
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>🌳</span> Terrain
                </div>
              </div>
            </div>

            {/* Compteur */}
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900">
                {filteredProperties.length} bien
                {filteredProperties.length > 1 ? "s" : ""}{" "}
                <span className="text-slate-500 font-normal">
                  {activeFilter === "rent" ? "à louer" : "à vendre"}
                </span>
              </p>
            </div>

            {/* Contrôles de zoom */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                title="Zoom avant"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                title="Zoom arrière"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetView}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                title="Recentrer"
              >
                <Locate className="w-5 h-5" />
              </button>
            </div>

            {/* Indicateur de zoom */}
            <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg border border-slate-200">
              <p className="text-xs font-medium text-slate-600">
                Zoom: {zoom}x
              </p>
            </div>
          </div>

          {/* Panel de détails */}
          <AnimatePresence>
            {selectedProperty && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-30 flex flex-col"
              >
                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {/* Header avec image */}
                  <div className="relative h-56 flex-shrink-0">
                    <Image
                      src={selectedProperty.images[currentImageIndex]}
                      alt={selectedProperty.title}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation images */}
                    {selectedProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-700" />
                        </button>

                        {/* Indicateurs */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selectedProperty.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? "bg-white w-4"
                                  : "bg-white/60 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Bouton fermer */}
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-700" />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {selectedProperty.isNew && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                          Nouveau
                        </span>
                      )}
                      {selectedProperty.isVerified && (
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3 text-emerald-500" />
                          Vérifié
                        </span>
                      )}
                    </div>

                    {/* Favoris */}
                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    {/* Prix */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {activeFilter === "rent"
                          ? `$${selectedProperty.pricePerMonth?.toLocaleString()}`
                          : `$${selectedProperty.price.toLocaleString()}`}
                      </span>
                      {activeFilter === "rent" && (
                        <span className="text-slate-500">/mois</span>
                      )}
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {selectedProperty.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProperty.location}</span>
                    </div>

                    {/* Type */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700 mb-4">
                      {propertyTypes.find((t) => t.id === selectedProperty.type)
                        ?.icon && (
                        <span>
                          {(() => {
                            const Icon = propertyTypes.find(
                              (t) => t.id === selectedProperty.type
                            )?.icon;
                            return Icon ? <Icon className="w-4 h-4" /> : null;
                          })()}
                        </span>
                      )}
                      {
                        propertyTypes.find(
                          (t) => t.id === selectedProperty.type
                        )?.label
                      }
                    </div>

                    {/* Caractéristiques */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100">
                      {selectedProperty.bedrooms > 0 && (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-900 font-semibold">
                            <BedDouble className="w-4 h-4 text-slate-400" />
                            {selectedProperty.bedrooms}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Chambres
                          </p>
                        </div>
                      )}
                      {selectedProperty.bathrooms > 0 && (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-900 font-semibold">
                            <Bath className="w-4 h-4 text-slate-400" />
                            {selectedProperty.bathrooms}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Salles de bain
                          </p>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-900 font-semibold">
                          <Maximize className="w-4 h-4 text-slate-400" />
                          {selectedProperty.area}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">m²</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 space-y-3 pb-5">
                      <Link
                        href={`/properties/${selectedProperty.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Voir les détails
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
                        Contacter le propriétaire
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Cliquez sur un prix pour voir les détails du bien
        </motion.p>
      </div>
    </section>
  );
}
