import { create } from "zustand";
import html2canvas from "html2canvas";
import { Extent } from "ol/extent";
import { convertExtentToWKT } from "@/entities/convertPolyToWKT";

import { useGeoJsonStore } from "./useGeoJsonStore";
import { convertGeoJSONToWKT } from "@/entities/convertGeojson";
import { toast } from "react-toastify";
import { generator_url } from "./urls";

// Типы для состояния карты
type MapState = {
  selectedFeatureId: string | number | null;
  setSelectedFeatureId: (id: string | number | null) => void;

  showWmsLayer2: boolean;
  setShowWmsLayer2: (show: boolean) => void;

  showGeojsonLayer: boolean;
  setShowGeojsonLayer: (show: boolean) => void;

  extent: [number, number, number, number] | null; // Текущий экстент карты
  isProcessing: boolean; // Флаг для блокировки кнопок
  setExtent: (extent: Extent) => void; // Установка экстента
  saveScreenshot: () => Promise<void>; // Сохранение скриншота
  saveScreenshotAndSend: () => Promise<void>; // Сохранение и отправка скриншота
  setIsProcessing: (isProcessing: boolean) => void; // Установка флага isProcessing
};

// Создание хранилища Zustand
export const useMapStore = create<MapState>((set, get) => ({
  showGeojsonLayer: true,
  setShowGeojsonLayer: (show) => set({ showGeojsonLayer: show }),
  showWmsLayer2: true,
  setShowWmsLayer2: (show) => set({ showWmsLayer2: show }),
  extent: null,
  isProcessing: false,

  selectedFeatureId: null,
  setSelectedFeatureId: (id) => set({ selectedFeatureId: id }),

  // Установка экстента
  setExtent: (extent) =>
    set({
      extent: [extent[0], extent[1], extent[2], extent[3]],
    }),

  // Установка флага isProcessing
  setIsProcessing: (isProcessing) => set({ isProcessing }),

  // Сохранение скриншота
  saveScreenshot: async () => {
    const mapElement = document.querySelector(".map-element") as HTMLElement;
    if (!mapElement) return;

    try {
      // Скрываем элементы управления картой
      const controls = mapElement.querySelectorAll(".ol-control");
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "none";
      });

      // Создаем скриншот
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        scale: 1,
      });

      // Восстанавливаем элементы управления
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "";
      });

      // Скачиваем скриншот
      const link = document.createElement("a");
      toast.success("Скриншот сохранен");
      link.href = canvas.toDataURL("image/png");
      link.download = "map-screenshot.png";
      link.click();
    } catch (error) {
      console.error("Ошибка при сохранении скриншота:", error);
      toast.error("Ошибка при сохранении скриншота.");
    }
  },

  // Сохранение и отправка скриншота
  saveScreenshotAndSend: async () => {
    const { features } = useGeoJsonStore.getState();
    const mapElement = document.querySelector(".map-element") as HTMLElement;
    const { extent, setIsProcessing, selectedFeatureId } = get();

    if (!mapElement || !extent) return;

    const startTime = Date.now();

    try {
      setIsProcessing(true);

      const controls = mapElement.querySelectorAll(".ol-control");
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "none";
      });
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        scale: 1,
      });
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "";
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) {
        throw new Error("Не удалось создать Blob из скриншота.");
      }

      const formData = new FormData();

      formData.append("image", blob, "map-screenshot.png");
      formData.append("extent", convertExtentToWKT(extent));
      // const wkt = convertGeoJSONToWKT(features[selectedFeatureId]);
      const selectedFeature = features.find(
        (f) => f.getId() === selectedFeatureId
      );
      if (selectedFeature) {
        const wkt = convertGeoJSONToWKT(selectedFeature);
        formData.append("projectArea", wkt ?? "");
      } else {
        console.error("Не найдена фича с выбранным ID");
      }

      console.log("Форма отправки", formData);

      // Отправляем данные на сервер
      const response = await fetch(generator_url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки на сервер.");
      }

      // Скачиваем полученный PPTX файл
      const pptxBlob = await response.blob();
      const url = window.URL.createObjectURL(pptxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "result.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      const endTime = Date.now(); // Конец замера времени
      const duration = (endTime - startTime) / 1000; // Время в секундах

      toast.success(
        `Скриншот успешно отправлен и файл PPTX скачан! Время выполнения: ${duration.toFixed(
          2
        )} секунд.`
      );
    } catch (error) {
      console.error("Ошибка при отправке скриншота:", error);
      toast.error("Ошибка при отправке скриншота.");
    } finally {
      setIsProcessing(false); // Разблокируем кнопку
    }
  },
}));

// Типы для вариантов карты
type MapVariantState = {
  variant: "osm" | "arcgis";
  setVariant: (variant: "osm" | "arcgis") => void;
};

// Создание хранилища для вариантов карты
export const useMapVariant = create<MapVariantState>((set) => ({
  variant: "arcgis",
  setVariant: (newVariant) => set({ variant: newVariant }),
}));
