"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  Home,
  Building2,
  LandPlot,
  Mic,
  ChevronDown,
  BedDouble,
  Key,
  ShoppingBag,
  Zap,
  Bath,
  Maximize,
  Heart,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Actions principales (style Airbnb - sans Vendre)
const actions = [
  {
    id: "rent",
    label: "Louer",
    icon: Key,
    description: "Trouvez votre location",
  },
  {
    id: "buy",
    label: "Acheter",
    icon: ShoppingBag,
    description: "Devenez propriétaire",
  },
];

// Types de biens
const propertyTypes = [
  { id: "house", label: "Maison", icon: Home },
  { id: "apartment", label: "Appartement", icon: Building2 },
  { id: "land", label: "Terrain", icon: LandPlot },
  { id: "commercial", label: "Commercial", icon: Building2 },
];

// Quartiers populaires avec infos
const popularLocations = [
  { id: "gombe", name: "Gombe", count: 245 },
  { id: "ngaliema", name: "Ngaliema", count: 189 },
  { id: "ma-campagne", name: "Ma Campagne", count: 156 },
  { id: "limete", name: "Limete", count: 134 },
  { id: "bandalungwa", name: "Bandalungwa", count: 98 },
  { id: "kintambo", name: "Kintambo", count: 87 },
];

// Options chambres
const bedroomOptions = [
  { id: "studio", label: "Studio", value: "0" },
  { id: "1", label: "1 chambre", value: "1" },
  { id: "2", label: "2 chambres", value: "2" },
  { id: "3", label: "3 chambres", value: "3" },
  { id: "4", label: "4 chambres", value: "4" },
  { id: "5+", label: "5+ chambres", value: "5+" },
];

// Suggestions IA dynamiques selon l'action
const aiSuggestions = {
  buy: [
    "Villa moderne avec piscine à Gombe",
    "Appartement 3 chambres vue fleuve Ngaliema",
    "Terrain 500m² constructible Limete",
    "Maison familiale sécurisée Ma Campagne",
  ],
  rent: [
    "Appartement meublé 2 chambres Gombe",
    "Maison avec jardin pour famille Ngaliema",
    "Studio moderne centre-ville",
    "Villa de standing pour expatrié",
  ],
};

// Biens immobiliers (données fictives)
const properties = [
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
    isForRent: true,
    isForSale: true,
    isNew: true,
    isVerified: true,
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
    isForRent: true,
    isForSale: false,
    isNew: false,
    isVerified: true,
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
    isForRent: false,
    isForSale: true,
    isNew: true,
    isVerified: true,
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
    isForRent: true,
    isForSale: true,
    isNew: false,
    isVerified: true,
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
    isForRent: false,
    isForSale: true,
    isNew: true,
    isVerified: true,
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
    isForRent: true,
    isForSale: true,
    isNew: false,
    isVerified: true,
  },
];

export function HeroSection() {
  const [activeAction, setActiveAction] = useState("rent");
  const [location, setLocation] = useState<{ id: string; name: string } | null>(
    null
  );
  const [propertyType, setPropertyType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Gestion du scroll pour sticky search
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom =
          heroRef.current.offsetTop + heroRef.current.offsetHeight - 200;
        setIsSticky(window.scrollY > heroBottom);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
        setShowTypeDropdown(false);
        setShowBedroomsDropdown(false);
        setShowAiPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer les autres dropdowns quand on en ouvre un
  const openDropdown = (dropdown: "location" | "type" | "bedrooms") => {
    setShowLocationDropdown(
      dropdown === "location" ? !showLocationDropdown : false
    );
    setShowTypeDropdown(dropdown === "type" ? !showTypeDropdown : false);
    setShowBedroomsDropdown(
      dropdown === "bedrooms" ? !showBedroomsDropdown : false
    );
    setShowAiPanel(false);
  };

  // Détermine si on doit afficher les options de chambres
  const showBedroomsOption =
    propertyType === "house" || propertyType === "apartment";

  // Filtrer les biens selon l'action sélectionnée
  const filteredProperties = properties.filter((property) => {
    if (activeAction === "rent") {
      return property.isForRent;
    } else if (activeAction === "buy") {
      return property.isForSale;
    }
    return true;
  });

  // Titre dynamique selon l'action
  const getTitle = () => {
    switch (activeAction) {
      case "buy":
        return "Achetez";
      case "rent":
        return "Louez";
      default:
        return "Trouvez";
    }
  };

  const getSubtitle = () => {
    switch (activeAction) {
      case "buy":
        return "Trouvez le bien de vos rêves parmi nos propriétés certifiées";
      case "rent":
        return "Découvrez des locations vérifiées et sécurisées";
      default:
        return "Biens certifiés, vérification légale incluse";
    }
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-center bg-gradient-to-b from-slate-50 to-white overflow-hidden"
      >
        {/* Background futuriste clair optimisé */}
        <div className="absolute inset-0">
          {/* Grille futuriste subtile - Statique */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Orbes statiques (beaucoup moins coûteux que les animés) */}
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[80px]" />
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          {/* Badge IA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Propulsé par l'IA
              </span>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight mb-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeAction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600"
                >
                  {getTitle()}
                </motion.span>
              </AnimatePresence>{" "}
              votre bien en RDC
            </h1>
            <motion.p
              key={activeAction + "-subtitle"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-slate-600 max-w-xl mx-auto"
            >
              {getSubtitle()}
            </motion.p>
          </motion.div>

          {/* Module de recherche */}
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Tabs d'action style Airbnb */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-slate-100 rounded-full p-1.5 border border-slate-200">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      setActiveAction(action.id);
                      setPropertyType("");
                      setBedrooms("");
                      setLocation(null);
                    }}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeAction === action.id
                        ? "bg-white text-slate-900 shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                    {activeAction === action.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Barre de recherche principale */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
              {/* Recherche IA */}
              <div
                className="px-5 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setShowAiPanel(!showAiPanel)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Décrivez ce que vous cherchez à ${
                        activeAction === "rent" ? "louer" : "acheter"
                      }...`}
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onFocus={() => setShowAiPanel(true)}
                      className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsListening(!isListening);
                    }}
                    className={`p-2.5 rounded-full transition-all ${
                      isListening
                        ? "bg-red-100 text-red-500 animate-pulse"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Panel suggestions IA */}
              <AnimatePresence>
                {showAiPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-slate-100 overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-cyan-50">
                      <p className="text-xs text-slate-500 mb-3 font-medium">
                        Suggestions IA pour vous
                      </p>
                      <div className="space-y-1">
                        {aiSuggestions[
                          activeAction as keyof typeof aiSuggestions
                        ]?.map((suggestion, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => {
                              setAiQuery(suggestion);
                              setShowAiPanel(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white transition-colors text-left group"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-slate-700 group-hover:text-slate-900">
                              {suggestion}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Champs de recherche dynamiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                {/* Emplacement */}
                <div className="relative">
                  <button
                    onClick={() => openDropdown("location")}
                    className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium">
                          Où ?
                        </p>
                        <p
                          className={`text-sm truncate ${
                            location ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {location?.name || "Choisir un quartier"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          showLocationDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Emplacement */}
                  <AnimatePresence>
                    {showLocationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-3 w-[420px] bg-white rounded-[32px] border border-slate-200 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-6">
                          <p className="text-sm font-medium text-slate-800 mb-4">
                            Suggestions de destinations
                          </p>
                          <div className="space-y-2">
                            {popularLocations.map((loc, index) => {
                              const icons = [
                                {
                                  bg: "bg-gradient-to-br from-rose-100 to-rose-200",
                                  color: "text-rose-500",
                                },
                                {
                                  bg: "bg-gradient-to-br from-violet-100 to-violet-200",
                                  color: "text-violet-500",
                                },
                                {
                                  bg: "bg-gradient-to-br from-amber-100 to-amber-200",
                                  color: "text-amber-600",
                                },
                                {
                                  bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
                                  color: "text-emerald-500",
                                },
                                {
                                  bg: "bg-gradient-to-br from-sky-100 to-sky-200",
                                  color: "text-sky-500",
                                },
                                {
                                  bg: "bg-gradient-to-br from-orange-100 to-orange-200",
                                  color: "text-orange-500",
                                },
                              ];
                              const iconStyle = icons[index % icons.length];
                              return (
                                <button
                                  key={loc.id}
                                  onClick={() => {
                                    setLocation(loc);
                                    setShowLocationDropdown(false);
                                  }}
                                  className={`w-full flex items-center gap-4 p-3 text-left rounded-2xl transition-colors ${
                                    location?.id === loc.id
                                      ? "bg-slate-100"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div
                                    className={`w-12 h-12 ${iconStyle.bg} rounded-xl flex items-center justify-center`}
                                  >
                                    <MapPin
                                      className={`w-5 h-5 ${iconStyle.color}`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900">
                                      {loc.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {loc.count} biens disponibles
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type de bien */}
                <div className="relative">
                  <button
                    onClick={() => openDropdown("type")}
                    className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-cyan-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium">
                          Type
                        </p>
                        <p
                          className={`text-sm truncate ${
                            propertyType ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {propertyTypes.find((t) => t.id === propertyType)
                            ?.label || "Type de bien"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          showTypeDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Type */}
                  <AnimatePresence>
                    {showTypeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-[32px] border border-slate-200 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4">
                          {propertyTypes.map((type, index) => {
                            const icons = [
                              {
                                bg: "bg-gradient-to-br from-blue-100 to-blue-200",
                                color: "text-blue-500",
                              },
                              {
                                bg: "bg-gradient-to-br from-purple-100 to-purple-200",
                                color: "text-purple-500",
                              },
                              {
                                bg: "bg-gradient-to-br from-green-100 to-green-200",
                                color: "text-green-500",
                              },
                              {
                                bg: "bg-gradient-to-br from-orange-100 to-orange-200",
                                color: "text-orange-500",
                              },
                            ];
                            const iconStyle = icons[index % icons.length];
                            return (
                              <button
                                key={type.id}
                                onClick={() => {
                                  setPropertyType(type.id);
                                  setShowTypeDropdown(false);
                                  if (
                                    type.id === "land" ||
                                    type.id === "commercial"
                                  ) {
                                    setBedrooms("");
                                  }
                                }}
                                className={`w-full flex items-center gap-4 p-3 text-left rounded-2xl transition-colors ${
                                  propertyType === type.id
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 ${iconStyle.bg} rounded-xl flex items-center justify-center`}
                                >
                                  <type.icon
                                    className={`w-5 h-5 ${iconStyle.color}`}
                                  />
                                </div>
                                <span className="font-medium text-slate-900">
                                  {type.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chambres (conditionnel) */}
                <div className="relative">
                  <button
                    onClick={() =>
                      showBedroomsOption && openDropdown("bedrooms")
                    }
                    disabled={!showBedroomsOption}
                    className={`w-full px-5 py-4 text-left transition-colors ${
                      showBedroomsOption
                        ? "hover:bg-slate-50"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BedDouble className="w-5 h-5 text-violet-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium">
                          Chambres
                        </p>
                        <p
                          className={`text-sm truncate ${
                            bedrooms ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {bedroomOptions.find((b) => b.id === bedrooms)
                            ?.label || "Nombre"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          showBedroomsDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Chambres */}
                  <AnimatePresence>
                    {showBedroomsDropdown && showBedroomsOption && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-56 bg-white rounded-[32px] border border-slate-200 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4">
                          {bedroomOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setBedrooms(option.id);
                                setShowBedroomsDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left rounded-2xl font-medium transition-colors ${
                                bedrooms === option.id
                                  ? "bg-slate-100 text-slate-900"
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bouton Rechercher */}
                <div className="p-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/30"
                  >
                    <Search className="w-5 h-5" />
                    <span>Rechercher</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>2,500+ biens certifiés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Vérification légale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                <span>0 litige</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Section Biens filtrés */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {/* Header de la section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeAction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {activeAction === "rent" ? "À louer" : "À acheter"}
                  </motion.span>
                </AnimatePresence>{" "}
                près de vous
              </h2>
              <p className="text-slate-500 mt-1">
                {filteredProperties.length} bien
                {filteredProperties.length > 1 ? "s" : ""} disponible
                {filteredProperties.length > 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href={
                activeAction === "rent"
                  ? "/properties?type=rent"
                  : "/properties?type=buy"
              }
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Grille de biens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProperties.slice(0, 6).map((property, index) => (
                <motion.div
                  key={`${activeAction}-${property.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {property.isNew && (
                            <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                              Nouveau
                            </span>
                          )}
                          {property.isVerified && (
                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3 text-emerald-500" />
                              Vérifié
                            </span>
                          )}
                        </div>

                        {/* Favoris */}
                        <button
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            // Toggle favorite
                          }}
                        >
                          <Heart className="w-4 h-4 text-slate-600" />
                        </button>

                        {/* Type badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {propertyTypes.find((t) => t.id === property.type)
                              ?.label || property.type}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Prix */}
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-base sm:text-xl font-bold text-slate-900">
                            {activeAction === "rent"
                              ? `$${property.pricePerMonth?.toLocaleString()}`
                              : `$${property.price.toLocaleString()}`}
                          </span>
                          {activeAction === "rent" && (
                            <span className="text-slate-500 text-xs sm:text-sm">
                              /mois
                            </span>
                          )}
                        </div>

                        {/* Titre */}
                        <h3 className="text-sm sm:text-base truncate font-medium text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                          {property.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 text-sm mb-3">
                          <MapPin className="w-3.5 h-3.5" />
                          {property.location}
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-slate-600 text-xs sm:text-sm">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center gap-1.5">
                              <BedDouble className="w-4 h-4 text-slate-400" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Bath className="w-4 h-4 text-slate-400" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Maximize className="w-4 h-4 text-slate-400" />
                            <span>{property.area} m²</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Message si aucun bien */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucun bien disponible
              </h3>
              <p className="text-slate-500">
                {activeAction === "rent"
                  ? "Aucun bien à louer pour le moment"
                  : "Aucun bien à vendre pour le moment"}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
