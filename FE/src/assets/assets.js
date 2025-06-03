import logo from "./logo.png";
import menu1 from "./menu1.jpg";
import menu2 from "./menu2.jpg";
import menu3 from "./menu3.jpg";
import menu4 from "./menu4.jpg";
import star from "./star.png";
import remove from "./remove.svg";
import add from "./add.svg";
import gg_play from "./gg_play.png";
import app_store from "./app_store.jpg";
import profile from "./profile.jpg";

const assets = {
  logo,
  star,
  remove,
  add,
  gg_play,
  app_store,
  profile,
};

const menu_list = [
  { name: "beverage", image: menu1 },
  { name: "combo", image: menu2 },
  { name: "food", image: menu3 },
  { name: "dessert", image: menu4 },
];

const arrange = ["price-asc", "price-desc", "rating-desc"];

const start_rating = [1, 2, 3, 4, 5];

export { assets, menu_list, arrange, start_rating };
