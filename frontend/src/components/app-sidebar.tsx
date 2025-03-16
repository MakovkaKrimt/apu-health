import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useMapStore } from "@/store/useMapStore";
import { useGeoJsonStore } from "@/store/useGeoJsonStore";
import { Trash } from "lucide-react";
// import logo from "@/shared/assets/logoDipp.png";
import logo from "@/shared/assets/apuLogo.png";
export function AppSidebar({ ...props }) {
  const router = useRouter();
  const extent = useMapStore((state) => state.extent);
  const { features, removeFeature } = useGeoJsonStore();
  const saveScreenshot = useMapStore((state) => state.saveScreenshot);
  // const saveScreenshotAndSend = useMapStore(
  //   (state) => state.saveScreenshotAndSend
  // );
  const { selectedFeatureId, setSelectedFeatureId } = useMapStore();
  const { isProcessing } = useMapStore();
  const [error, setError] = React.useState<string | null>(null);

  // Обработчик сохранения и отправки скриншота
  const handleSaveScreenshotAndSend = async () => {
    setError(null);
    try {
      useMapStore.getState().setShowWmsLayer2(false);
      useMapStore.getState().setShowGeojsonLayer(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      useMapStore.getState().setShowWmsLayer2(true);
      useMapStore.getState().setShowGeojsonLayer(true);
      await useMapStore.getState().saveScreenshotAndSend();
    } catch (err) {
      useMapStore.getState().setShowWmsLayer2(true);
      useMapStore.getState().setShowGeojsonLayer(true);
      setError("Ошибка при отправке скриншота." + err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/");
  };

  const handleRadioChange = (id: string | number) => {
    if (selectedFeatureId === id) {
      setSelectedFeatureId(null);
    } else {
      console.log(id);
      setSelectedFeatureId(id);
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="sidebarHeader">
          <img src={logo.src} alt="logo dipp" className="sidebarLogo" />
          <p className="sidebarLogoText ">Изрохроны</p>
        </div>
        <br />
        {extent ? (
          <>
            <p>
              Левый нижний угол: {extent[0].toFixed(4)}, {extent[1].toFixed(4)}
            </p>
            <p>
              Правый верхний угол: {extent[2].toFixed(4)},{" "}
              {extent[3].toFixed(4)}
            </p>
          </>
        ) : (
          <p>Экстент не определен</p>
        )}
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          onClick={saveScreenshot}
          className="bg-blue-900 hover:bg-blue-700"
        >
          Сохранить скриншот
        </Button>

        <Button
          onClick={handleSaveScreenshotAndSend}
          disabled={isProcessing}
          className="bg-blue-900 hover:bg-blue-700"
        >
          {isProcessing ? "Отправка... " : "Запустить генерацию презентации"}
        </Button>
        <br />

        {features.length === 0 ? <p>Нет загруженных GeoJSON</p> : null}
        <ul>
          {features.map((feature) => {
            const id = feature.getId();
            if (id === undefined) return null;

            return (
              <li
                key={id}
                className="flex justify-between items-center py-2 px-4 border-b"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="selectedFeature"
                    checked={selectedFeatureId === id}
                    onChange={() => handleRadioChange(id)}
                    className="mr-2"
                  />

                  <span
                    onClick={() => handleRadioChange(id)}
                    className="cursor-pointer select-none"
                  >
                    {feature.get("name") || `Feature ${id}`}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    const featureId = feature.getId();
                    if (featureId !== undefined) {
                      removeFeature(featureId);
                    }
                  }}
                  className="flex items-center justify-center text-white bg-red-500 hover:bg-red-700 p-2 ml-auto"
                >
                  <Trash className="w-5 h-5" />
                </Button>
              </li>
            );
          })}
        </ul>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={handleLogout}
          className="bg-blue-900 hover:bg-blue-500 w-full"
        >
          Выйти
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
