import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, MapBrowserEvent, Overlay, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { ImageWMS, OSM, TileWMS, XYZ } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat, toLonLat } from "ol/proj";
import { useMapStore, useMapVariant } from "@/store/useMapStore";
import { DragAndDrop } from "ol/interaction";
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { MultiPolygon, Point, Polygon } from "ol/geom";
import { Style, Fill, Stroke, Icon } from "ol/style";
import pointIcon from "../assets/image.png";
import { useGeoJsonStore } from "@/store/useGeoJsonStore";
import { geoserver_url } from "@/store/urls";
import ImageLayer from "ol/layer/Image";

const MOSCOW_CENTER = fromLonLat([37.756525, 55.754187]);
const MOSCOW_EXTENT = [...fromLonLat([37.3, 55.5]), ...fromLonLat([37.9, 56])];

const MapComponent: React.FC = () => {
  const [, setJsonPopupOpen] = useState(false); // State for JSON popup visibility
  const showWmsLayer2 = useMapStore((state) => state.showWmsLayer2);
  const showGeojsonLayer = useMapStore((state) => state.showGeojsonLayer);
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const popupContainerRef = useRef<HTMLDivElement>(null);
  const setExtent = useMapStore((state) => state.setExtent);
  const variant = useMapVariant((state) => state.variant);
  const { features, addFeature } = useGeoJsonStore();
  const osmLayer = useRef(
    new TileLayer({
      source: new OSM({ attributions: [] }),
    })
  );
  const arcgisLayer = useRef(
    new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        crossOrigin: "anonymous",
      }),
    })
  );

  const wmsLayer2 = useRef(
    new ImageLayer({
      source: new ImageWMS({
        url: geoserver_url,
        params: {
          LAYERS: "dipp:industrial_sites",
          TILED: true,
          VERSION: "1.1.0",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
    })
  );
  // const wmsLayer2 = useRef(
  //   new ImageLayer({
  //     source: new ImageWMS({
  //       url: geoserver_url,
  //       params: {
  //         LAYERS: "dipp:industrial_sites",
  //         TILED: true,
  //         VERSION: "1.1.0",
  //       },
  //       serverType: "geoserver",
  //       crossOrigin: "anonymous",
  //     }),
  //   })
  // );

  const policlinics = useRef(
    new ImageLayer({
      source: new ImageWMS({
        url: geoserver_url,
        params: {
          LAYERS: "heath:v_polyclinics",
          TILED: true,
          VERSION: "1.1.0",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
    })
  );

  const buildings = useRef(
    new TileLayer({
      source: new TileWMS({
        url: geoserver_url,
        params: {
          LAYERS: "heath:buildings",
          TILED: true,
          VERSION: "1.1.0",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
    })
  );

  // const heatmap = useRef(
  //   new ImageLayer({
  //     source: new ImageWMS({
  //       url: geoserver_url,
  //       params: {
  //         LAYERS: "heath:population",
  //         TILED: true,
  //         VERSION: "1.1.0",
  //       },
  //       serverType: "geoserver",
  //       crossOrigin: "anonymous",
  //     }),
  //   })
  // );

  const districts = useRef(
    new TileLayer({
      source: new TileWMS({
        url: geoserver_url,
        params: {
          LAYERS: "heath:districts",
          TILED: true,
          VERSION: "1.1.0",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
    })
  );

  const vectorSource = useRef(new VectorSource());
  const vectorLayer = useRef(
    new VectorLayer({
      source: vectorSource.current,
      style: (feature) => {
        if (feature.getGeometry() instanceof Point) {
          return new Style({
            image: new Icon({
              src: pointIcon.src,
              scale: 0.8,
              anchor: [0.5, 0.5],
            }),
          });
        }
        if (
          feature.getGeometry() instanceof MultiPolygon ||
          feature.getGeometry() instanceof Polygon
        ) {
          return new Style({
            fill: new Fill({
              color: "rgba(255, 1, 201,0)",
            }),
            stroke: new Stroke({
              color: "rgb(255, 1, 201)",
              width: 3,
            }),
          });
        }
        return new Style();
      },
    })
  );

  useEffect(() => {
    if (!mapElement.current) return;

    const map = new Map({
      target: mapElement.current,
      layers: [
        osmLayer.current,
        // arcgisLayer.current,
        // heatmap.current,
        buildings.current,
        policlinics.current,
        districts.current,
      ],
      view: new View({
        center: MOSCOW_CENTER,
        zoom: 14,
        minZoom: 9,
        extent: MOSCOW_EXTENT,
      }),
      controls: defaultControls(),
    });

    mapRefInstance.current = map;

    const dragAndDrop = new DragAndDrop({
      formatConstructors: [GeoJSON],
    });

    dragAndDrop.on("addfeatures", (event) => {
      const features = event.features;
      if (features) {
        const typedFeatures: Feature[] = features as Feature[];

        vectorSource.current.addFeatures(typedFeatures);
        typedFeatures.forEach((feature) => {
          addFeature(feature);
        });

        const extent = vectorSource.current.getExtent();
        map.getView().fit(extent, {
          duration: 300,
          padding: [50, 50, 50, 50],
        });
      }
    });

    map.addInteraction(dragAndDrop);

    map.getView().on("change", () => {
      const view = map.getView();
      const size = map.getSize();
      if (!size) return;
      const newExtent = view.calculateExtent(size);
      setExtent([
        ...toLonLat([newExtent[0], newExtent[1]]),
        ...toLonLat([newExtent[2], newExtent[3]]),
      ]);
    });

    if (popupContainerRef.current) {
      const overlay = new Overlay({
        element: popupContainerRef.current,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;
    }

    interface WmsFeature {
      properties: {
        [key: string]: string | number;
      };
    }

    interface FetchWmsResult {
      layerIndex: number;
      data: { features: WmsFeature[] } | null;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      error?: any; // Error can optionally exist in the result.
    }

    const fetchWmsData = (
      event: MapBrowserEvent<UIEvent>
    ): Promise<FetchWmsResult[]> => {
      const viewResolution = map.getView().getResolution();
      if (!viewResolution) {
        return Promise.resolve([]); // Return an empty array if no resolution is found
      }

      const wmsLayers = [policlinics.current];

      const promises = wmsLayers.map((layer, index) => {
        const source = layer.getSource();
        if (!source) {
          return Promise.resolve({ layerIndex: index, data: null });
        }

        const url = source.getFeatureInfoUrl(
          event.coordinate,
          viewResolution,
          "EPSG:3857",
          {
            INFO_FORMAT: "application/json",
          }
        );

        if (url) {
          return fetch(url)
            .then((response) => response.json())
            .then((data) => ({ layerIndex: index, data }))
            .catch((error) => ({
              layerIndex: index,
              data: null, // If there's an error, we still return a valid object with `data: null`
              error,
            }));
        } else {
          return Promise.resolve({
            layerIndex: index,
            data: null,
          });
        }
      });

      return Promise.all(promises);
    };
    map.on("singleclick", (event: MapBrowserEvent<UIEvent>) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature && popupContainerRef.current) {
        const coordinate = event.coordinate;
        const properties = { ...feature.getProperties() };
        delete properties.geometry;

        const tableContent = Object.entries(properties)
          .map(([key, value]) => {
            return `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
          })
          .join("");

        popupContainerRef.current.innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Свойство</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Значение</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
            </tbody>
          </table>
        `;
        overlayRef.current?.setPosition(coordinate);
        setJsonPopupOpen(true);
      } else {
        fetchWmsData(event)
          .then((results) => {
            const validResults = results.filter(
              /* eslint-disable  @typescript-eslint/no-explicit-any */
              (result): result is { layerIndex: number; data: any } => {
                return !!(
                  result.data &&
                  result.data.features &&
                  result.data.features.length > 0
                ); // Ensure a boolean value is returned
              }
            );

            if (validResults.length > 0) {
              if (popupContainerRef.current) {
                const tableContent = validResults
                  .map((result) => {
                    const featuresContent = result.data.features
                      /* eslint-disable  @typescript-eslint/no-explicit-any */
                      .map((feature: any) => {
                        const properties = feature.properties;
                        return Object.entries(properties)
                          .map(([key, value]) => {
                            return `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
                          })
                          .join("");
                      })
                      .join("");

                    return `
                      <div style="margin-bottom: 20px;" class="table">
                        <h4 style="margin: 0; padding: 10px; background-color:#01538b;color:#f2f2f2;text-align:center;">Поликлиники</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                          <thead>
                            <tr>
                              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; width: 30%;">Поле</th>
                              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; width: 70%;">Значение</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${featuresContent}
                          </tbody>
                        </table>
                      </div>
                    `;
                  })
                  .join("");

                popupContainerRef.current.innerHTML = tableContent;
                overlayRef.current?.setPosition(event.coordinate);
              }
              setJsonPopupOpen(true);
            } else {
              if (popupContainerRef.current) {
                overlayRef.current?.setPosition(undefined);
                setJsonPopupOpen(false);
              }
            }
          })
          .catch((error) => {
            console.error("Ошибка при получении WMS данных:", error);
            if (popupContainerRef.current) {
              overlayRef.current?.setPosition(undefined);
              setJsonPopupOpen(false);
            }
          });
      }
    });
    return () => {
      map.setTarget(undefined);
    };
  }, [setExtent, addFeature]);

  useEffect(() => {
    if (variant === "osm") {
      osmLayer.current.setVisible(true);
      arcgisLayer.current.setVisible(false);
    } else if (variant === "arcgis") {
      osmLayer.current.setVisible(false);
      arcgisLayer.current.setVisible(true);
    }
  }, [variant]);

  useEffect(() => {
    if (!vectorSource.current) return;
    const currentFeatures = vectorSource.current.getFeatures();
    currentFeatures.forEach((feature) => {
      const fid = feature.getId();
      const exists = features.some((f) => f.getId() === fid);
      if (!exists) {
        vectorSource.current.removeFeature(feature);
      }
    });
  }, [features]);

  useEffect(() => {
    if (wmsLayer2.current) {
      wmsLayer2.current.setVisible(showWmsLayer2);
      mapRefInstance.current?.render();
    }
  }, [showWmsLayer2]);

  useEffect(() => {
    if (vectorLayer.current) {
      vectorLayer.current.setVisible(showGeojsonLayer);
      mapRefInstance.current?.render();
    }
  }, [showGeojsonLayer]);

  return (
    <>
      <div
        ref={mapElement}
        className="map-element"
        style={{ width: "872px", height: "887px" }}
      />
      <div
        ref={popupContainerRef}
        className="ol-popup"
        style={{
          position: "absolute",
          backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #cccccc",
          bottom: "12px",
          left: "-100px",
          minWidth: "200px",
          maxWidth: "500px",
          maxHeight: "300px", // Установить максимальную высоту для прокрутки
          overflowY: "auto", // Добавить прокрутку
          overflowX: "auto", // Если вам не нужна горизонтальная прокрутка
          zIndex: 9999, // Для повышения приоритетности
          pointerEvents: "auto",
        }}
      >
        {/* Контент попапа */}
      </div>
    </>
  );
};

export default MapComponent;
