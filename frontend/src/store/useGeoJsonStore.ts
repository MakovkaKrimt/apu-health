import { create } from "zustand";
import { Feature } from "ol";
import { Vector as VectorSource } from "ol/source";

// Глобальный vectorSource (для хранения и удаления фич с карты)
export const vectorSource = new VectorSource();

interface GeoJsonStore {
  features: Feature[]; // Массив фич
  addFeature: (feature: Feature) => void; // Метод для добавления фичи
  removeFeature: (featureId: string | number) => void; // Метод для удаления фичи
  clearFeatures: () => void; // Метод для очистки всех фич
}

export const useGeoJsonStore = create<GeoJsonStore>((set) => ({
  features: [],

  addFeature: (feature) => {
    // Если у фичи нет ID, генерируем его
    if (!feature.getId()) {
      feature.setId(`feature-${Date.now()}-${Math.random()}`);
    }

    // Добавляем фичу на карту
    vectorSource.addFeature(feature);

    set((state) => {
      // Проверяем, если фича уже добавлена (по ID), то не добавляем повторно
      const featureExists = state.features.some(
        (f) => String(f.getId()) === String(feature.getId()) // Используем getId() для получения ID фичи
      );

      if (featureExists) return { features: state.features }; // Фича уже есть, не добавляем её

      return { features: [...state.features, feature] }; // Добавляем только новые фичи
    });
  },

  removeFeature: (featureId) => {
    set((state) => {
      const idToRemove = String(featureId); // Приводим ID к строке для корректного сравнения

      // Находим фичу по ID
      const featureToRemove = state.features.find(
        (f) => String(f.getId()) === idToRemove // Используем getId() для поиска
      );

      if (featureToRemove) {
        // Удаляем фичу с карты
        vectorSource.removeFeature(featureToRemove);
      }

      // Фильтруем и удаляем только нужную фичу
      return {
        features: state.features.filter(
          (f) => String(f.getId()) !== idToRemove // Используем getId() для сравнения
        ),
      };
    });
  },

  clearFeatures: () => {
    vectorSource.clear(); // Очистим слой карты
    set({ features: [] });
  },
}));
