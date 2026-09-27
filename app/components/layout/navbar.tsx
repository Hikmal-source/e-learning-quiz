import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary transition hover:text-primary-hover"
        >
          DevLearn
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-text-primary transition hover:text-primary"
          >
            Home
          </Link>

          <Link
            href="/#features"
            className="text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            Features
          </Link>

          <Link
            href="/#about"
            className="text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-muted"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}