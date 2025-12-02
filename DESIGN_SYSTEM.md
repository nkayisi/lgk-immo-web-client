# 🎨 Design System Ultra-Moderne - LGK Immo

## Direction Artistique

### Palette de Couleurs

```css
/* Primary */
--violet-600: #8B5CF6
--purple-600: #9333EA
--indigo-600: #4F46E5

/* Accent */
--cyan-400: #22D3EE
--green-400: #4ADE80

/* Neutral */
--slate-950: #020617
--slate-900: #0F172A
--slate-50: #F8FAFC
--white: #FFFFFF

/* Gradients */
from-violet-600 via-purple-600 to-indigo-600
from-slate-950 via-purple-950 to-slate-900
```

### Typographie

- **Font Family**: System UI, Inter
- **Headings**: text-6xl/7xl, font-bold, tracking-tight
- **Body**: text-lg/xl, text-slate-300/600
- **Gradient Text**: bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent

### Effets Visuels

#### Glassmorphism

```tsx
className = "bg-white/10 backdrop-blur-xl border border-white/20";
```

#### Neumorphism Léger

```tsx
className = "shadow-2xl shadow-violet-500/50";
```

#### Animations Framer Motion

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -10 }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
```

#### Floating Orbs

```tsx
<motion.div
  animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  className="absolute w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"
/>
```

### Composants

#### Buttons

**Primary CTA**

```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Link
    href="/register"
    className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-semibold overflow-hidden shadow-2xl shadow-violet-500/50"
  >
    <span className="relative z-10 flex items-center gap-2">
      Commencer gratuitement
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
</motion.div>
```

**Secondary CTA**

```tsx
<Link
  href="#featured"
  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all"
>
  Voir la démo
</Link>
```

#### Cards

**Property Card**

```tsx
<motion.div
  whileHover={{ y: -10, scale: 1.02 }}
  className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
>
  {/* Image */}
  <div className="aspect-[4/3] bg-gradient-to-br from-violet-500/20 to-indigo-500/20 relative overflow-hidden">
    {/* Content */}
  </div>

  {/* Info */}
  <div className="p-6 space-y-4">
    <h3 className="text-xl font-bold text-white">Titre</h3>
    <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
      $450,000
    </div>
  </div>

  {/* Hover Effect */}
  <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
</motion.div>
```

#### Badges

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium">
  <Sparkles className="w-4 h-4 text-violet-400" />
  Premium
</div>
```

### Layout

#### Section Spacing

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">{/* Content */}</div>
</section>
```

#### Grid

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{/* Items */}</div>
```

### Backgrounds

#### Dark Hero

```tsx
<section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
  {/* Mesh Gradients */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

  {/* Animated Grid */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
</section>
```

#### Light Section

```tsx
<section className="bg-gradient-to-b from-white to-slate-50">
  {/* Content */}
</section>
```

## Micro-Interactions

### Hover States

- **Scale**: 1.05
- **Translate Y**: -10px
- **Transition**: 0.3s ease

### Loading States

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  <Loader className="w-6 h-6" />
</motion.div>
```

### Stagger Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Responsive

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First

```tsx
className = "text-4xl md:text-5xl lg:text-6xl xl:text-7xl";
className =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8";
```

## Accessibilité

- Focus states avec ring-2 ring-violet-500
- Aria labels sur tous les boutons
- Alt text sur toutes les images
- Contraste WCAG AA minimum

---

**Design inspiré de**: Airbnb, Zillow, Apple, Stripe, Linear
