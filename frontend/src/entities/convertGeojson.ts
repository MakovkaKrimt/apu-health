import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Geometry, MultiPolygon } from "ol/geom";
import WKT from "ol/format/WKT";

/**
 * Конвертирует GeoJSON MultiPolygon в WKT.
 * @param input Объект, который может быть либо чистым GeoJSON (Feature или FeatureCollection),
 * либо уже экземпляром OL Feature.
 * @returns строка WKT MULTIPOLYGON или null, если формат некорректен
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const convertGeoJSONToWKT = (input: any): string | null => {
  console.log("Полученные данные:", input);

  try {
    let features: Feature<Geometry>[];

    // Если передан экземпляр OL Feature, используем его напрямую
    if (input instanceof Feature) {
      features = [input];
    }
    // Если передан объект, содержащий тип (например, FeatureCollection или Feature)
    else if (input && input.type) {
      const format = new GeoJSON();
      features = format.readFeatures(input, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
    } else {
      console.error(
        "Ошибка: переданный объект не является корректным GeoJSON или Feature"
      );
      return null;
    }

    if (features.length === 0) {
      console.error("Ошибка: не получено ни одной фичи из GeoJSON");
      return null;
    }

    const wktFormat = new WKT();
    const wktStrings: string[] = [];

    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry instanceof MultiPolygon) {
        const wkt = wktFormat.writeGeometry(geometry);
        wktStrings.push(wkt);
      } else {
        console.warn("Геометрия не является MultiPolygon, пропуск.");
      }
    });

    const result = wktStrings.length > 0 ? wktStrings.join(" ") : null;
    // console.log("Результат конвертации:", result);
    return result;
  } catch (error) {
    console.error("Ошибка при конвертации GeoJSON в WKT:", error);
    return null;
  }
};
