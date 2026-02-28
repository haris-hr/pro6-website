// Layout for public pages that need their own HTML structure
// This bypasses the root layout by providing its own html/head/body

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pages in this route group render their own complete HTML document
  return <>{children}</>;
}
