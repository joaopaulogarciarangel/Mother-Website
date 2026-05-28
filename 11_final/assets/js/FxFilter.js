class FxFilter {
  static elements = new WeakMap();
  static filters = new Map();
  static filterOptions = new Map();
  static running = false;
  static add(options) {
    if (typeof options === "string") {
      const name = arguments[0];
      const callback = arguments[1];
      this.filters.set(name, callback);
      this.filterOptions.set(name, {
        name,
        callback,
        updatesOn: []
      });
    } else {
      const {
        name,
        callback,
        updatesOn = []
      } = options;
      this.filters.set(name, callback);
      this.filterOptions.set(name, {
        name,
        callback,
        updatesOn
      });
    }
  }
  static init() {
    if ("CSS" in window && "registerProperty" in CSS) {
      try {
        CSS.registerProperty({
          name: "--fx-filter",
          syntax: "*",
          inherits: false,
          initialValue: "",
        });
      } catch (e) {}
    }
    if (!this.running) {
      this.running = true;
      this.tick();
    }
  }
  static tick() {
    this.scanElements();
    requestAnimationFrame(() => this.tick());
  }
  static scanElements() {
    document.querySelectorAll("*:not(.fx-container):not(svg)").forEach((element) => {
      const fxFilter = this.getFxFilterValue(element);
      const storedState = this.elements.get(element);
      if (fxFilter) {
        let parsedFilter;
        if (storedState && storedState.filter === fxFilter && storedState.parsedFilter) {
          parsedFilter = storedState.parsedFilter;
        } else {
          parsedFilter = this.parseFilterValue(fxFilter);
        }
        const currentStyles = this.getTrackedStyles(element, fxFilter, parsedFilter);
        if (!storedState) {
          this.addFxContainer(element, fxFilter, parsedFilter);
          this.elements.set(element, {
            filter: fxFilter,
            hasContainer: true,
            trackedStyles: currentStyles,
            parsedFilter: parsedFilter,
          });
        } else if (storedState.filter !== fxFilter || this.stylesChanged(storedState.trackedStyles, currentStyles)) {
          this.removeFxContainer(element);
          this.addFxContainer(element, fxFilter, parsedFilter);
          this.elements.set(element, {
            filter: fxFilter,
            hasContainer: true,
            trackedStyles: currentStyles,
            parsedFilter: parsedFilter,
          });
        }
      } else {
        if (storedState && storedState.hasContainer) {
          this.removeFxContainer(element);
          this.elements.delete(element);
        }
      }
    });
  }
  static getFxFilterValue(element) {
    const computed = getComputedStyle(element);
    return computed.getPropertyValue("--fx-filter").trim() || null;
  }
  static addFxContainer(element, filterValue, parsedFilter) {
    if (element.querySelector(".fx-container")) {
      return;
    }
    const {
      orderedFilters,
      customFilters
    } = parsedFilter || this.parseFilterValue(filterValue);
    const filterParts = [];
    let svgContent = "";
    orderedFilters.forEach((item) => {
      if (item.type === "custom") {
        const filter = item.filter;
        const callback = this.filters.get(filter.name);
        if (callback) {
          const filterId = `fx-${filter.name}-${Math.random().toString(36).substr(2, 6)}`;
          const filterContent = callback(element, ...filter.params);
          svgContent += `<filter id="${filterId}"
                     x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"
                     >${filterContent}</filter>`;
          filterParts.push(`url(#${filterId})`);
        }
      } else if (item.type === "css") {
        filterParts.push(item.filter);
      }
    });
    const backdropFilter = filterParts.join(" ");
    if (backdropFilter.trim()) {
      element.innerHTML += `
                <svg class="fx-svg-defs" data-fx-svg="true" style="position: absolute; width: 0; height: 0;">
                    ${svgContent}
                </svg>
                <div class="fx-container" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; backdrop-filter: ${backdropFilter}; background: transparent; pointer-events: none; z-index: -1; overflow: hidden; border-radius: inherit;"></div>
            `;
      this.elements.set(element, {
        filter: filterValue,
        hasContainer: true
      });
    }
  }
  static createUnifiedSVG(customFilters) {
    const svg = document.createElement("svg");
    svg.style.cssText = "position: absolute; width: 0; height: 0; pointer-events: none;";
    const filterIds = [];
    let svgContent = "";
    customFilters.forEach((filter, index) => {
      const callback = this.filters.get(filter.name);
      if (callback) {
        const filterId = `fx-${filter.name}-${Math.random().toString(36).substr(2, 6)}`;
        filterIds.push(filterId);
        const filterContent = callback(...filter.params);
        svgContent += `<filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">${filterContent}</filter>`;
      }
    });
    svg.innerHTML = svgContent;
    return {
      svg,
      filterIds
    };
  }
  static removeFxContainer(element) {
    element.querySelectorAll('.fx-container, svg.fx-svg-defs, svg[data-fx-svg="true"]').forEach((el) => el.remove());
  }
  static parseFilterValue(filterValue) {
    const orderedFilters = [];
    const customFilters = [];
    const filterRegex = /(\w+(?:-\w+)*)\s*\(([^)]*)\)/g;
    let match;
    while ((match = filterRegex.exec(filterValue)) !== null) {
      const filterName = match[1];
      const params = match[2];
      if (this.filters.has(filterName)) {
        let paramArray = [];
        if (params.trim() !== "") {
          paramArray = params.split(",").map((p) => {
            const trimmed = p.trim();
            if (trimmed === "") return undefined;
            const number = parseFloat(trimmed);
            return !isNaN(number) ? number : trimmed;
          }).filter((p) => p !== undefined);
        }
        const customFilter = {
          name: filterName,
          params: paramArray
        };
        customFilters.push(customFilter);
        orderedFilters.push({
          type: "custom",
          filter: customFilter
        });
      } else {
        orderedFilters.push({
          type: "css",
          filter: `${filterName}(${params})`,
        });
      }
    }
    return {
      orderedFilters: orderedFilters,
      customFilters: customFilters,
    };
  }
  static getTrackedStyles(element, filterValue, parsedFilter) {
    const {
      customFilters
    } = parsedFilter || this.parseFilterValue(filterValue);
    const trackedStyles = new Map();
    customFilters.forEach((filter) => {
      const filterOptions = this.filterOptions.get(filter.name);
      if (filterOptions && filterOptions.updatesOn) {
        const computed = getComputedStyle(element);
        filterOptions.updatesOn.forEach((styleProp) => {
          const value = computed.getPropertyValue(styleProp);
          trackedStyles.set(styleProp, value);
        });
      }
    });
    return trackedStyles;
  }
  static stylesChanged(oldStyles, newStyles) {
    if (!oldStyles || !newStyles) return true;
    if (oldStyles.size !== newStyles.size) return true;
    for (const [prop, value] of newStyles) {
      if (oldStyles.get(prop) !== value) {
        return true;
      }
    }
    return false;
  }
}
FxFilter.add({
  name: "noise",
  callback: (element, saturation = 0, intensity = 1, opacity = 0.25) => {
    const canvas = document.createElement("canvas");
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const imageDataAdd = ctx.createImageData(canvas.width, canvas.height);
    const dataAdd = imageDataAdd.data;
    const additiveIntensity = intensity;
    for (let i = 0; i < dataAdd.length; i += 4) {
      const noiseValue1 = Math.random() * additiveIntensity * 255;
      const noiseValue2 = Math.random() * additiveIntensity * 255;
      const noiseValue3 = Math.random() * additiveIntensity * 255;
      const baseNoise = noiseValue1;
      dataAdd[i] = baseNoise * (1 - saturation) + noiseValue1 * saturation;
      dataAdd[i + 1] = baseNoise * (1 - saturation) + noiseValue2 * saturation;
      dataAdd[i + 2] = baseNoise * (1 - saturation) + noiseValue3 * saturation;
      dataAdd[i + 3] = 255 * opacity;
    }
    ctx.putImageData(imageDataAdd, 0, 0);
    const noiseAdditiveURL = canvas.toDataURL();
    return `
                <feImage href="${noiseAdditiveURL}" result="noiseAdd" image-rendering="pixelated"/>
                <feBlend in="SourceGraphic" in2="noiseAdd" mode="overlay" image-rendering="pixelated" result="brightened"/>
                `;
  },
  updatesOn: ["width", "height"],
});
FxFilter.add({
  name: "liquid-glass",
  callback: (element, refraction = 1, offset = 10, chromatic = 0) => {
    const width = Math.round(element.offsetWidth);
    const height = Math.round(element.offsetHeight);
    const refractionValue = parseFloat(refraction) / 2 || 0;
    const offsetValue = (parseFloat(offset) || 0) / 2;
    const chromaticValue = parseFloat(chromatic) || 0;
    const borderRadiusStr = window.getComputedStyle(element).borderRadius || "0";
    let borderRadius = 0;
    if (borderRadiusStr.includes("%")) {
      const percentage = parseFloat(borderRadiusStr);
      const elementSize = Math.min(element.offsetWidth, element.offsetHeight);
      borderRadius = (percentage / 100) * elementSize;
    } else {
      borderRadius = parseFloat(borderRadiusStr);
    }

    function createDisplacementMap(refractionMod) {
      const adjustedRefraction = refractionValue + refractionMod;
      const imageData = new ImageData(maxDimension, maxDimension);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 127;
        data[i + 1] = 127;
        data[i + 2] = 127;
        data[i + 3] = 255;
      }
      const topOffset = Math.floor(maxDimension / 2);
      for (let y = 0; y < topOffset; y++) {
        for (let x = 0; x < maxDimension; x++) {
          const gradientSegment = (topOffset - y) / topOffset;
          const pixelIndex = (y * maxDimension + x) * 4;
          const vyValue = 1 * adjustedRefraction;
          data[pixelIndex + 2] = Math.max(0, Math.min(255, Math.round(127 + 127 * vyValue * Math.pow(gradientSegment, 1))));
        }
      }
      for (let y = maxDimension - topOffset; y < maxDimension; y++) {
        for (let x = 0; x < maxDimension; x++) {
          const gradientSegment = (y - (maxDimension - topOffset)) / topOffset;
          const pixelIndex = (y * maxDimension + x) * 4;
          const vyValue = -1 * adjustedRefraction;
          data[pixelIndex + 2] = Math.max(0, Math.min(255, Math.round(127 + 127 * vyValue * Math.pow(gradientSegment, 1))));
        }
      }
      const leftOffset = Math.floor(maxDimension / 2);
      for (let y = 0; y < maxDimension; y++) {
        for (let x = 0; x < leftOffset; x++) {
          const gradientSegment = (leftOffset - x) / leftOffset;
          const pixelIndex = (y * maxDimension + x) * 4;
          const vxValue = 1 * adjustedRefraction;
          data[pixelIndex] = Math.max(0, Math.min(255, Math.round(127 + 127 * vxValue * Math.pow(gradientSegment, 1))));
        }
      }
      for (let y = 0; y < maxDimension; y++) {
        for (let x = maxDimension - leftOffset; x < maxDimension; x++) {
          const gradientSegment = (x - (maxDimension - leftOffset)) / leftOffset;
          const pixelIndex = (y * maxDimension + x) * 4;
          const vxValue = -1 * adjustedRefraction;
          data[pixelIndex] = Math.max(0, Math.min(255, Math.round(127 + 127 * vxValue * Math.pow(gradientSegment, 1))));
        }
      }
      return imageData;
    }

    function createCanvasFromImageData(imageData) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const offsetX = (maxDimension - width) / 2;
      const offsetY = (maxDimension - height) / 2;
      ctx.putImageData(imageData, -Math.round(offsetX), -Math.round(offsetY));
      if (borderRadius > 0) {
        const maskCanvas = new OffscreenCanvas(width, height);
        const maskCtx = maskCanvas.getContext("2d");
        maskCtx.fillStyle = "rgb(127, 127, 127)";
        maskCtx.beginPath();
        const inset = offsetValue * 1;
        maskCtx.roundRect(inset, inset, width - inset * 2, height - inset * 2, Math.max(0, borderRadius - inset));
        maskCtx.clip();
        maskCtx.fillRect(0, 0, width, height);
        ctx.filter = `blur(${offsetValue}px)`;
        ctx.drawImage(maskCanvas, 0, 0, width, height);
      } else if (offsetValue > 0) {
        ctx.filter = `blur(${offsetValue}px)`;
        ctx.drawImage(canvas, 0, 0);
      }
      const dataURL = canvas.toDataURL();
      canvas.remove();
      return dataURL;
    }
    const maxDimension = Math.ceil(Math.max(width, height));
    if (chromaticValue === 0) {
      const imageData = createDisplacementMap(0);
      const dataURL = createCanvasFromImageData(imageData);
      return `
                <feImage result="FEIMG" href="${dataURL}" color-interpolation-filters="sRGB"/>
                <feDisplacementMap in="SourceGraphic" in2="FEIMG" scale="127" yChannelSelector="B" xChannelSelector="R" color-interpolation-filters="sRGB"/>
            `;
    } else {
      const chromaticOffset = chromaticValue * 0.25;
      const redImageData = createDisplacementMap(chromaticOffset);
      const greenImageData = createDisplacementMap(0);
      const blueImageData = createDisplacementMap(-chromaticOffset);
      const redDataURL = createCanvasFromImageData(redImageData);
      const greenDataURL = createCanvasFromImageData(greenImageData);
      const blueDataURL = createCanvasFromImageData(blueImageData);
      return `
                <!-- Red channel displacement -->
                <feImage result="redImg" href="${redDataURL}" color-interpolation-filters="sRGB"/>
                <feDisplacementMap in="SourceGraphic" in2="redImg" scale="127" yChannelSelector="B" xChannelSelector="R" color-interpolation-filters="sRGB" result="redDisplaced"/>
                <feComponentTransfer in="redDisplaced" result="redChannel">
                    <feFuncR type="identity"/>
                    <feFuncG type="discrete" tableValues="0"/>
                    <feFuncB type="discrete" tableValues="0"/>
                    <feFuncA type="identity"/>
                </feComponentTransfer>

                <!-- Green channel displacement -->
                <feImage result="greenImg" href="${greenDataURL}" color-interpolation-filters="sRGB"/>
                <feDisplacementMap in="SourceGraphic" in2="greenImg" scale="127" yChannelSelector="B" xChannelSelector="R" color-interpolation-filters="sRGB" result="greenDisplaced"/>
                <feComponentTransfer in="greenDisplaced" result="greenChannel">
                    <feFuncR type="discrete" tableValues="0"/>
                    <feFuncG type="identity"/>
                    <feFuncB type="discrete" tableValues="0"/>
                    <feFuncA type="identity"/>
                </feComponentTransfer>

                <!-- Blue channel displacement -->
                <feImage result="blueImg" href="${blueDataURL}" color-interpolation-filters="sRGB"/>
                <feDisplacementMap in="SourceGraphic" in2="blueImg" scale="127" yChannelSelector="B" xChannelSelector="R" color-interpolation-filters="sRGB" result="blueDisplaced"/>
                <feComponentTransfer in="blueDisplaced" result="blueChannel">
                    <feFuncR type="discrete" tableValues="0"/>
                    <feFuncG type="discrete" tableValues="0"/>
                    <feFuncB type="identity"/>
                    <feFuncA type="identity"/>
                </feComponentTransfer>

                <!-- Combine all channels -->
                <feComposite in="redChannel" in2="greenChannel" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="redGreen"/>
                <feComposite in="redGreen" in2="blueChannel" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="final"/>
            `;
    }
  },
  updatesOn: ["border-radius", "width", "height"],
});
FxFilter.add({
  name: "color-overlay",
  callback: (element, color = "black", opacity = 0.5) => {
    const alpha = typeof opacity === "string" ? parseFloat(opacity) : opacity;
    return `
            <feFlood flood-color="${color}" flood-opacity="${alpha}" result="flood"/>
            <feComposite in="flood" in2="SourceGraphic" operator="atop"/>
        `;
  },
  updatesOn: [],
});
FxFilter.init();
