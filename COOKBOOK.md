# Cookbook: Integrace Replit projektu do Next.js

## 📋 Přehled procesu

Tento dokument popisuje standardní postup pro integraci komponent a stránek z Replit projektu do Next.js aplikace.

**Workflow:**
1. Design v Figma → 2. Implementace v Replit → 3. Integrace do Next.js (tento cookbook)

---

## 🔍 KROK 1: Analýza Replit projektu

### 1.1 Prozkoumat strukturu projektu

```bash
# Najdi hlavní zdrojové soubory
ReplitProject/
├── client/
│   └── src/
│       ├── pages/        # Stránky k převodu
│       ├── components/    # UI komponenty
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utility funkce
│       ├── index.css      # Globální styly
│       ├── App.tsx        # Hlavní komponenta (ignorovat)
│       └── main.tsx       # Entry point (ignorovat)
```

### 1.2 Identifikovat co kopírovat

✅ **KOPÍROVAT:**
- `pages/*` → `app/[route]/page.tsx`
- `components/*` → `app/components/*`
- `hooks/*` → `app/hooks/*`
- `lib/*` → `app/lib/*` (nebo `lib/*` podle struktury)
- `index.css` → sloučit do `app/globals.css`
- Assets z `public/` → `public/assets/`

❌ **IGNOROVAT:**
- `main.tsx` (Next.js má vlastní)
- `App.tsx` (Next.js má vlastní)
- `index.html` (Next.js má vlastní)
- `vite.config.ts` (Next.js má vlastní)
- Server-side soubory

### 1.3 Zkontrolovat závislosti

```bash
# Zkontroluj package.json v Replit projektu
# Identifikuj všechny @radix-ui, framer-motion, atd.
```

---

## 📦 KROK 2: Příprava Next.js projektu

### 2.1 Vytvořit strukturu složek

```bash
app/
├── auth/              # Pro auth stránky
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
├── components/
│   └── ui/            # UI komponenty (pokud ještě nejsou)
├── lib/               # Utility funkce
├── hooks/             # Custom hooks
└── globals.css        # Globální styly
```

### 2.2 Zkontrolovat tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["app/components/*"],
      "@assets/*": ["public/assets/*"],
      "@lib/*": ["lib/*"],           // Pro soubory v lib/
      "@/lib/*": ["app/lib/*"],      // Pro soubory v app/lib/
      "@/*": ["app/*"]
    }
  }
}
```

**DŮLEŽITÉ:** 
- `@/lib/*` mapuje na `app/lib/*` (Next.js očekává v app/)
- `@lib/*` mapuje na `lib/*` (root level)
- Volíme `app/lib/` pro konzistenci s Next.js App Router

---

## 🔄 KROK 3: Konverze stránek a komponent

### 3.1 Konverze stránky (page.tsx)

**Z Replit:**
```tsx
// pages/login-page.tsx
import { Link } from "wouter";
import bgImage from "@assets/image.png";
```

**Do Next.js:**
```tsx
// app/auth/login/page.tsx
"use client";  // ⚠️ DŮLEŽITÉ pro client-side komponenty

import Link from "next/link";
const bgImage = "/assets/image.png";  // Statická cesta

export default function LoginPage() {
  // ... komponenta
}
```

### 3.2 Klíčové změny v importech

| Replit | Next.js |
|--------|---------|
| `import { Link } from "wouter"` | `import Link from "next/link"` |
| `import bgImage from "@assets/..."` | `const bgImage = "/assets/..."` |
| `<Link href="/login">` | `<Link href="/auth/login">` |
| `@components/ui/button` | `@components/ui/button` ✅ (stejné) |
| `@lib/utils` | `@/lib/utils` (pokud v app/lib/) |

### 3.3 Oprava Link komponenty

**Replit:**
```tsx
<Link href="/login">
  <a>Sign in</a>
</Link>
```

**Next.js:**
```tsx
<Link href="/auth/login" className="...">
  Sign in
</Link>
```

### 3.4 Oprava obrázků

**Replit:**
```tsx
import bgImage from "@assets/image.png";
<img src={bgImage} />
<div style={{ backgroundImage: `url(${bgImage})` }} />
```

**Next.js:**
```tsx
const bgImage = "/assets/image.png";
<img src={bgImage} />
<div style={{ backgroundImage: `url(${bgImage})` }} />
```

---

## 🎨 KROK 4: Sloučení CSS stylů

### 4.1 Zkopírovat obsah z index.css

```bash
# Z Replit: client/src/index.css
# Do Next.js: app/globals.css
```

### 4.2 Sloučit do globals.css

```css
@import "tailwindcss";
/* NEPOUŽÍVAT: @import "tw-animate-css"; pokud není nainstalováno */

/* Zkopírovat všechny CSS proměnné */
@theme inline {
  /* ... */
}

:root {
  /* ... */
}

.dark {
  /* ... */
}

@layer base {
  /* ... */
}

@layer utilities {
  /* ... */
}
```

**POZOR:** Odstranit `@import "tw-animate-css";` pokud není v package.json

---

## 📚 KROK 5: Instalace závislostí

### 5.1 Zkontrolovat všechny potřebné balíčky

Z Replit `package.json` identifikovat:

**Radix UI komponenty:**
```json
"@radix-ui/react-accordion": "^1.2.12",
"@radix-ui/react-alert-dialog": "^1.1.15",
"@radix-ui/react-checkbox": "^1.3.3",
"@radix-ui/react-dialog": "^1.1.15",
// ... všechny používané
```

**Ostatní:**
```json
"@tanstack/react-query": "^5.60.5",
"framer-motion": "^12.23.24",
"react-hook-form": "^7.67.0",
"zod": "^4.1.13",
"@hookform/resolvers": "^5.2.2",
"lucide-react": "^0.555.0"
```

### 5.2 Přidat do Next.js package.json

```bash
# Přidat všechny závislosti do dependencies
npm install
```

---

## 🔧 KROK 6: Setup Providers a Layout

### 6.1 Vytvořit app/providers.tsx

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

### 6.2 Aktualizovat app/layout.tsx

```tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 6.3 Zkontrolovat queryClient

Pokud používá `@tanstack/react-query`, zkontrolovat:
- `app/lib/queryClient.ts` existuje
- Exportuje `queryClient` instance

---

## 🐛 KROK 7: Oprava běžných chyb

### 7.1 "Module not found: Can't resolve '@/lib/utils'"

**Problém:** Next.js hledá v `app/lib/` ale soubor je v `lib/`

**Řešení:**
```bash
# Zkopírovat soubory do app/lib/
cp lib/utils.ts app/lib/utils.ts
cp lib/queryClient.ts app/lib/queryClient.ts
```

### 7.2 "Module not found: Can't resolve '@radix-ui/react-*'"

**Problém:** Chybí závislosti

**Řešení:**
```bash
# Přidat do package.json a nainstalovat
npm install @radix-ui/react-checkbox @radix-ui/react-dialog ...
```

### 7.3 "Cannot use import statement outside a module"

**Problém:** Chybí `"use client"` directive

**Řešení:**
```tsx
"use client";  // Na začátku souboru

import { useState } from "react";
// ...
```

### 7.4 Obrázky se nenačítají

**Problém:** Špatná cesta k obrázkům

**Řešení:**
```tsx
// ❌ Špatně
import bgImage from "@assets/image.png";

// ✅ Správně
const bgImage = "/assets/image.png";
```

### 7.5 Link nefunguje

**Problém:** Používá se wouter místo next/link

**Řešení:**
```tsx
// ❌ Špatně
import { Link } from "wouter";
<Link href="/login"><a>Login</a></Link>

// ✅ Správně
import Link from "next/link";
<Link href="/auth/login">Login</Link>
```

---

## ✅ KROK 8: Testování

### 8.1 Spustit dev server

```bash
npm run dev
```

### 8.2 Otestovat všechny stránky

- http://localhost:3000/auth/login
- http://localhost:3000/auth/signup
- http://localhost:3000/auth/forgot-password

### 8.3 Zkontrolovat konzoli pro chyby

- Otevřít DevTools (F12)
- Zkontrolovat Console a Network tabs

---

## 📝 KROK 9: Git commit

### 9.1 Přidat změny

```bash
git add .
git status  # Zkontrolovat co se přidává
```

### 9.2 Commit

```bash
git commit -m "Add [feature] screens from Replit project"
```

### 9.3 Push (pokud je remote)

```bash
git push origin main
```

---

## 🎯 Checklist před dokončením

- [ ] Všechny stránky převedeny na `app/[route]/page.tsx`
- [ ] Všechny importy opraveny (`wouter` → `next/link`)
- [ ] Obrázky používají statické cesty (`/assets/...`)
- [ ] CSS styly sloučeny do `globals.css`
- [ ] Všechny závislosti přidány do `package.json`
- [ ] `providers.tsx` vytvořen a přidán do `layout.tsx`
- [ ] `queryClient` v `app/lib/` (nebo správně mapován)
- [ ] Všechny komponenty mají `"use client"` pokud potřebují
- [ ] Dev server běží bez chyb
- [ ] Všechny stránky se načítají správně
- [ ] Git commit vytvořen

---

## 🔑 Klíčové Lessons Learned

### 1. Struktura souborů
- **Replit:** `pages/login-page.tsx`
- **Next.js:** `app/auth/login/page.tsx`
- Vždy vytvářet složku `[route]/` s `page.tsx` uvnitř

### 2. Client Components
- Komponenty s hooks (`useState`, `useForm`) MUSÍ mít `"use client"`
- Server Components (default) nemohou používat hooks

### 3. Import paths
- `@/lib/*` → `app/lib/*` (Next.js App Router)
- `@lib/*` → `lib/*` (root level)
- Volit `app/lib/` pro konzistenci

### 4. Routing
- Replit: `/login`, `/register`
- Next.js: `/auth/login`, `/auth/signup`
- Aktualizovat všechny Link komponenty

### 5. Assets
- Replit: `import image from "@assets/..."`
- Next.js: `const image = "/assets/..."`
- Vždy statické cesty pro public assets

### 6. Závislosti
- Zkontrolovat VŠECHNY `@radix-ui/react-*` balíčky
- Přidat všechny do `package.json` najednou
- `npm install` po přidání

### 7. Providers
- Vytvořit `app/providers.tsx` pro client-side providers
- Přidat do `layout.tsx` jako wrapper
- QueryClient, Toaster, TooltipProvider atd.

---

## 📚 Reference

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Radix UI Components](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)

---

## 🚀 Rychlý Start Template

```bash
# 1. Analýza
ls ReplitProject/client/src/

# 2. Vytvořit strukturu
mkdir -p app/auth/login app/auth/signup app/lib

# 3. Zkopírovat soubory
cp ReplitProject/client/src/pages/login-page.tsx app/auth/login/page.tsx
cp ReplitProject/client/src/lib/* app/lib/

# 4. Opravit importy (najít a nahradit)
# wouter → next/link
# @assets/ → /assets/
# Přidat "use client"

# 5. Přidat závislosti
# Upravit package.json
npm install

# 6. Test
npm run dev
```

---

**Poslední aktualizace:** 2025-01-XX  
**Verze:** 1.0

