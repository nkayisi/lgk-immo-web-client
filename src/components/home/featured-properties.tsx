"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  Shield,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Verified,
} from "lucide-react";
import Link from "next/link";

const properties = [
  {
    id: 1,
    title: "Villa moderne avec jardin",
    location: "Gombe, Kinshasa",
    price: 485000,
    rating: 4.9,
    reviews: 128,
    images: [
      "from-emerald-400 to-cyan-500",
      "from-violet-400 to-purple-500",
      "from-amber-400 to-orange-500",
    ],
    certified: true,
    superhost: true,
    type: "Villa",
    beds: 5,
    baths: 4,
  },
  {
    id: 2,
    title: "Appartement standing vue ville",
    location: "Ngaliema, Kinshasa",
    price: 180000,
    rating: 4.8,
    reviews: 89,
    images: [
      "from-rose-400 to-pink-500",
      "from-blue-400 to-indigo-500",
      "from-teal-400 to-emerald-500",
    ],
    certified: true,
    superhost: false,
    type: "Appartement",
    beds: 3,
    baths: 2,
  },
  {
    id: 3,
    title: "Terrain constructible 750m²",
    location: "Limete, Kinshasa",
    price: 95000,
    rating: 4.7,
    reviews: 45,
    images: [
      "from-amber-400 to-yellow-500",
      "from-lime-400 to-green-500",
      "from-cyan-400 to-blue-500",
    ],
    certified: true,
    superhost: true,
    type: "Terrain",
    beds: 0,
    baths: 0,
  },
  {
    id: 4,
    title: "Duplex familial sécurisé",
    location: "Ma Campagne, Kinshasa",
    price: 320000,
    rating: 4.95,
    reviews: 203,
    images: [
      "from-indigo-400 to-violet-500",
      "from-fuchsia-400 to-pink-500",
      "from-emerald-400 to-teal-500",
    ],
    certified: true,
    superhost: true,
    type: "Duplex",
    beds: 4,
    baths: 3,
  },
  {
    id: 5,
    title: "Studio meublé centre-ville",
    location: "Gombe, Kinshasa",
    price: 75000,
    rating: 4.6,
    reviews: 67,
    images: [
      "from-sky-400 to-blue-500",
      "from-orange-400 to-red-500",
      "from-green-400 to-emerald-500",
    ],
    certified: true,
    superhost: false,
    type: "Studio",
    beds: 1,
    baths: 1,
  },
  {
    id: 6,
    title: "Maison coloniale rénovée",
    location: "Barumbu, Kinshasa",
    price: 420000,
    rating: 4.85,
    reviews: 156,
    images: [
      "from-stone-400 to-neutral-500",
      "from-amber-400 to-orange-500",
      "from-emerald-400 to-green-500",
    ],
    certified: true,
    superhost: true,
    type: "Maison",
    beds: 6,
    baths: 4,
  },
];

function PropertyCard({ property }: { property: (typeof properties)[0] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
          {/* Gradient Background (placeholder for real images) */}
          <motion.div
            animate={{ opacity: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${property.images[currentImage]}`}
          />

          {/* Image Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/10"
          />

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 z-10"
          >
            <motion.div whileTap={{ scale: 0.9 }} className="p-2">
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "fill-black/30 text-white stroke-2"
                }`}
              />
            </motion.div>
          </button>

          {/* Certified Badge */}
          {property.certified && (
            <div className="absolute top-3 left-3 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-full text-xs font-medium text-slate-900 shadow-sm"
              >
                <Shield className="w-3 h-3 text-emerald-500" />
                Certifié
              </motion.div>
            </div>
          )}

          {/* Navigation Arrows */}
          <AnimatePresence>
            {isHovered && property.images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-md hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-md hover:scale-105 transition-transform"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Image Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {property.images.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scale: currentImage === idx ? 1 : 0.75,
                  opacity: currentImage === idx ? 1 : 0.5,
                }}
                className={`w-1.5 h-1.5 rounded-full bg-white shadow-sm`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
              <span className="text-sm font-medium text-slate-900">
                {property.rating}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {property.location}
          </div>

          {/* Type & Details */}
          <p className="text-sm text-slate-500">
            {property.type}
            {property.beds > 0 && ` · ${property.beds} ch.`}
            {property.baths > 0 && ` · ${property.baths} sdb`}
          </p>

          {/* Price */}
          <p className="pt-1">
            <span className="font-semibold text-slate-900">
              ${property.price.toLocaleString()}
            </span>
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

// Need to import AnimatePresence
import { AnimatePresence } from "framer-motion";

export function FeaturedProperties() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Biens à découvrir
            </h2>
            <p className="text-slate-500 mt-1">
              Sélection de propriétés certifiées à Kinshasa
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden sm:inline-flex text-sm font-medium text-slate-900 hover:text-emerald-600 transition-colors underline underline-offset-4"
          >
            Voir tout
          </Link>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Voir tous les biens
          </Link>
        </div>
      </div>
    </section>
  );
}
