/** clear */
export const clearRef = (refList) => {
  refList.forEach((ref) => ref.current && (ref.current.value = ""));
};

export const clearPreview = ($preview) => {
  while ($preview.lastChild) {
    if ($preview.lastChild.tagName === "ARTICLE") {
      $preview.removeChild($preview.lastChild);
    } else {
      break;
    }
  }
};

/** inspection */
export const inspectRef = (ref) => {
  return ref?.current?.value && ref?.current?.value == "";
};
export const inspectRefList = (refList) => {
  return refList.every(
    (ref) => ref?.current?.value && ref?.current?.value !== ""
  );
};
export const inspectRefFile = (refFile) => {
  return refFile?.current?.files?.length == 0;
};

/** filter */
export const childNodesFilter = ({ childNodes, keepType }) => {
  return Array.from(childNodes).filter((node) => node.tagName === keepType);
};

/** grouping */
export const groupSortType = ({ array, type }) => {
  return array.reduce((acc, cur) => {
    const dataType = type
      ? cur.marker.region.addr.replace(/[0-9]|\-/g, "").trim()
      : cur.album.date.split(" ").at(0);

    if (!acc[dataType]) acc[dataType] = [];
    acc[dataType].push(cur);
    return acc;
  }, {});
};

export const groupRegion = ({ array }) => {
  return array.reduce(
    (acc, cur) => {
      const dataRegion = cur.marker.region.addr
        .replace(/[0-9]|\-/g, "")
        .trim()
        .split(" ");
      const distRegion = dataRegion.at(0);
      const semiRegion = dataRegion.slice(1, dataRegion.length).join(" ");

      if (!acc.district.hasOwnProperty(distRegion))
        acc.district[distRegion] = [];
      if (!acc.district[distRegion].includes(semiRegion))
        acc.district[distRegion].push(semiRegion);
      if (!acc.region.hasOwnProperty(semiRegion)) acc.region[semiRegion] = [];
      acc.region[semiRegion].push(cur);

      return acc;
    },
    { district: {}, region: {} }
  );
};
