import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAlbumData } from "redux/slice/albumSlice";
import { setAlbumSwiperDialog } from "redux/slice/statusSlice";
import { setMarkerSlider } from "redux/slice/markerSlice";

import { getMarkerAll, getMarkerMatchRegion } from "redux/thunk/markerThunk";
import { getAlbumMatchMarkerId } from "redux/thunk/albumThunk";
import { getPhotoMatchAlbumId } from "redux/thunk/photoThunk";

import {
  getAddr,
  getAddrPriority,
  getFullKoreanAddr,
  getKoreanAddr,
} from "lib/utils/addr";
import { groupRegion } from "lib/utils/jsUtils";

import ListIcon from "@mui/icons-material/List";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import "./Slider.scss";
function Slider(props) {
  const dispatch = useDispatch();

  const sortStatus = useSelector((state) => state.status.option.sort);

  const mapRegion = useSelector((state) => state.map.region);
  const markerData = useSelector((state) => state.marker.data);
  const sliderTimeData = useSelector((state) => state.marker.slider.time);
  const sliderRegionData = useSelector((state) => state.marker.slider.region);

  const handleClickDistrict = (index) => (e) => {
    const open = JSON.parse(e.target.dataset.open);
    console.log(open, typeof open);
    const $cities = document.querySelectorAll(`.slider-city-${index}`);
    $cities.forEach(($city) => {
      open
        ? $city.classList.remove("city-open")
        : $city.classList.add("city-open");
    });
    e.target.dataset.open = !open;
  };
  const handleClickCity = (idx) => (e) => {
    const open = JSON.parse(e.target.dataset.open);
    const $regions = document.querySelectorAll(`.slider-region-${idx}`);
    $regions.forEach(($region) => {
      open
        ? $region.classList.remove("region-open")
        : $region.classList.add("region-open");
    });
    e.target.dataset.open = !open;
  };

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
    if (mapRegion === "korea") {
      dispatch(getMarkerAll());
    } else {
      dispatch(getMarkerMatchRegion(getKoreanAddr(mapRegion)));
    }
  }, [mapRegion]);

  useEffect(() => {
    if (markerData) {
      handleGetSliderInfo();
    }
  }, [markerData]);

  return (
    <>
      {sortStatus
        ? sliderRegionData?.map(([district, cities], index) => {
            return (
              <section className="slider-district" key={`district-${index}`}>
                <header
                  className="district-name"
                  data-open={false}
                  onClick={handleClickDistrict(index)}
                >
                  {getFullKoreanAddr(district)}
                </header>
                {cities.map(([city, regions], idx) => {
                  return (
                    <section
                      className={`slider-city-${index}`}
                      key={`city-${idx}`}
                    >
                      <header
                        className="city-name"
                        data-open={false}
                        onClick={handleClickCity(idx)}
                      >
                        {city}
                      </header>
                      {regions.map(({ marker, album, photo }, i) => {
                        return (
                          <section
                            className={`slider-region-${idx}`}
                            key={`region-${i}`}
                          >
                            <header className="region-header">
                              <article className="region-addr">
                                {marker.region.addr}
                              </article>
                              <article className="region-photo-ea">
                                <span>{photo.length}</span>
                                <span>🥕</span>
                              </article>
                            </header>
                            <main className="region-main">
                              <article className="region-date">
                                {album.date}
                              </article>
                              <article className="region-title">
                                {album.title}
                              </article>
                              <article className="region-semi-addr">
                                {marker.region.semiAddr}
                              </article>
                            </main>
                          </section>
                        );
                      })}
                    </section>
                  );
                })}
              </section>
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
