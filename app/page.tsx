import ServicesScrollClient from "@/components/ServicesScrollClient";
import ValueSectionClient from "@/components/ValueSectionClient";

interface HomeProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { service } = await searchParams;
  return (
    <>
      {/* Preload the GeoJSON so it is in the browser cache before
          WorldMap's Geographies component fetches it — eliminates the
          async fetch delay without adding the JSON to the JS bundle. */}
      <link rel="preload" href="/countries-50m.json" as="fetch" crossOrigin="anonymous" />
      <main style={{ background: "var(--dark)", minHeight: "100vh" }}>
        <ServicesScrollClient initialService={service} />
        <ValueSectionClient />
      </main>
    </>
  );
}
