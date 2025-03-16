import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { useMapVariant } from "@/store/useMapStore";
import { useGeoJsonStore } from "@/store/useGeoJsonStore";

type SidebarProps = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const { variant, setVariant } = useMapVariant((state) => state);
  const clearGeoJson = useGeoJsonStore((state) => state.clearFeatures);
  const { features } = useGeoJsonStore();

  const toggleVariant = () => {
    const newVariant = variant === "osm" ? "arcgis" : "osm";
    setVariant(newVariant);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Button
            onClick={toggleVariant}
            className="bg-blue-900 hover:bg-blue-700"
          >
            {variant === "osm" ? "Переключить на ArcGIS" : "Переключить на OSM"}
          </Button>
          <Button
            onClick={clearGeoJson}
            disabled={features.length === 0}
            className="bg-blue-900 hover:bg-blue-700"
          >
            Очистить GeoJSON
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
