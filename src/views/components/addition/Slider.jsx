import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAlbumData } from "redux/slice/albumSlice";
import { setAlbumSwiperDialog } from "redux/slice/statusSlice";
import { setMarkerSlider } from "redux/slice/markerSlice";

import { getMarkerAll, getMarkerMatchRegion } from "redux/thunk/markerThunk";
import { getAlbumMatchMarkerId } from "redux/thunk/albumThunk";
import { getPhotoMatchAlbumId } from "redux/thunk/photoThunk";

import { getAddr, getAddrPriority, getKoreanAddr } from "lib/utils/addr";
import { groupRegion } from "lib/utils/jsUtils";

import "./Slider.scss";
function Slider(props) {
  const dispatch = useDispatch();

  const sortStatus = useSelector((state) => state.status.option.sort);

  const mapRegion = useSelector((state) => state.map.region);
  const markerData = useSelector((state) => state.marker.data);
  const sliderTimeData = useSelector((state) => state.marker.slider.time);
  const sliderRegionData = useSelector((state) => state.marker.slider.region);

  useEffect(() => {
    if (mapRegion === "korea") {
      dispatch(getMarkerAll());
    } else {
      dispatch(getMarkerMatchRegion(getKoreanAddr(mapRegion)));
    }
  }, [mapRegion]);

  const handleGetSliderInfo = async () => {
    const sliderInfo = markerData.reduce(async (slider, marker, idx) => {
      const sliderPromise = await slider;
      const albumData = dispatch(
        getAlbumMatchMarkerId({ markerId: marker.id })
      ).then((response) => {
        return response.payload;
      });
      const gatherData = Promise.all(
        (await albumData).map(async (album) => {
          const photoData = dispatch(
            getPhotoMatchAlbumId({ albumId: album.id })
          ).then((response) => {
            return response.payload;
          });
          return {
            album,
            photo: await photoData,
          };
        })
      );
      (await gatherData).forEach((gather) => {
        sliderPromise.push({ ...gather, marker });
      });
      return sliderPromise;
    }, []);

    const sliderTime = (await sliderInfo).sort((a, b) =>
      b.album.date.localeCompare(a.album.date)
    );

    dispatch(
      setMarkerSlider({
        type: "time",
        data: sliderTime,
      })
    );

    const addrPriority = getAddrPriority();
    const sliderRegion = Object.entries(
      groupRegion({ array: await sliderInfo })
    )
      .map(([key, values]) => {
        return [
          key,
          Object.entries(values).sort((a, b) =>
            a[0] === b[0]
              ? b[1].album.date.localeCompare(a[1].album.date)
              : a[0].localeCompare(b[0])
          ),
        ];
      })
      .sort((a, b) => addrPriority.indexOf(a[0]) - addrPriority.indexOf(b[0]));

    dispatch(
      setMarkerSlider({
        type: "region",
        data: sliderRegion,
      })
    );
  };

  useEffect(() => {
    if (markerData) {
      handleGetSliderInfo();
    }
  }, [markerData]);

  return (
    <>
      {sortStatus
        ? sliderRegionData?.map(([district, regions], index) => {
            return (
              <>
                {regions.map(([region, values], idx) => {
                  return (
                    <>
                      {values.map(({ marker, album, photo }) => {
                        return <></>;
                      })}
                    </>
                  );
                })}
              </>
            );
          })
        : sliderTimeData?.map(({ marker, album, photo }, index) => {
            return (
              <section
                className="slider-time"
                key={`slider-${index}`}
                onClick={() => {
                  dispatch(setAlbumData([{ marker, album, photo }]));
                  dispatch(setAlbumSwiperDialog(true));
                }}
              >
                <header className="time-header">
                  <article className="time-addr">
                    {getAddr(marker.region.addr)}
                  </article>
                  <article className="time-photo-ea">
                    <span>{photo.length}</span>
                    <span>🥕</span>
                  </article>
                </header>
                <main className="time-main">
                  <article className="time-date">{album.date}</article>
                  <article className="time-title">{album.title}</article>
                  <article className="time-addr">{marker.region.addr}</article>
                  <article className="time-semi-addr">
                    {marker.region.semiAddr}
                  </article>
                </main>
              </section>
            );
          })}
    </>
  );
}
export default Slider;
