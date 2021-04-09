// am4Charts
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


export default function am4themes_inspire(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      // Row1
      am4core.color("#162B3D"),
      am4core.color("#336690"),
      am4core.color("#4A92CE"),
      am4core.color("#80B2DC"),
      am4core.color("#A4C8E6"),
      
      // Row2
      am4core.color("#75757C"),
      am4core.color("#252752"),
      am4core.color("#363976"),
      am4core.color("#72749F"),
      am4core.color("#C2C3D5"),
    ];
  }
}

// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_inspire);
