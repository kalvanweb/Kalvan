import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="label-eyebrow">404</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-charcoal/60">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
